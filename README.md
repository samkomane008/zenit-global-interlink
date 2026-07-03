# Zenit Global Interlink — Website

Marketing website for **Zenit Global Interlink Pty Ltd**, a Centurion-based logistics
and freight company serving South Africa and the wider SADC region.

Built as a fast, single-page static site with **React + Vite + Tailwind CSS**, with
working Quote, Contact, and Newsletter forms (no backend server required).

---

## Tech stack

| Piece            | Choice                          |
| ---------------- | ------------------------------- |
| Framework        | React 18                        |
| Build tool       | Vite 6                          |
| Styling          | Tailwind CSS 3                  |
| Icons            | lucide-react                    |
| Forms            | [Web3Forms](https://web3forms.com) (serverless email) |
| Hosting          | GitHub Pages (via GitHub Actions) |

---

## Local development

```bash
npm install        # install dependencies
npm run dev        # start dev server at http://localhost:5173
npm run build      # production build → ./dist
npm run preview    # preview the production build locally
```

---

## 1. Make the forms work (Web3Forms)

The Quote, Contact, and Newsletter forms submit through Web3Forms, which emails
submissions straight to your inbox — no server to run or maintain.

1. Go to **https://web3forms.com**.
2. Enter the email where you want to receive submissions (e.g. `zenitglobe@gmail.com`)
   and click **Create Access Key**.
3. Check that inbox for your **access key** (a long UUID).
4. Create a file named `.env` in the project root (copy from `.env.example`):

   ```
   VITE_WEB3FORMS_KEY=paste-your-access-key-here
   ```

5. Restart `npm run dev` (or rebuild) — forms now send real emails.

> The access key is **safe to expose** in frontend code — that's how Web3Forms is
> designed. It can only send mail to your verified address. The `.env` file is
> git-ignored, and for the live site the key is injected at build time from a
> GitHub secret (see below).

---

## 2. Deploy to GitHub Pages (automated)

This repo ships with a GitHub Actions workflow (`.github/workflows/deploy.yml`)
that builds and publishes the site on every push to `main`.

**One-time setup:**

1. Push this repo to GitHub (see commands below).
2. In the repo on GitHub: **Settings → Pages → Build and deployment → Source**,
   choose **GitHub Actions**.
3. Add your Web3Forms key as a secret so the live forms work:
   **Settings → Secrets and variables → Actions → New repository secret**
   - Name: `VITE_WEB3FORMS_KEY`
   - Value: your access key
4. Push any commit to `main` (or run the workflow manually from the **Actions**
   tab). When it finishes, your site is live at:

   ```
   https://<your-username>.github.io/<repo-name>/
   ```

The `base: "./"` setting in `vite.config.js` uses relative asset paths, so the
site works at that sub-path **and** at a custom domain with no changes.

### First push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Zenit Global Interlink website"
git branch -M main
# create the repo on github.com first (or with: gh repo create), then:
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

---

## 3. Custom domain

The site is served from **`zenitglobal.co.za`**. The domain is pinned by
`public/CNAME` (copied into the build as `dist/CNAME`), so GitHub Pages keeps it
across deploys, and the canonical / Open Graph / JSON-LD URLs in `index.html`
already point at it.

To (re)connect the domain:

1. In **Settings → Pages → Custom domain**, enter `zenitglobal.co.za` and save.
2. At your DNS provider, add the **web** records:
   - Apex (`@`): four **A records** to GitHub's IPs — `185.199.108.153`,
     `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
   - `www`: a **CNAME** to `samkomane008.github.io`.
3. Tick **Enforce HTTPS** once the certificate is issued (can take a few minutes).

If you move to a different domain, update `public/CNAME` **and** the canonical /
`og:url` / JSON-LD `url` values in `index.html`.

---

## 4. Email — `info@zenitglobal.co.za` (Zoho Mail)

Mail is hosted on **Zoho Mail**. Email records live on the **apex** and coexist
fine with the GitHub Pages A-records above (different record types). Values below
are Zoho's global/US data centre — if your Zoho account is on `zoho.eu` /
`zoho.in`, use the regional equivalents the Zoho wizard shows.

Setup order in Zoho: add domain → verify → create the `info@` mailbox → MX →
DKIM → SPF + DMARC.

| Purpose | Host | Type | Priority | Value |
| ------- | ---- | ---- | -------- | ----- |
| Verify domain | *(from Zoho — CNAME `zb******` → `zmverify.zoho.com`, or TXT `zoho-verification=zb******.zmverify.zoho.com`)* | | | |
| Receive mail | `@` | MX | 10 | `mx.zoho.com` |
| Receive mail | `@` | MX | 20 | `mx2.zoho.com` |
| Receive mail | `@` | MX | 50 | `mx3.zoho.com` |
| SPF | `@` | TXT | — | `v=spf1 include:zoho.com ~all` |
| DKIM | `zmail._domainkey` | TXT | — | `v=DKIM1; k=rsa; p=<key generated in Zoho console>` |
| DMARC | `_dmarc` | TXT | — | `v=DMARC1; p=quarantine; rua=mailto:info@zenitglobal.co.za` |

Notes:

- Remove any default/registrar MX records so mail doesn't misroute.
- Only **one** SPF (`v=spf1`) TXT record may exist on the apex — merge if one
  already exists.
- Generate the DKIM key under **Zoho Admin Console → Email Configuration → DKIM**
  (default selector `zmail`), then click **Verify** to activate.
- **Contact form delivery** is separate: quote/contact submissions go wherever the
  **Web3Forms** access key (`VITE_WEB3FORMS_KEY`) is registered — set that
  account's receiving address to `info@zenitglobal.co.za` once the mailbox is live.

---

## 5. Things you'll want to customise

| What                  | Where                                                        |
| --------------------- | ----------------------------------------------------------- |
| Phone / email / address | `CONTACT` object near the top of `src/App.jsx`            |
| Social media links    | `SOCIAL_LINKS` in `src/App.jsx` (currently `#` placeholders) |
| Services / industries / FAQ copy | The `SERVICES`, `INDUSTRIES`, `FAQS` arrays in `src/App.jsx` |
| Timeline / company history | `TIMELINE` array in `src/App.jsx`                       |
| SEO title & description | `index.html` (`<title>`, meta tags, JSON-LD)              |
| Brand colours         | `tailwind.config.js` and inline `#0B1F3A` (navy) / `#0E7AC0` (azure) values |

---

## Project structure

```
.
├── .github/workflows/deploy.yml   # CI/CD → GitHub Pages
├── public/favicon.svg             # Site icon
├── src/
│   ├── App.jsx                    # Entire site (all pages + forms)
│   ├── main.jsx                   # React entry point
│   └── index.css                  # Tailwind directives + base styles
├── index.html                     # HTML shell, SEO, fonts, structured data
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example                   # Template for your Web3Forms key
└── package.json
```

---

© 2026 Zenit Global Interlink Pty Ltd. _Taking You To Greater Heights._
