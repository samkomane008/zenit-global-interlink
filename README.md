# Zenit Global Interlink Website

<a id="readme-top"></a>

[Project repository](https://github.com/samkomane008/zenit-global-interlink)

<details>
<summary>Table of contents</summary>

- [About the project](#about-the-project)
- [Getting started](#getting-started)
- [Usage](#usage)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Acknowledgments](#acknowledgments)

</details>

## About the project

Marketing website for **Zenit Global Interlink Pty Ltd**, a Centurion-based logistics
and freight company serving South Africa and the wider SADC region.

Built as a fast, single-page static site with **React + Vite + Tailwind CSS**, with
working Quote, Contact, and Newsletter forms (no backend server required).

---

### Built with

| Piece            | Choice                          |
| ---------------- | ------------------------------- |
| Framework        | React 18                        |
| Build tool       | Vite 6                          |
| Styling          | Tailwind CSS 3                  |
| Icons            | lucide-react                    |
| Forms            | [Web3Forms](https://web3forms.com) (serverless email) |
| Hosting configuration | Cloudflare Workers static assets (`wrangler.jsonc`) |

---

## Getting started

### Prerequisites

Git, Node.js and npm. Use a toolchain compatible with Vite 6.

### Installation

```bash
git clone https://github.com/samkomane008/zenit-global-interlink.git
cd zenit-global-interlink
```

### Local development

```bash
npm install        # install dependencies
npm run dev        # start dev server at http://localhost:5173
npm run build      # production build → ./dist
npm run preview    # preview the production build locally
```

---

## Usage

### Forms (Web3Forms)

The Quote, Contact, and Newsletter forms submit through Web3Forms, which emails
submissions straight to your inbox: no server to run or maintain.

1. Go to **https://web3forms.com**.
2. Enter the email where you want to receive submissions (e.g. `zenitglobe@gmail.com`)
   and click **Create Access Key**.
3. Check that inbox for your **access key** (a long UUID).
4. Create a file named `.env` in the project root (copy from `.env.example`):

   ```
   VITE_WEB3FORMS_KEY=paste-your-access-key-here
   ```

5. Restart `npm run dev` (or rebuild): forms now send real emails.

The form key is supplied through `VITE_WEB3FORMS_KEY` at build time. Keep local
configuration out of git and use only the client's authorised form destination.
Form tests can send real messages; arrange them with the client first.

### Hosting and custom domain

[wrangler.jsonc](wrangler.jsonc) configures Cloudflare Workers to serve `dist/`
on `zenitglobal.co.za` and `www.zenitglobal.co.za`. Build locally with
`npm ci && npm run build`. Publishing is a separate authorised operation;
GitHub Actions does not run on this account.

When changing the domain, keep `public/CNAME` and the canonical, Open Graph
and JSON-LD URLs in `index.html` consistent with the hosting configuration.
Preserve the client's existing mail DNS when changing web hosting.

### Email: `info@zenitglobal.co.za` (GoDaddy Professional Email)

Mail is hosted on **GoDaddy Professional Email** (set up 8 Jul 2026), on the same
account that holds the domain. GoDaddy manages the email DNS automatically.
These records live on the apex and are separate from web hosting records
(different record types):

| Purpose | Host | Type | Value |
| ------- | ---- | ---- | ----- |
| Receive mail | `@` | MX | `smtp.secureserver.net` (prio 0) / `mailstore1.secureserver.net` (prio 10) |
| SPF | `@` | TXT | `v=spf1 include:secureserver.net -all` |
| DMARC | `_dmarc` | TXT | GoDaddy default (`p=quarantine`): consider repointing `rua=` to `info@zenitglobal.co.za` so the client gets the reports |

Notes:

- Webmail is at <https://email.godaddy.com>; the mailbox also works in
  phone/desktop mail apps via GoDaddy's IMAP/SMTP settings.
- Don't hand-edit the MX/SPF records: GoDaddy owns them while mail is hosted
  there. If mail ever moves (e.g. to Zoho), replace MX + SPF together.
- Only **one** SPF (`v=spf1`) TXT record may exist on the apex.
- **Contact form delivery** is separate: quote/contact submissions go wherever the
  **Web3Forms** access key (`VITE_WEB3FORMS_KEY`) is registered: create a key for
  `info@zenitglobal.co.za` at web3forms.com and update the authorised build environment
  so form mail lands in the client mailbox.

---

### Customisation

| What                  | Where                                                        |
| --------------------- | ----------------------------------------------------------- |
| Phone / email / address | `CONTACT` object near the top of `src/App.jsx`            |
| Social media links    | `SOCIAL_LINKS` in `src/App.jsx` (currently `#` placeholders) |
| Services / industries / FAQ copy | The `SERVICES`, `INDUSTRIES`, `FAQS` arrays in `src/App.jsx` |
| Timeline / company history | `TIMELINE` array in `src/App.jsx`                       |
| SEO title & description | `index.html` (`<title>`, meta tags, JSON-LD)              |
| Brand colours         | `tailwind.config.js` and inline `#0B1F3A` (navy) / `#0E7AC0` (azure) values |

---

### Project structure

```
.
├── wrangler.jsonc                # Cloudflare static asset configuration
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

## Roadmap

Track maintenance and requested changes in the
[issue tracker](https://github.com/samkomane008/zenit-global-interlink/issues).
The customisation table above identifies the source files for content updates.

## Contributing

Use an isolated worktree and feature branch. Preserve client-approved content
and contact destinations. For code changes run `npm ci && npm run build`; for
documentation check links and factual claims locally. Open a PR and complete
review before merge. Deployment requires separate authorisation.

## License

No repository license file is currently provided. This README does not grant
permission to use or redistribute the project.

## Contact

Samuel Komane · [GitHub](https://github.com/samkomane008)

Project: [samkomane008/zenit-global-interlink](https://github.com/samkomane008/zenit-global-interlink)

## Acknowledgments

README structure adapted from
[Best-README-Template](https://github.com/othneildrew/Best-README-Template).

[Back to top](#readme-top)
