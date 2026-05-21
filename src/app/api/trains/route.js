const CITIES = [
  // ── United States (Amtrak live positions) ─────────────────────────────────
  { id: "washington-dc",   bbox: [39.18, -77.50,  38.65, -76.73],  provider: "amtraker" },
  { id: "new-york-city",   bbox: [41.05, -74.35,  40.45, -73.60],  provider: "amtraker" },
  { id: "boston",          bbox: [42.58, -71.35,  42.17, -70.85],  provider: "amtraker" },
  { id: "philadelphia",    bbox: [40.08, -75.35,  39.83, -74.95],  provider: "amtraker" },
  { id: "baltimore",       bbox: [39.38, -76.75,  39.20, -76.50],  provider: "amtraker" },
  { id: "richmond-va",     bbox: [37.65, -77.60,  37.43, -77.30],  provider: "amtraker" },
  { id: "charlotte",       bbox: [35.37, -80.98,  35.12, -80.68],  provider: "amtraker" },
  { id: "atlanta",         bbox: [33.92, -84.65,  33.62, -84.18],  provider: "amtraker" },
  { id: "miami",           bbox: [25.92, -80.42,  25.59, -80.00],  provider: "amtraker" },
  { id: "orlando",         bbox: [28.68, -81.55,  28.40, -81.22],  provider: "amtraker" },
  { id: "new-orleans",     bbox: [30.10, -90.30,  29.85, -89.87],  provider: "amtraker" },
  { id: "chicago",         bbox: [42.10, -87.95,  41.62, -87.45],  provider: "amtraker" },
  { id: "milwaukee",       bbox: [43.22, -88.10,  42.95, -87.77],  provider: "amtraker" },
  { id: "minneapolis",     bbox: [45.08, -93.45,  44.86, -93.12],  provider: "amtraker" },
  { id: "st-louis",        bbox: [38.78, -90.42,  38.50, -89.97],  provider: "amtraker" },
  { id: "kansas-city",     bbox: [39.25, -94.78,  38.96, -94.38],  provider: "amtraker" },
  { id: "detroit",         bbox: [42.45, -83.28,  42.20, -82.88],  provider: "amtraker" },
  { id: "pittsburgh",      bbox: [40.58, -80.18,  40.32, -79.82],  provider: "amtraker" },
  { id: "cleveland",       bbox: [41.62, -81.88,  41.38, -81.52],  provider: "amtraker" },
  { id: "dallas",          bbox: [33.00, -97.05,  32.62, -96.58],  provider: "amtraker" },
  { id: "houston",         bbox: [29.92, -95.58,  29.60, -95.18],  provider: "amtraker" },
  { id: "san-antonio",     bbox: [29.58, -98.68,  29.28, -98.32],  provider: "amtraker" },
  { id: "denver",          bbox: [39.88, -105.12, 39.59, -104.85], provider: "amtraker" },
  { id: "salt-lake-city",  bbox: [40.88, -112.03, 40.66, -111.76], provider: "amtraker" },
  { id: "albuquerque",     bbox: [35.22, -106.77, 34.98, -106.45], provider: "amtraker" },
  { id: "seattle",         bbox: [47.78, -122.55, 47.48, -122.20], provider: "amtraker" },
  { id: "portland-or",     bbox: [45.65, -122.88, 45.43, -122.50], provider: "amtraker" },
  { id: "sacramento",      bbox: [38.72, -121.65, 38.47, -121.37], provider: "amtraker" },
  { id: "san-francisco",   bbox: [37.93, -122.56, 37.70, -122.30], provider: "amtraker" },
  { id: "los-angeles",     bbox: [34.22, -118.60, 33.88, -117.95], provider: "amtraker" },
  // ── International (railway stations via OpenStreetMap) ───────────────────
  { id: "london",          bbox: [51.66, -0.40,  51.38,   0.10],  provider: "none" },
  { id: "paris",           bbox: [49.02,  2.12,  48.75,   2.57],  provider: "none" },
  { id: "berlin",          bbox: [52.67, 13.10,  52.35,  13.70],  provider: "none" },
  { id: "hamburg",         bbox: [53.70,  9.80,  53.45,  10.26],  provider: "none" },
  { id: "munich",          bbox: [48.25, 11.42,  48.05,  11.72],  provider: "none" },
  { id: "madrid",          bbox: [40.55, -3.90,  40.30,  -3.55],  provider: "none" },
  { id: "barcelona",       bbox: [41.50,  1.98,  41.30,   2.32],  provider: "none" },
  { id: "rome",            bbox: [42.05, 12.30,  41.77,  12.65],  provider: "none" },
  { id: "milan",           bbox: [45.58,  8.98,  45.36,   9.34],  provider: "none" },
  { id: "vienna",          bbox: [48.33, 16.18,  48.10,  16.56],  provider: "none" },
  { id: "zurich",          bbox: [47.50,  8.40,  47.30,   8.68],  provider: "none" },
  { id: "amsterdam",       bbox: [52.44,  4.73,  52.28,   5.05],  provider: "none" },
  { id: "brussels",        bbox: [50.92,  4.20,  50.78,   4.50],  provider: "none" },
  { id: "copenhagen",      bbox: [55.77, 12.45,  55.58,  12.74],  provider: "none" },
  { id: "stockholm",       bbox: [59.42, 17.90,  59.24,  18.22],  provider: "none" },
  { id: "oslo",            bbox: [60.00, 10.60,  59.82,  10.95],  provider: "none" },
  { id: "helsinki",        bbox: [60.30, 24.80,  60.10,  25.13],  provider: "none" },
  { id: "lisbon",          bbox: [38.82, -9.30,  38.65,  -9.02],  provider: "none" },
  { id: "prague",          bbox: [50.18, 14.25,  49.96,  14.63],  provider: "none" },
  { id: "budapest",        bbox: [47.60, 18.90,  47.40,  19.20],  provider: "none" },
  { id: "warsaw",          bbox: [52.33, 20.85,  52.13,  21.20],  provider: "none" },
  { id: "tokyo",           bbox: [35.90, 139.40, 35.50, 139.95],  provider: "none" },
  { id: "seoul",           bbox: [37.70, 126.82, 37.46, 127.15],  provider: "none" },
  { id: "hong-kong",       bbox: [22.56, 113.82, 22.15, 114.41],  provider: "none" },
  { id: "singapore",       bbox: [ 1.47, 103.60,  1.23, 104.02],  provider: "none" },
  { id: "sydney",          bbox: [-33.74, 150.95, -34.05, 151.35], provider: "none" },
  { id: "toronto",         bbox: [43.85, -79.70,  43.55, -79.10],  provider: "none" },
  { id: "vancouver",       bbox: [49.37, -123.32, 49.18, -122.95], provider: "none" },
  { id: "mexico-city",     bbox: [19.57, -99.30,  19.32, -98.95],  provider: "none" },
];

