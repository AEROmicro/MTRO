# MTRO

MTRO is a lightweight train-tracking web app with a modern black/white UI, city filtering, and OpenStreetMap mapping.

## Run locally

```bash
npm install
npm start
```

Then open `http://localhost:8080`.

## Features

- Defaults to **Washington, DC**
- Sleek top-bar city filter and time snapshot filter
- OpenStreetMap + live train markers
- Browser-direct data loading (no backend proxy)
- Uses no-key public feed support where available (currently Amtraker for supported US cities)
- Includes 30+ city options including Tokyo, NYC, Paris, Chicago, Boston, and Zurich
- In-session past-data snapshots for quick playback
