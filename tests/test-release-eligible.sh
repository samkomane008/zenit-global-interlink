#!/usr/bin/env bash
# Hermetic tests of release eligibility. Absolutely no network or real GitHub writes.
set -Eeuo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BIN="$(mktemp -d)"
trap 'rm -rf "$BIN"' EXIT
cat > "$BIN/gh" <<'MOCK'
#!/usr/bin/env bash
set -Eeuo pipefail
case "$*" in
  *'/git/ref/heads/main'*)
    if [[ "${CASE:-}" == wrong_main ]]; then printf "f%.0s" {1..40}; echo
    else echo "${MOCK_MAIN:-$TEST_SHA}"; fi
    ;;
  *'/pulls?'*)
    [[ "${CASE:-}" != api_error ]] || exit 44
    if [[ "${CASE:-}" == missing_pr ]]; then echo '[]'
    else printf '[{"merged_at":"2026-11-15T08:00:00Z","base":{"ref":"main"},"merge_commit_sha":"%s"}]\n' "$TEST_SHA"; fi
    ;;
  *'/check-runs?'*)
    [[ "${CASE:-}" != api_error ]] || exit 44
    python3 - <<'PY'
import json,os
case=os.environ.get('CASE','happy')
sha=os.environ['TEST_SHA']
names=['core','security','SonarCloud Code Analysis']
if case=='missing_job':names.remove('security')
if case=='missing_sonar':names.remove('SonarCloud Code Analysis')
checks=[{'name':n,'head_sha':sha,'status':'completed','conclusion':'success'} for n in names]
if case=='pending':checks[0]['status']='in_progress';checks[0]['conclusion']=None
if case=='failed':checks[1]['conclusion']='failure'
if case=='skipped':checks[1]['conclusion']='skipped'
if case=='wrong_sha':checks[1]['head_sha']='f'*40
print(json.dumps({'total_count':len(checks)+(1 if case=='truncated' else 0),'check_runs':checks}))
PY
    ;;
  *'/actions/workflows/'*)
    python3 - <<'PY'
import json,os
case=os.environ.get('CASE','happy')
v={'head_sha':os.environ['TEST_SHA'],'event':'push','status':'completed','conclusion':'success'}
if case=='workflow_failed':v['conclusion']='failure'
if case=='workflow_pending':v['status']='in_progress';v['conclusion']=None
if case=='workflow_missing':v['head_sha']='f'*40
print(json.dumps({'total_count':1,'workflow_runs':[v]}))
PY
    ;;
  *) printf 'Unexpected gh command: %s\n' "$*" >&2; exit 93;;
esac
MOCK
chmod +x "$BIN/gh"
export PATH="$BIN:$PATH"
export TEST_SHA
TEST_SHA="$(printf 'a%.0s' {1..40})"

run_case() {
  local name="$1" expected="$2" code
  set +e
  CASE="$name" bash "$ROOT/scripts/release-eligible.sh" \
    --repo samkomane008/example --sha "$TEST_SHA" \
    --job core --job security --workflow ci.yml --require-sonar > "$BIN/out" 2>&1
  code=$?
  set -e
  if [[ "$expected" == pass && $code -ne 0 ]] || [[ "$expected" == fail && $code -eq 0 ]]; then
    printf 'FAIL: %s wanted %s got exit %s\n' "$name" "$expected" "$code" >&2
    cat "$BIN/out" >&2
    exit 1
  fi
  printf 'PASS: %-19s %s\n' "$name" "$expected"
}
run_case happy pass
run_case missing_pr fail
run_case missing_job fail
run_case missing_sonar fail
run_case pending fail
run_case skipped fail
run_case failed fail
run_case wrong_sha fail
run_case truncated fail
run_case workflow_failed fail
run_case workflow_pending fail
run_case workflow_missing fail
run_case api_error fail
run_case wrong_main fail
echo 'release eligibility regression suite: PASS'
