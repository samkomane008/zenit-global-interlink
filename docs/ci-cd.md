# Zenit Global Interlink CI/CD

`.github/workflows/ci.yml` builds the site on pull requests and
`main`. Its separate `deploy` job runs **only on pushes to main**
and requires the `build` job to succeed (`needs: build`). The
release uses the same checked-out main revision, checks that main
has not moved while preparing the release, verifies the client's
existing Cloudflare and Web3Forms configuration, builds the static
assets and publishes with `wrangler.jsonc`.

The old privileged `workflow_run` deployment has been removed to
avoid using a second untrusted workflow as a release trigger.

Repository secrets:
- `CLOUDFLARE_API_TOKEN`: scoped Cloudflare Workers deploy token
- `VITE_WEB3FORMS_KEY`: client-approved form destination key

Repository variable:
- `CLOUDFLARE_ACCOUNT_ID`: actual Cloudflare account

Missing configuration **fails deployment visibly**, rather than making
a successful job silently skip publication. Build failures block
deployment. Existing DNS, approved client content and email DNS
remain unchanged. Check the `cloudflare-production` job of the
`ci` workflow after merge for the deployment logs and live smoke result.