const AMTRAKER_ENDPOINTS = [
  "https://api-v3.amtraker.com/v3/trains",
  "https://api-v3.amtraker.com/v1/trains"
];

const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.openstreetmap.fr/api/interpreter"
];

const jsonHeaders = {
  "content-type": "application/json; charset=UTF-8",
  "cache-control": "no-store"
};

function inBbox(lat, lon, bbox) {
  return lat <= bbox[0] && lon >= bbox[1] && lat >= bbox[2] && lon <= bbox[3];
}

function parseAmtraker(data, city) {
  // Amtraker v3 returns { "trainNum": [trainObj, ...], ... } — must flatten.
  // v1 may return a flat array. Handle both.
  const rows = Array.isArray(data) ? data : Object.values(data || {}).flat();
  return rows
    .map((row) => {
      if (!row || typeof row !== "object") return null;
      const lat = Number(row.lat ?? row.latitude);
      const lon = Number(row.lon ?? row.lng ?? row.longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lon) || !inBbox(lat, lon, city.bbox)) {
        return null;
      }
      // Amtraker v3 uses camelCase; also accept legacy snake_case.
      return {
        id: String(row.trainID ?? row.train_id ?? row.id ?? `${lat},${lon}`),
        line: String(row.routeName || row.route_name || row.route || row.trainNum || row.train_num || "Amtrak"),
        label: String(row.trainNum || row.trainID || row.train_num || row.train_id || "Train"),
        status: row.velocity != null ? `${Math.round(Number(row.velocity))} mph` : "Active",
        heading: row.heading || null,
        speed: row.velocity != null ? Math.round(Number(row.velocity)) : null,
        state: String(row.trainState || row.train_state || "Active"),
        type: "train",
        lat,
        lon
      };
    })
    .filter(Boolean);
}

function parseOverpass(data, city) {
  const rows = Array.isArray(data?.elements) ? data.elements : [];
  return rows
    .map((row) => {
      const lat = Number(row.lat);
      const lon = Number(row.lon);
      if (row.type !== "node" || !Number.isFinite(lat) || !Number.isFinite(lon) || !inBbox(lat, lon, city.bbox)) {
        return null;
      }
      const tags = row.tags || {};
      const name = tags.name || tags.ref || "Rail stop";
      return {
        id: String(row.id ?? `${lat},${lon}`),
        line: String(name),
        label: String(tags.operator || tags.network || "Railway station"),
        status: String(tags.railway || "station"),
        heading: null,
        speed: null,
        state: "station",
        type: "station",
        lat,
        lon
      };
    })
    .filter(Boolean)
    .slice(0, 250);
}

function buildOverpassQuery(city) {
  const [north, west, south, east] = city.bbox;
  return `[out:json][timeout:20];node["railway"~"station|halt|tram_stop|subway_entrance"](${south},${west},${north},${east});out body 300;`;
}

async function fetchJsonWithTimeout(url, init, timeoutMs = 12000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...init, signal: controller.signal });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchFirst(urls, init) {
  let lastError;
  for (const url of urls) {
    try {
      return await fetchJsonWithTimeout(url, init);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error("No data source available");
}

async function loadCityData(city) {
  if (city.provider === "amtraker") {
    try {
      const amtrakerData = await fetchFirst(AMTRAKER_ENDPOINTS, { cache: "no-store" });
      const trains = parseAmtraker(amtrakerData, city);
      if (trains.length) {
        return {
          trains,
          message: "Live train data from Amtraker."
        };
      }
    } catch {
      // Fall through to Overpass stations.
    }
  }

  const overpassData = await fetchFirst(OVERPASS_ENDPOINTS, {
    method: "POST",
    headers: { "content-type": "text/plain;charset=UTF-8" },
    body: buildOverpassQuery(city),
    cache: "no-store"
  });
  const trains = parseOverpass(overpassData, city);
  return {
    trains,
    message: trains.length
      ? "Railway stations loaded from OpenStreetMap/Overpass."
      : "No railway stations returned for this city."
  };
}

export async function GET(request) {
  const url = new URL(request.url);
  const cityId = url.searchParams.get("city");
  const city = CITIES.find((entry) => entry.id === cityId) || CITIES[0];

  try {
    const payload = await loadCityData(city);
    return new Response(JSON.stringify(payload), { status: 200, headers: jsonHeaders });
  } catch (error) {
    return new Response(
      JSON.stringify({ trains: [], message: `Unable to load train data: ${error.message}` }),
      { status: 502, headers: jsonHeaders }
    );
  }
}
export const runtime = "edge";
