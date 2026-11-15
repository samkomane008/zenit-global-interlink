#!/usr/bin/env bash
# Exact-main release eligibility. Read-only; never deploys.
# Only PR-merged main SHAs with all required checks/workflows may ship.
set -Eeuo pipefail
usage() { echo "Usage: $0 --repo OWNER/REPO --sha 40_HEX_SHA --job NAME [--job NAME] --workflow FILE [--workflow FILE] [--require-sonar]"; }
repo='' sha='' sonar=0
jobs=() workflows=()
fail() { printf 'RELEASE BLOCKED: %s\n' "$*" >&2; exit 1; }
while (($#)); do
  case "$1" in
    --repo|--sha|--job|--workflow)
      (($# >= 2)) || { usage >&2; exit 2; }
      case "$1" in
        --repo) repo=$2;;
        --sha) sha=$2;;
        --job) jobs+=("$2");;
        --workflow) workflows+=("$2");;
      esac
      shift 2;;
    --require-sonar) sonar=1; shift;;
    -h|--help) usage; exit 0;;
    *) usage >&2; exit 2;;
  esac
done
[[ "$repo" =~ ^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$ ]] || fail 'invalid repository'
[[ "$sha" =~ ^[a-f0-9]{40}$ ]] || fail 'invalid SHA'
((${#jobs[@]}>0 && ${#workflows[@]}>0)) || fail 'required jobs/workflows missing'
for job in "${jobs[@]}"; do [[ -n "$job" ]] || fail 'empty job name'; done
for wf in "${workflows[@]}"; do [[ "$wf" =~ ^[A-Za-z0-9_.-]+\.yml$ ]] || fail 'invalid workflow name'; done
for tool in gh jq; do command -v "$tool" >/dev/null || fail "missing $tool"; done
current="$(gh api "repos/$repo/git/ref/heads/main" --jq '.object.sha')" || fail 'cannot read main'
[[ "$current" == "$sha" ]] || fail 'main SHA moved'
prs="$(gh api "repos/$repo/commits/$sha/pulls?per_page=100")" || fail 'cannot read PR provenance'
jq -e --arg sha "$sha" 'type == "array" and any(.[]; .merged_at != null and .base.ref == "main" and .merge_commit_sha == $sha)' <<< "$prs" >/dev/null ||
  fail 'no merged main PR associated with release SHA'
checks="$(gh api "repos/$repo/commits/$sha/check-runs?per_page=100")" || fail 'cannot read check runs'
jq -e --arg sha "$sha" '.total_count == (.check_runs | length) and all(.check_runs[]; .head_sha == $sha)' <<< "$checks" >/dev/null ||
  fail 'truncated or invalid check-run response'
if ((sonar)); then jobs+=('SonarCloud Code Analysis'); fi
for job in "${jobs[@]}"; do
  jq -e --arg name "$job" '
    [.check_runs[] | select(.name == $name)] as $matches |
    ($matches | length > 0) and
    all($matches[]; .status == "completed" and .conclusion == "success")
  ' <<< "$checks" >/dev/null || fail "required check not green: $job"
done
for wf in "${workflows[@]}"; do
  runs="$(gh api "repos/$repo/actions/workflows/$wf/runs?head_sha=$sha&event=push&per_page=100")" ||
    fail "cannot read workflow $wf"
  jq -e --arg sha "$sha" '
    (.total_count <= 100)
    and any(.workflow_runs[]; .head_sha == $sha and .event == "push")
    and all(.workflow_runs[] | select(.head_sha == $sha and .event == "push");
      .status == "completed" and .conclusion == "success")
  ' <<< "$runs" >/dev/null || fail "workflow not green: $wf"
done
[[ "$(gh api "repos/$repo/git/ref/heads/main" --jq '.object.sha')" == "$sha" ]] ||
  fail 'main SHA moved during verification'
printf 'RELEASE ELIGIBLE: %s %s\n' "$repo" "$sha"
