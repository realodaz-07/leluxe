# LeLuxe Dermsolutions

Static marketing site for **LeLuxe Dermsolutions** — a doctor-led dermatological & aesthetic skin clinic in Carmona & Imus, Cavite. Home of Cavite's first Juvelook biostimulating skin booster. *Discover your true beauty.*

- **Live:** https://leluxe.okstudios.cloud
- **Stack:** hand-built no-build static site (HTML + CSS + vanilla JS)
- **Fonts:** Fraunces (headlines), Cormorant Garamond (wordmark), Jost (UI/body)
- **Palette:** soft blush pink · antique gold · plum ink (from the brand logo)

## Structure

```
index.html        # single-page site
css/styles.css    # all styles (editorial layout, brand palette)
js/main.js        # scroll reveal, sticky nav, mobile menu
assets/
  logo.png        # original client logo (gold on blush)
  logo-mark.png   # transparent-background full logo (for dark sections)
  mark.png        # cropped monogram emblem
  hero.jpg        # hero photography (placeholder — swap for the clinic's own)
```

## Content notes

Copy is built from the client's public Facebook page (facebook.com/leluxe.dermsolutions):
brand name, tagline "Discover Your True Beauty", Doc Genie, Carmona + Imus branches,
phone 0917 104 3624, hours (Mon–Sun 12PM–9PM), and the flagship Juvelook booster.
Secondary treatments (facials, laser/pigment, skin boosters, blemish care) are a
representative derm-clinic menu — confirm/replace with the clinic's actual service list.
Hero image is licensed placeholder stock; swap for LeLuxe's own photography.

## Deploy

Hosted on **Cloudflare Pages** (project `leluxe`, direct-upload) with DNS on
**Hostinger** (`okstudios.cloud` zone → `CNAME leluxe → leluxe.pages.dev`).

The GitHub Action below stays dormant until a `CLOUDFLARE_API_TOKEN` repo secret
is set; redeploys are otherwise done via direct-upload.

---
Built by OK Studios.
