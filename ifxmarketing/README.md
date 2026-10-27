# IFX Marketing — Website

A complete, static, multi-page website for **IFX Marketing**, a fintech performance marketing agency established in 2017.

- No build step, no Node.js, no React, no database, no third-party framework.
- HTML5 + CSS3 + vanilla JavaScript only.
- Runs from any static host, including standard **Hostinger shared hosting**.
- All fonts are system font stacks — nothing is fetched from Google Fonts or anywhere else.
- All graphics are inline SVG or locally stored SVG/PNG files.

---

## 1. Folder structure

```
ifxmarketing/
├── index.html                    Homepage (hero, services, process, FAQs, enquiry form)
├── about.html                    Agency background, approach, team, industries
├── services.html                 All ten services with workflow and deliverables
├── forex-lead-generation.html    Dedicated service page
├── algo-trading-marketing.html   Dedicated service page
├── ib-advisory-marketing.html    Dedicated service page (IB + advisory)
├── contact.html                  Contact details, form, WhatsApp handoff
├── privacy-policy.html           Draft privacy policy
├── terms-and-conditions.html     Draft terms
├── disclaimer.html               Draft disclaimer
├── 404.html                      Error page (noindex)
├── robots.txt                    Crawl rules + sitemap location
├── sitemap.xml                   10 public URLs only
├── site.webmanifest              PWA manifest
├── README.md                     This file
├── css/
│   └── style.css                 Entire stylesheet (single file, ~28 KB)
├── js/
│   ├── config.js                 ** ALL business details live here **
│   └── script.js                 Nav, dropdown, reveal, form → WhatsApp
└── assets/
    ├── favicon.svg               SVG favicon / app icon
    ├── images/
    │   ├── og-image.svg          Open Graph image (1200×630, scalable)
    │   └── og-image.png          Same, raster fallback for crawlers
    └── icons/
        └── README.txt            Icons are inlined as SVG in the HTML
```

---

## 2. Central configuration (`js/config.js`)

Edit **only** `js/config.js` to change business details. Every page reads from it at runtime:

| Key | Currently set to | Where it appears |
|---|---|---|
| `brandName` | IFX Marketing | `[data-ifx-brand]` |
| `email` | connect.ifx@gmail.com | footer, contact page, error fallbacks |
| `whatsapp.display` | +44 7446 345817 | footer, form notes (`[data-ifx-phone]`) |
| `whatsapp.digits` | 447446345817 | every `wa.me` link |
| `instagram` | instagram.com/ifx_marketing | footer, contact page |
| `location` | UAE | contact page / footer
| `minAdBudgetNote` | ₹1 lakh per month | budget sections
| `messages.float` / `.general` | prefilled WhatsApp text | floating button, CTA buttons |
| `adSpend.verified` | `false` | see section 3 |

> **Security:** `config.js` is delivered to the browser. Never put API keys, passwords, SMTP credentials or private tokens in it.

### How to change the WhatsApp number

1. Open `js/config.js`.
2. Update **both** `whatsapp.display` (human-readable, e.g. `+971 50 123 4567`) and `whatsapp.digits` (digits only, no `+`, no spaces: `971503456789`).
3. Also update the `href` fallbacks in the HTML (`https://wa.me/447446345817`) so the site still works if JavaScript is blocked — search the project for `wa.me`.

---

## 3. The ₹1 crore+ advertising spend claim — verification flag

The claim is **not published**. The site currently describes the agency's advertising experience in neutral terms instead.

**How it works**

- `js/config.js` → `adSpend.verified: false`
- While `false`, the trust-strip tile reads **"Meta & Google — advertising platforms managed daily"**, and a neutral note is shown (`data-ifx-adspend-note`).
- The neutral wording is **hard-coded in the HTML**, so the site is correct even with JavaScript disabled.

**To publish the claim once it is verified:**

1. In `js/config.js` set `adSpend.verified: true` and fill `value` / `label` / `note`.
2. Keep a written record of the evidence (Meta Ads Manager lifetime spend export) — the source-code location is `js/config.js` → `adSpend`.

