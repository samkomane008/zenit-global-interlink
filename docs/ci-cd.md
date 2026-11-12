# Zenit Global Interlink CI/CD

`ci.yml` builds and validates pull requests and pushes to `main`.
`deploy-cloudflare.yml` now runs **only after the separate `ci` workflow
succeeds on a push to main**. It checks the exact commit is still current
main, checks the client-approved form key and Cloudflare configuration,
builds that commit and deploys its static assets using `wrangler.jsonc`.
A failed CI or stale SHA cannot publish a new site.

Repository secrets:
- `CLOUDFLARE_API_TOKEN`: restricted Cloudflare Workers deploy token
- `VITE_WEB3FORMS_KEY`: the client's approved form destination access key

Repository variable:
- `CLOUDFLARE_ACCOUNT_ID`: the configured Cloudflare account

Missing configuration **fails the deployment visibly** instead of
reporting a green workflow that silently skipped publishing. Keep
Cloudflare/Wrangler credentials secret and never replace the client's
Web3Forms destination without authorisation.

Watch Actions → `ci` and then `Deploy to Cloudflare`. A successful
deploy step means Cloudflare accepted the new assets; the subsequent
HTTPS check verifies the public endpoint responds. It does not guarantee
that every external CDN cache refreshed instantly. Preserve the client's
MX/SPF/DMARC records when changing website routing. If the deploy
fails, the current live Workers deployment remains in place; inspect
the logs before manually issuing another deploy.
