# hari-gtm-portfolio

Portfolio of **Hariprasad Sivakumar**, GTM Engineer in Bengaluru (Bangalore), India. Live at https://www.hariprasadss.com/

## Pages
- `index.html`: home (services, featured systems, clients, budget stance, experience, stack, FAQ)
- `gtm-engineer-bangalore/`: location page targeting "GTM engineer in Bangalore / Bengaluru"
- `work/`: long-form case studies (problem, build, results)
- `about/`: bio, career history, principles (ProfilePage schema)
- `404.html`, `llms.txt`, `robots.txt`, `sitemap.xml`, IndexNow key file (`<key>.txt` at the root)

Old versions (`legacy-2025.html`, `old-website.html`) stay in the repo for history but are 301-redirected to `/` by `netlify.toml` so only one set of facts is public.

## Stack
Pure HTML/CSS/JS, no build step, deployed on Netlify. Shared styles in `assets/css/site.css`, shared behaviour in `assets/js/site.js` (both versioned with `?v=YYYYMMDD` in the HTML; bump it when they change). Fonts via Google Fonts. OG image in `assets/og/` (rendered from HTML with headless Chrome).

## House rules for copy
- Canonical host is `https://www.hariprasadss.com/` (the apex 301s to www). Keep canonicals, OG URLs, JSON-LD and the sitemap on www.
- No em dashes or en dashes anywhere.
- Only verified numbers. Keep the JSON-LD FAQ text in sync with the visible FAQ.
- Update `dateModified`, sitemap `lastmod` and the footer "Last updated" date on meaningful changes.
