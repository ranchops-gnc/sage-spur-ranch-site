# Sage & Spur Ranch

Production-ready static Astro website for `sagespurranch.farm`.

## What is included

- Responsive, accessible pages: Home, About, Programs, Events, Journal, and Contact.
- Reusable header, footer, layout, photo placeholder, and newsletter components.
- SEO basics: canonical URLs, Open Graph metadata, sitemap, robots file, and JSON-LD.
- Sample copy is visibly marked **[Confirm]** or **Sample content** wherever facts are not yet verified.
- Multi-stage Docker build served by Nginx on port `80`, suitable for Coolify behind its existing Caddy proxy.

## Local development in VS Code

1. Clone the repository and open its folder in VS Code.
2. Install the pinned dependencies: `npm ci`.
3. Start the site: `npm run dev`.
4. Open the local address Astro prints in the terminal.
5. Before publishing, replace all **[Confirm]** and sample content, particularly the public contact email, ranch history, location, program details, dates, and photos.

## Checks

Run the same checks used in continuous integration:

```bash
npm test
npm run build
```

`npm run build` runs Astro’s type and content checks, then creates the static site in `dist/`.

## Coolify deployment

Do not change DNS or deploy until the site has been reviewed and approved.

1. In Coolify, create a **Web Application** from `ranchops-gnc/sage-spur-ranch-site`, branch `main`.
2. Select **Dockerfile** as the build pack, base directory `/`, Dockerfile location `/Dockerfile`, and internal port `80`.
3. Add the domain `https://sagespurranch.farm` in Coolify. Coolify’s existing Caddy reverse proxy should handle HTTPS; no additional application proxy is needed.
4. Keep Cloudflare DNS pointed at the server and use **DNS only** during the first certificate check. After a successful HTTPS check, use Cloudflare **Full (strict)**.
5. Deploy from Coolify only after approval, then verify the home page, all navigation, the sitemap, and HTTPS.

The Docker image has no runtime environment variables. `PUBLIC_MAILERLITE_FORM_ACTION` is optional and only needed if the existing interest-list form will be activated.
