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

Requires Node.js 22+ (for `gtfs-realtime-bindings`).

## Cloudflare deployment

- The app uses a same-origin Next.js API route at `/api/trains`.
- This route adds resilient fallback behavior for upstream train/station APIs and avoids browser CORS issues.
- Server-side in-memory caching and in-flight de-duplication reduce repeated upstream fetches when many users request the same city at once.
- `functions/api/trains.js` mirrors the same handler for Cloudflare Pages Functions, so `/api/trains` works with normal Cloudflare Pages deployments (without running `npm run dev` / `npm run start` on a server).
- You can still deploy with standard Next.js-on-Cloudflare workflows and keep self-hosting support via `next start`.

## Features

- Defaults to **Washington, DC**
- OpenStreetMap + live train markers
- Same-origin API proxy at `/api/trains`
- UTC and selected-city local time bar with timezone abbreviation
- In-session past-data snapshots for quick playback
- Shared server-side city response caching to reduce duplicate upstream requests
- City scope focused on Washington, DC; New York City; Boston; Philadelphia; Bay Area; Seattle; Atlanta; Denver; and Chicago
- Multi-source API coverage for these cities including:
  - VRE GTFS-RT (Washington, DC area commuter rail)
  - WMATA TrainPositions + WMATA Rail GTFS-RT (Washington, DC, API key required)
  - MBTA vehicles API (Boston)
  - BART GTFS-RT (Bay Area)
  - Sound Transit GTFS-RT + fallbacks (Seattle)
  - MARTA GTFS-RT + fallbacks (Atlanta)
  - RTD GTFS-RT (Denver)
  - SEPTA TrainView (Philadelphia)
  - Metra GTFS-RT (Chicago, API key required)
  - Amtraker US network
  - Transitous GTFS-RT fallback
