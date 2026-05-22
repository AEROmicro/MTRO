# MTRO

MTRO is a Next.js train-tracking web app with a modern black/white UI, city filtering, and OpenStreetMap mapping.

## Self-host (Next.js)

```bash
npm install
npm run build
npm start
```

Then open `http://localhost:3000`.

For local development:

```bash
npm run dev
```

## Cloudflare deployment

- The app uses a same-origin Next.js API route at `/api/trains`.
- This route adds resilient fallback behavior for upstream train/station APIs and avoids browser CORS issues.
- You can deploy to Cloudflare with standard Next.js-on-Cloudflare workflows while keeping self-hosting support via `next start`.

## Features

- Defaults to **Washington, DC**
- Sleek top-bar city filter and time snapshot filter
- OpenStreetMap + live train markers
- Same-origin API proxy at `/api/trains` for both cloud and self-host deployments
- Uses no-key public feeds:
  - Amtraker live train positions for supported US cities
  - BART departure estimates for San Francisco Bay Area coverage
  - transport.rest train departures for supported European country selections (including Finland, Switzerland, and Luxembourg)
- Only includes locations with configured live/departure API support
- In-session past-data snapshots for quick playback
