# taxibestellenutrecht.nl

The new website for Taxi Bestellen Utrecht: a fast, accessible static site, generated from one fare table and one business config. No framework, no dependencies, no tracking.

```
npm run build          # → dist/          (production: clean URLs, self-hosted fonts)
npm run build:preview  # → dist-preview/  (relative links, opens from any folder)
npm test               # unit tests: pricing rules, data validation, link paths
npm run check          # tests + both builds + links, anchors, ids, JSON-LD and vercel.json drift
npm run serve          # build + serve dist/ on http://localhost:8080
npm run qa             # browser QA in Chromium (installs qa/ dev dependencies first)
```

Requires Node 18+. Nothing to install.

## Where things live

| What | File |
| --- | --- |
| Phone, e-mail, WhatsApp, address, KVK, btw, reviews, form endpoint | `src/data/site.json` |
| Every price, distance and travel time | `src/data/fares.json` |
| Town pages (intro, districts, local addresses, nearby towns) | `src/data/places.json` |
| Airport pages | `src/data/airports.json` |
| Page templates | `src/pages.mjs`, `src/booking.mjs` |
| Shared blocks (fare widget, departure board, FAQ, structured data) | `src/components.mjs` |
| Header, footer, mobile action bar, `<head>` | `src/layout.mjs` |
| Design system (tokens, light + dark theme) | `src/assets/site.css` |
| Fare widget, booking steps, form handling | `src/assets/site.js` |

**The build checks the data first.** A route that doesn't exist, a nearby place with a typo, a price that isn't a whole number or a phone number that doesn't match its `+31` form stops the build with a message saying what to fix.

**One price source.** A price is entered once in `fares.json` and from there appears on the homepage, the tariffs page, the town or airport page, the booking form, the taxibus price (`busFactor`, rounded) and the structured data search engines read. A route with `"price": null` shows "op aanvraag" everywhere rather than a guess.

## Before going live

The build prints this list every time. Currently open:

1. **Prices still to confirm:** De Bilt, Bunnik, Zeist, Houten, IJsselstein, Maarssen, Vianen and all airports except Schiphol. The old site gave conflicting figures for some of these (De Bilt "vanaf €30" vs "€15–30", Vianen €60), so they were left out rather than copied.
2. **`site.kvk` and `site.btw`.** A KVK number on the website is a legal requirement.
3. **`site.address`.** Amerikalaan 625 comes from a business directory. Confirm it, then set `"verified": true`.
4. **`site.whatsapp`.** WhatsApp buttons appear automatically once a number is set (digits only, e.g. `31612345678`).
5. **`site.reviews`.** Real score, count, source and URL, e.g. `{"score": 4.7, "count": 213, "source": "Google", "url": "…"}`. Until then no rating is shown anywhere.
6. **`site.bookingEndpoint`.** Without it, the booking, contact and business forms open the visitor's e-mail program with the request filled in. With an endpoint (Formspree, Basin, or your own API that accepts JSON `POST`), forms send directly and show a confirmation.
7. **Visible `[placeholders]`** on Over ons, Privacy and Algemene voorwaarden: company story, retention period, processors, which terms apply, cancellation policy. Have the privacy statement and terms reviewed before publishing. Until a page's placeholders are filled in, the build marks it `noindex` and leaves it out of the sitemap, so draft texts never appear in search results.
8. **Photos (optional).** The fleet uses line drawings. Real photos of your own cars and drivers would strengthen trust; stock photos would not.

## Deploying

`dist/` is plain HTML/CSS/JS and runs on any static host. It includes:

- `_redirects` (Netlify, Cloudflare Pages), `vercel.json` (Vercel) and `.htaccess` (Apache), with 301 redirects from the old URLs (`/taxi-schiphol-airport/`, `/zakelijk-vervoer-utrecht/`, `/taxi-nieuwegein/` …) so existing rankings and links carry over
- `sitemap.xml`, `robots.txt`, `site.webmanifest`, `404.html`

From this repository: Vercel and Netlify pick up `vercel.json` and `netlify.toml` (build command `npm run build`, output `dist/`). If you add a town page or change the form endpoint, copy `headers` and `redirects` from `dist/vercel.json` into the root `vercel.json` (`npm run check` tells you when they differ). Every push runs `npm run check` and the browser QA (`qa/run.mjs`: overflow at 320–1440px, axe on every page in light and dark, the production CSP, booking flows, no-JS, a mocked form endpoint) in GitHub Actions.

After launch: submit the sitemap in Google Search Console and check that every old URL redirects.

## Built in

- WCAG 2.2 AA: zero axe-core violations on every page in light and dark at desktop and phone width; text contrast at AAA (≥ 7:1): real form controls with labels, visible focus, skip link, 44px+ touch targets, `prefers-reduced-motion`, light and dark themes
- Works without JavaScript: the fare widget submits to the booking page, and booking falls back to a single form
- Structured data per page: LocalBusiness, TaxiService with price, BreadcrumbList, FAQPage
- Security headers (CSP with a hashed inline script, HSTS, nosniff, frame-ancestors, Permissions-Policy) in `_headers` and `vercel.json`; `npm run check` fails if the root `vercel.json` drifts from the generated one
- One minified, fingerprinted stylesheet and script (`/assets/build/`), cached for a year
- Fonts subset to the characters the site uses and Archivo limited to the weights/widths it uses: about 63 KB instead of 120 KB, preloaded (Lighthouse performance 99–100 on simulated mobile 4G)
- Valid HTML (html-validate), Lighthouse 100 for accessibility, best practices and SEO
- Share image (`og.png`, 1200×630) and app icons for link previews and home screens
- No cookies, no trackers, fonts self-hosted (Archivo, IBM Plex Mono, SIL OFL)
