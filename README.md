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

## 3. Custom domain (optional)

To serve the site from `zenitglobal.co.za` (or similar):

1. Buy the domain (e.g. via [domains.co.za](https://www.domains.co.za) or any registrar).
2. In **Settings → Pages → Custom domain**, enter your domain and save.
3. At your domain registrar, add DNS records:
   - For an apex domain (`zenitglobal.co.za`), add four **A records** pointing to
     GitHub's IPs: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`,
     `185.199.111.153`.
   - For `www`, add a **CNAME** record pointing to `<your-username>.github.io`.
4. Tick **Enforce HTTPS** once the certificate is issued (can take a few minutes).
5. Update the `<link rel="canonical">` and Open Graph URLs in `index.html` to your
   real domain.

---

## 4. Things you'll want to customise

| What                  | Where                                                        |
| --------------------- | ----------------------------------------------------------- |
| Phone / email / address | `CONTACT` object near the top of `src/App.jsx`            |
| Social media links    | `SOCIAL_LINKS` in `src/App.jsx` (currently `#` placeholders) |
| Services / industries / FAQ copy | The `SERVICES`, `INDUSTRIES`, `FAQS` arrays in `src/App.jsx` |
| Timeline / company history | `TIMELINE` array in `src/App.jsx`                       |
| SEO title & description | `index.html` (`<title>`, meta tags, JSON-LD)              |
| Brand colours         | `tailwind.config.js` and inline `#0B1F3A` / `#FF7A00` values |

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
