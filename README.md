![MTRO Logo](MTRO_LOGO.png)


MTRO is a Next.js transit-tracking web app with a modern black/white UI, city filtering, and OpenStreetMap mapping.

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

## Private API keys

Store keys in environment variables instead of committing them:

- `WMATA_API_KEYS` (comma-separated) or `WMATA_API_KEY`
- `WMATA_DEMO_API_KEY` (optional override for the built-in WMATA demo-key fallback used when no WMATA key is provided)
- `MOBILITY_DATABASE_ACCESS_TOKEN` (preferred) or `MOBILITY_DATABASE_REFRESH_TOKEN`
- `MOBILITY_DATABASE_API_BASE` (optional override, defaults to `https://api.mobilitydatabase.org`)
- `MOBILITY_DATABASE_MAX_ENDPOINTS` (optional cap for discovered GTFS-RT feeds per Mobility Database source, default `25`)

For local development, use `.env.local` (already git-ignored).
For deployed environments, set these as platform secrets (for example, in Vercel/Cloudflare project settings) so only project admins can view/manage them.

## Cloudflare deployment

- The app uses a same-origin Next.js API route at `/api/trains`.
- This route adds resilient fallback behavior for upstream train/station APIs and avoids browser CORS issues.
- Server-side in-memory caching and in-flight de-duplication reduce repeated upstream fetches when many users request the same city at once.
- `functions/api/trains.js` mirrors the same handler for Cloudflare Pages Functions, so `/api/trains` works with normal Cloudflare Pages deployments (without running `npm run dev` / `npm run start` on a server).
- You can still deploy with standard Next.js-on-Cloudflare workflows and keep self-hosting support via `next start`.

## Features

- Defaults to **New York City**
- OpenStreetMap + live transit markers (train/bus/tram/other mode colors)
- Same-origin API proxy at `/api/trains`
- UTC and selected-city local time bar with timezone abbreviation
- In-session past-data snapshots for quick playback
- Language selector (English default + Spanish, French, German, Chinese)
- Fares popout panel (left-side drawer) with expanded coverage across North America and Europe
- Shared server-side city response caching to reduce duplicate upstream requests
- City scope focused on Washington, DC; New York City; Boston; Philadelphia; Bay Area; Seattle; Atlanta; Denver; Chicago; Milwaukee; Toronto; London; Amsterdam; Paris; Los Angeles; Berlin; and Madrid
- Multi-source API coverage for these cities including:
  - Mobility Database GTFS-RT feed discovery bundles per city (city official + regional official + regional community sources), including added bus-focused bundles
  - VRE GTFS-RT (Washington, DC area commuter rail)
  - WMATA TrainPositions + WMATA Rail GTFS-RT + WMATA Bus GTFS-RT + NextBus DC Circulator + NextBus Fairfax Connector (Washington, DC, with automatic demo-key fallback when no WMATA key is set)
  - MTA NYCT + MTA Bus + LIRR + Metro-North GTFS-RT + NextBus NYC MTA Bus (New York City)
  - Keyless D.C. regional alternatives via Mobility Database discovery + NextBus feeds
  - MBTA vehicles API (Boston)
  - MBTA GTFS-RT + NextBus MBTA (Boston)
  - Bay Area open-data mirror feed (BART station coverage; keyless fallback) (Bay Area)
  - Sound Transit GTFS-RT + fallbacks (Seattle)
  - MARTA GTFS-RT + fallbacks (Atlanta)
  - RTD GTFS-RT + alternate endpoint (Denver)
  - SEPTA TrainView + SEPTA GTFS-RT + NextBus SEPTA + bus-focused discovery (Philadelphia)
  - Chicago open-data mirror feed (keyless fallback) (Chicago)
  - MCTS GTFS-RT (Milwaukee)
  - TTC GTFS-RT + Mobility Database bundles + Amtraker + Transitous GTFS-RT (Toronto)
  - London open-data mirror feed (keyless fallback) (London)
  - Amsterdam open-data mirror feed (keyless fallback) (Amsterdam)
  - Paris open-data mirror feed (keyless fallback) (Paris)
  - Los Angeles open-data mirror feed (keyless source) (Los Angeles)
  - Berlin open-data mirror feed (keyless source) (Berlin)
  - Madrid open-data mirror feed (keyless source) (Madrid)
  - Amtraker US network
  - Transitous GTFS-RT fallback (rail + bus focused variants)
