# MTRO

MTRO is a lightweight train-tracking web app with a modern black/white UI, city filtering, and OpenStreetMap mapping.

## Run locally

```bash
npm install
npm start
```

Then open `http://localhost:8080`.

## Cloudflare Pages support

- This repo now includes a Pages Function at `functions/api/trains.js`.
- On Cloudflare, the frontend uses `/api/trains` (same-origin proxy) to avoid browser CORS failures and to improve API reliability.
- In self-host mode (plain static hosting), the app automatically falls back to direct browser API calls.

## Features

- Defaults to **Washington, DC**
- Sleek top-bar city filter and time snapshot filter
- OpenStreetMap + live train markers
- Cloudflare-compatible same-origin API proxy with browser-direct self-host fallback
- Uses no-key public feeds with fallback logic:
  - Amtraker live train positions for supported US cities
  - OpenStreetMap/Overpass railway-station fallback for all configured cities
- Includes 30+ city options including Tokyo, NYC, Paris, Chicago, Boston, and Zurich, all with API-backed map data
- In-session past-data snapshots for quick playback