**Locate the claim:** search the project for `adSpend` or `1 crore`.

---

## 4. Enquiry form → WhatsApp

There is **no backend**. The flow is:

1. User fills Full Name, Phone (with country code), Business Type, Monthly Advertising Budget, and ticks consent.
2. `js/script.js` validates each field and shows an accessible inline error.
3. On success it builds this message and URL-encodes it with `encodeURIComponent`:

```
Hello IFX Marketing,

I would like to discuss your fintech performance marketing services.

Name: [Full Name]
Phone: [Phone Number]
Business Type: [Business Type]
Monthly Advertising Budget: [Selected Budget]

Please contact me regarding your services.
```

4. It opens `https://wa.me/447446345817?text=<encoded>` in a new tab.
5. The status panel says: *"WhatsApp is opening in a new tab. Your details are pre-filled… Nothing has been sent yet — review the message and press Send in WhatsApp."* — it never claims submission succeeded.

**Anti-spam:** a hidden `company_website` honeypot field. If it is filled, the handler refuses to build the message and shows a plain error.

**Privacy:** form data never leaves the browser except through WhatsApp itself; nothing is logged to the console.

**Limitations of frontend-only validation:** validation can be bypassed by anyone who edits the page source, and it cannot confirm the enquiry was actually sent. If you later add a real endpoint (Google Sheets webhook, CRM API, form service), implement it server-side or through a documented endpoint and update the privacy policy first.

---

## 5. Local testing

```bash
cd ifxmarketing
python3 -m http.server 8000
# open http://localhost:8000/
```

Test from the **parent** directory too (`http://localhost:8000/ifxmarketing/`) if you want to simulate a subfolder deployment.

---

## 5b. Automated checks included in this build

A link/asset checker was run against the built site and reported **0 broken references** — every internal `href`, every `src`, and every `srcset` resolves to a file on disk, and every `id` referenced by an in-page `#anchor` exists.

---

## 6. Deployment on Hostinger (shared hosting)

### 6.1 Upload

1. Log in to **hPanel** → **Websites** → **Manage** → **File Manager**.
2. Open `public_html` (this is the web root).
3. Delete the default placeholder file if one exists (`default.php`, `index.html`).
4. Upload `ifxmarketing.zip` there, then right-click → **Extract**.
5. **Move the files up one level** if the ZIP created an `ifxmarketing/` subfolder — `index.html`, `css/`, `js/`, `assets/`, `about.html`, etc. must sit **directly** inside `public_html`.

Correct result:

```
public_html/
├── index.html
├── css/style.css
├── js/config.js
├── assets/favicon.svg
└── ...
```

Wrong (site will 404 at the root): `public_html/ifxmarketing/index.html`

### 5 steps for File Manager upload, if you prefer not to zip

1. Upload `index.html` and the HTML pages to `public_html`.
2. Create `css/`, `js/`, `assets`, `assets/images`, `assets/icons` as folders.
3. Upload `style.css` into `css/`, `config.js` + `script.js` into `js/`.
4. Upload `favicon.svg` into `assets/`, images into `assets/images/`.
5. Upload `robots.txt`, `sitemap.xml`, `site.webmanifest`.

### 6.2 Domain

1. hPanel → **Domains** → confirm `ifxmarketing.com` is pointed at this hosting plan.
2. If the domain is registered elsewhere, set the nameservers at your registrar to the ones Hostinger shows in hPanel.
2. DNS propagation can take a few hours.

### 6.3 HTTPS

1. hPanel → **Security** → **SSL** → install the free Let's Encrypt certificate for `ifxmarketing.com` and `www`.
2. Enable **Force HTTPS**.
3. Confirm `http://` redirects to `https://`.

### 6.4 Verify after going live

