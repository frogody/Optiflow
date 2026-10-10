# taxibestellenutrecht.nl

The new website for Taxi Bestellen Utrecht: a fast, accessible static site, generated from one fare table and one business config. No framework, no dependencies, no tracking.

```
npm run build          # → dist/          (production: clean URLs, self-hosted fonts)
npm run build:preview  # → dist-preview/  (relative links, opens from any folder)
npm run check          # builds both and verifies links, anchors, ids and JSON-LD
npm run serve          # build + serve dist/ on http://localhost:8080
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

**One price source.** A price is entered once in `fares.json` and from there appears on the homepage, the tariffs page, the town or airport page, the booking form, the taxibus price (`busFactor`, rounded) and the structured data search engines read. A route with `"price": null` shows "op aanvraag" everywhere rather than a guess.

## Before going live

The build prints this list every time. Currently open:

1. **Prices still to confirm:** De Bilt, Bunnik, Zeist, Houten, IJsselstein, Maarssen, Vianen and all airports except Schiphol. The old site gave conflicting figures for some of these (De Bilt "vanaf €30" vs "€15–30", Vianen €60), so they were left out rather than copied.
2. **`site.kvk` and `site.btw`.** A KVK number on the website is a legal requirement.
3. **`site.address`.** Amerikalaan 625 comes from a business directory. Confirm it, then set `"verified": true`.
4. **`site.whatsapp`.** WhatsApp buttons appear automatically once a number is set (digits only, e.g. `31612345678`).
5. **`site.reviews`.** Real score, count, source and URL, e.g. `{"score": 4.7, "count": 213, "source": "Google", "url": "…"}`. Until then no rating is shown anywhere.
6. **`site.bookingEndpoint`.** Without it, the booking, contact and business forms open the visitor's e-mail program with the request filled in. With an endpoint (Formspree, Basin, or your own API that accepts JSON `POST`), forms send directly and show a confirmation.
7. **Visible `[placeholders]`** on Over ons, Privacy and Algemene voorwaarden: company story, retention period, processors, which terms apply, cancellation policy. Have the privacy statement and terms reviewed before publishing.
8. **Photos (optional).** The fleet uses line drawings. Real photos of your own cars and drivers would strengthen trust; stock photos would not.

## Deploying

`dist/` is plain HTML/CSS/JS and runs on any static host. It includes:

- `_redirects` (Netlify, Cloudflare Pages), `vercel.json` (Vercel) and `.htaccess` (Apache), with 301 redirects from the old URLs (`/taxi-schiphol-airport/`, `/zakelijk-vervoer-utrecht/`, `/taxi-nieuwegein/` …) so existing rankings and links carry over
- `sitemap.xml`, `robots.txt`, `site.webmanifest`, `404.html`

From this repository: Vercel and Netlify pick up `vercel.json` and `netlify.toml` (build command `npm run build`, output `dist/`). If you add a town page, regenerate the redirect list in the root `vercel.json` from `dist/vercel.json`. Every push runs `npm run check` in GitHub Actions.

After launch: submit the sitemap in Google Search Console and check that every old URL redirects.

## Built in

- Built to WCAG 2.2 AA, with text contrast at AAA (≥ 7:1): real form controls with labels, visible focus, skip link, 44px+ touch targets, `prefers-reduced-motion`, light and dark themes
- Works without JavaScript: the fare widget submits to the booking page, and booking falls back to a single form
- Structured data per page: LocalBusiness, TaxiService with price, BreadcrumbList, FAQPage
- No cookies, no trackers, fonts self-hosted (Archivo, IBM Plex Mono, SIL OFL)
