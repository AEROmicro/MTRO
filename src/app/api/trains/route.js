const CITIES = [
  { id: "washington-dc", bbox: [39.18, -77.5, 38.65, -76.73], provider: "amtraker" },
  { id: "new-york-city", bbox: [41.05, -74.35, 40.45, -73.6], provider: "amtraker" },
  { id: "boston", bbox: [42.58, -71.35, 42.17, -70.85], provider: "amtraker" },
  { id: "chicago", bbox: [42.1, -87.95, 41.62, -87.45], provider: "amtraker" },
  { id: "tokyo", bbox: [35.9, 139.4, 35.5, 139.95], provider: "none" },
  { id: "paris", bbox: [49.02, 2.12, 48.75, 2.57], provider: "none" },
  { id: "zurich", bbox: [47.5, 8.4, 47.3, 8.68], provider: "none" },
  { id: "london", bbox: [51.66, -0.4, 51.38, 0.1], provider: "none" },
  { id: "berlin", bbox: [52.67, 13.1, 52.35, 13.7], provider: "none" },
  { id: "madrid", bbox: [40.55, -3.9, 40.3, -3.55], provider: "none" },
  { id: "rome", bbox: [42.05, 12.3, 41.77, 12.65], provider: "none" },
  { id: "vienna", bbox: [48.33, 16.18, 48.1, 16.56], provider: "none" },
  { id: "amsterdam", bbox: [52.44, 4.73, 52.28, 5.05], provider: "none" },
  { id: "brussels", bbox: [50.92, 4.2, 50.78, 4.5], provider: "none" },
  { id: "copenhagen", bbox: [55.77, 12.45, 55.58, 12.74], provider: "none" },
  { id: "stockholm", bbox: [59.42, 17.9, 59.24, 18.22], provider: "none" },
  { id: "oslo", bbox: [60, 10.6, 59.82, 10.95], provider: "none" },
  { id: "helsinki", bbox: [60.3, 24.8, 60.1, 25.13], provider: "none" },
  { id: "lisbon", bbox: [38.82, -9.3, 38.65, -9.02], provider: "none" },
  { id: "prague", bbox: [50.18, 14.25, 49.96, 14.63], provider: "none" },
  { id: "budapest", bbox: [47.6, 18.9, 47.4, 19.2], provider: "none" },
  { id: "warsaw", bbox: [52.33, 20.85, 52.13, 21.2], provider: "none" },
  { id: "seoul", bbox: [37.7, 126.82, 37.46, 127.15], provider: "none" },
  { id: "singapore", bbox: [1.47, 103.6, 1.23, 104.02], provider: "none" },
  { id: "sydney", bbox: [-33.74, 150.95, -34.05, 151.35], provider: "none" },
  { id: "toronto", bbox: [43.85, -79.7, 43.55, -79.1], provider: "none" },
  { id: "vancouver", bbox: [49.37, -123.32, 49.18, -122.95], provider: "none" },
  { id: "mexico-city", bbox: [19.57, -99.3, 19.32, -98.95], provider: "none" },
  { id: "san-francisco", bbox: [37.93, -122.56, 37.7, -122.3], provider: "amtraker" },
  { id: "los-angeles", bbox: [34.22, -118.6, 33.88, -117.95], provider: "amtraker" },
  { id: "philadelphia", bbox: [40.08, -75.35, 39.83, -74.95], provider: "amtraker" }
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
  const rows = Array.isArray(data) ? data : Object.values(data || {});
  return rows
    .map((row) => {
      const lat = Number(row.lat ?? row.latitude);
      const lon = Number(row.lon ?? row.lng ?? row.longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lon) || !inBbox(lat, lon, city.bbox)) {
        return null;
      }

      return {
        id: String(row.train_id ?? row.id ?? `${lat},${lon}`),
        line: String(row.route_name || row.route || row.train_num || "Train"),
        label: String(row.train_name || row.name || "Live train"),
        status: row.velocity ? `${Math.round(Number(row.velocity))} mph` : "Live",
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