| # | Check | How |
|---|---|---|
| 1 | Homepage loads | Open `https://ifxmarketing.com/` |
| 2 | Every page loads | `/about.html`, `/services.html`, the 3 service pages, `/contact.html`, the 3 legal pages |
| 3 | Navigation works on mobile | Resize to 375 px, open the menu, tap every link, confirm menu closes |
| 4 | Dropdown works | Desktop: click **Services**; keyboard: Tab to it, Enter, then Escape |
| 5 | WhatsApp float | Bottom right on every page; opens `wa.me/447446345817` with the prefilled text |
| 6 | Form on desktop | Submit empty → errors appear. Fill correctly → WhatsApp opens with all 4 fields |
| 7 | Form on mobile | Same, on a real phone; confirm the keyboard does not cover the button and the WhatsApp button does not sit on top of the form controls |
| 8 | 404 page | Visit `/does-not-exist` — confirm your host serves `404.html`, or set a custom error page in hPanel |
| 9 | SEO tags | View source: unique `<title>`, `<meta name="description">`, `<link rel="canonical">` on each page |
| 10 | Sitemap | Open `https://ifxmarketing.com/sitemap.xml` |
| 11 | robots.txt | Open `https://ifxmarketing.com/robots.txt` |
| 12 | Business details | Update `js/config.js` once, reload, confirm the new number/email appear everywhere |

---

## 7. Launch checklist

- [ ] Replace placeholder business details in `js/config.js` if anything changes.
- [ ] Decide on the `adSpend.verified` flag (section 3).
- [ ] Have a lawyer review `privacy-policy.html`, `terms-and-conditions.html`, `disclaimer.html` — pay particular attention to every **[TO CONFIRM]** marker and to the fact that no governing jurisdiction or registered entity is stated.
- [ ] Add a real legal entity name, registered address and jurisdiction **only** once confirmed.
- [ ] **Google Search Console:** add the `https://` property, verify by DNS TXT or HTML file upload, submit `https://ifxmarketing.com/sitemap.xml`.
- [ ] **Bing Webmaster Tools** (optional): same sitemap.
- [ ] **Analytics/consent:** nothing is loaded by default. If you add GA4 or a Meta Pixel, (a) load it only after consent where required, (b) update the privacy policy, (c) flip `analytics.enabled` in `config.js` and add the loader.
- [ ] **Test the WhatsApp link on a real phone** — `wa.me` behaves differently in-app vs. desktop.
- [ ] Run a Lighthouse audit on the live URL and record the real numbers (none are claimed in this README).

---

## 8. Business details requiring verification before publishing

| Item | Status |
|---|---|
| Registered legal entity name | **Not supplied** — nothing invented |
| Registered office / street address | **Not supplied** — only "UAE" is stated |
| Company registration number | **Not supplied** |
| Trade licence / regulatory authorisation | **Not supplied** — no claim made |
| ₹1 crore+ Meta ad spend | **Unverified** — `adSpend.verified: false`, neutral wording shown |
| Business hours | **Not supplied** — contact page says so explicitly |
| Response-time commitment | **Not supplied** — no guarantee stated |
| Client names / case studies / testimonials | **None exist publicly** — none used |
| Awards / certifications | **None supplied** — none claimed |
| Team size (10+) and founding year (2017) | Supplied by the business |
| Email, WhatsApp, Instagram, domain | Supplied by the business |

---

## 9. Accessibility & performance notes

- Semantic landmarks: `header`, `nav`, `main`, `footer`, `section` with `aria-labelledby`.
- Skip link; visible `:focus-visible` outlines everywhere.
- Mobile menu: `aria-expanded`, Escape closes and restores focus, closes on link selection and on outside click.
- Dropdown: click + keyboard, Escape, closes on focus-out.
- `prefers-reduced-motion` disables the reveal animation and the WhatsApp pulse, and forces content visible.
- Content is fully readable with JavaScript disabled (a `.no-js` class reveals `.reveal` blocks).
- Single CSS file, two deferred JS files, no render-blocking third-party requests, no web fonts, no background video.
- Charts are inline SVG with `<title>`/`<desc>` and an explicit "illustrative, not client results" caption.
