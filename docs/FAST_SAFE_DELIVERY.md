# Zenit Global Interlink — safe Cloudflare delivery

**Draft migration only. No production deployment was performed.** The legacy `deploy-cloudflare.yml` ran build steps on pull requests with the Cloudflare token in the job environment. That allows same-repository PR code to access a production credential even if its final Deploy step is skipped. The new workflow *never starts a privileged deploy job for a PR*.

## Delivery contract

- CI builds, runs `npm audit --omit=dev --audit-level=high`, tests the shared release verifier, and scans full Git history with Gitleaks without production credentials.
- Production CD triggers only after a successful `ci` **main-push** run and requires the *exact current* 40-char merge SHA, merged PR provenance, mandatory `website-build` + `secret-scan` success, and a final current-main recheck before Cloudflare publication.
- Cloudflare and Web3Forms values are visible only in the trusted deploy job's relevant steps. The Vite `VITE_WEB3FORMS_KEY` value is embedded into the public client bundle; treat it as a publishable form access key, not a server secret. Enforce server-side abuse/spam controls as appropriate.
- CD is **default OFF**. To enable, provision a separate `zenit-deploy` runner isolated from PR CI, set `ZENIT_DEPLOY_RUNNERS` to an explicit JSON label list including `self-hosted` and `zenit-deploy`, then configure `ZENIT_DEPLOY_ENABLED=true` only after verifying Cloudflare auth and independent preview acceptance.
- No `ubuntu-latest` deployment fallback. The CI build job still defaults to existing GitHub-hosted execution if no `ZENIT_CI_RUNNERS` variable is configured. With billing limits, provision an additional *CI-only* runner; do not reuse the trusted deploy identity.

## Cutover

Before merging the change, confirm last deployed Cloudflare revision, current domain health, successful exact-head `website-build`, `secret-scan` and dependency audit. Verify there are no existing separate automatic Cloudflare deployments that could bypass these gates. Configure the isolated deploy runner and smoke-test a nonproduction candidate; only then turn on the new CD flag. Keep a reviewed rollback artifact and test the deployed forms end-to-end.

This release still rebuilds from an exact tested SHA on the deploy runner; it is **not yet** immutable CI artifact promotion. Move to a CI-built digest-identified artifact with public form config separated from secrets in a later reviewed PR.

Central standard: https://github.com/samkomane008/samloryx-infrastructure/blob/main/docs/FAST_SAFE_DELIVERY.md
