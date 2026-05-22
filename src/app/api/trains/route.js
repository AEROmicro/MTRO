// Cloudflare Pages requires non-static Next.js routes to run on the Edge runtime.
export const runtime = "edge";
import gtfsRealtimeBindings from "gtfs-realtime-bindings";

const { transit_realtime: GtfsRealtime } = gtfsRealtimeBindings;

const AMTRAKER_ENDPOINTS = [
  "https://api-v3.amtraker.com/v3/trains",
  "https://api-v3.amtraker.com/v1/trains"
];
// Try canonical endpoint first, then common URL variants observed during upstream URL migrations.
const TRANSITOUS_ENDPOINTS = [
  "https://api.transitous.org/gtfs-rt/",
  "https://api.transitous.org/gtfs-rt",
  "https://transitous.org/gtfs-rt/"
];

const CITIES = [
  {
    id: "washington-dc",
    provider: "multi",
    bbox: [39.18, -77.50, 38.65, -76.73],
    sources: [
      { provider: "amtraker", endpoints: AMTRAKER_ENDPOINTS, label: "Amtrak" },
      { provider: "gtfsrt-protobuf", endpoints: TRANSITOUS_ENDPOINTS, fallbackLine: "Transitous", label: "Transitous GTFS-RT" }
    ]
  },
  {
    id: "new-york-city",
    provider: "multi",
    bbox: [41.05, -74.35, 40.45, -73.60],
    sources: [
      { provider: "amtraker", endpoints: AMTRAKER_ENDPOINTS, label: "Amtrak" },
      { provider: "gtfsrt-protobuf", endpoints: TRANSITOUS_ENDPOINTS, fallbackLine: "Transitous", label: "Transitous GTFS-RT" }
    ]
  },
  {
    id: "boston",
    provider: "multi",
    bbox: [42.58, -71.35, 42.17, -70.85],
    sources: [
      { provider: "mbta-json", endpoints: ["https://api-v3.mbta.com/vehicles"], label: "MBTA" },
      { provider: "amtraker", endpoints: AMTRAKER_ENDPOINTS, label: "Amtrak" },
      { provider: "gtfsrt-protobuf", endpoints: TRANSITOUS_ENDPOINTS, fallbackLine: "Transitous", label: "Transitous GTFS-RT" }
    ]
  },
  {
    id: "philadelphia",
    provider: "multi",
    bbox: [40.08, -75.35, 39.83, -74.95],
    sources: [
      { provider: "septa-json", endpoints: ["https://www3.septa.org/api/TrainView/index.php"], label: "SEPTA" },
      { provider: "amtraker", endpoints: AMTRAKER_ENDPOINTS, label: "Amtrak" },
      { provider: "gtfsrt-protobuf", endpoints: TRANSITOUS_ENDPOINTS, fallbackLine: "Transitous", label: "Transitous GTFS-RT" }
    ]
  },
  {
    id: "bay-area",
    provider: "multi",
    bbox: [38.10, -122.75, 37.20, -121.60],
    sources: [
      {
        provider: "gtfsrt-protobuf",
        endpoints: ["https://api.bart.gov/gtfsrt/vehiclepositions.aspx", "https://api.bart.gov/gtfsrt/vehicles.pb"],
        fallbackLine: "BART",
        label: "BART GTFS-RT"
      },
      { provider: "amtraker", endpoints: AMTRAKER_ENDPOINTS, label: "Amtrak" },
      { provider: "gtfsrt-protobuf", endpoints: TRANSITOUS_ENDPOINTS, fallbackLine: "Transitous", label: "Transitous GTFS-RT" }
    ]
  }
];

const jsonHeaders = {
  "content-type": "application/json; charset=UTF-8",
  "cache-control": "public, max-age=15, s-maxage=15, stale-while-revalidate=30"
};

const CACHE_TTL_MS = 15000;
const MS_TO_MPH_FACTOR = 2.23694;
const MS_TO_KMH_FACTOR = 3.6;

const cityCache = globalThis.__mtroCityCache || new Map();
const inflightByCity = globalThis.__mtroInflightByCity || new Map();

globalThis.__mtroCityCache = cityCache;
globalThis.__mtroInflightByCity = inflightByCity;

function inBbox(lat, lon, bbox) {
  return lat <= bbox[0] && lon >= bbox[1] && lat >= bbox[2] && lon <= bbox[3];
}

function toHeadingCardinal(degrees) {
  if (!Number.isFinite(degrees)) return null;
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const normalized = ((degrees % 360) + 360) % 360;
  return dirs[Math.round(normalized / 22.5) % dirs.length];
}

function parseAmtraker(data, city) {
  const rows = Array.isArray(data) ? data : Object.values(data || {}).flat();
  return rows
    .map((row) => {
      if (!row || typeof row !== "object") return null;
      const lat = Number(row.lat ?? row.latitude);
      const lon = Number(row.lon ?? row.lng ?? row.longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lon) || !inBbox(lat, lon, city.bbox)) return null;
      return {
        id: String(row.trainID ?? row.train_id ?? row.id ?? `${lat},${lon}`),
        line: String(row.routeName || row.route_name || row.route || row.trainNum || row.train_num || "Amtrak"),
        label: String(row.trainNum || row.trainID || row.train_num || row.train_id || "Train"),
        status: row.velocity != null ? `${Math.round(Number(row.velocity))} mph` : "Active",
        heading: toHeadingCardinal(Number(row.heading)),
        speed: row.velocity != null ? Math.round(Number(row.velocity)) : null,
        speedUnit: "mph",
        state: String(row.trainState || row.train_state || "Active"),
        type: "train",
        lat,
        lon
      };
    })
    .filter(Boolean);
}

function parseMbta(data, city) {
  const rows = Array.isArray(data?.data) ? data.data : [];
  return rows
    .map((row) => {
      const attrs = row?.attributes || {};
      const lat = Number(attrs.latitude);
      const lon = Number(attrs.longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lon) || !inBbox(lat, lon, city.bbox)) return null;
      const routeId = row?.relationships?.route?.data?.id;
      return {
        id: String(row?.id || `${lat},${lon}`),
        line: String(routeId || attrs.label || "MBTA"),
        label: String(attrs.label || attrs.vehicle_label || row?.id || "Vehicle"),
        status: String(attrs.current_status || "Active"),
        heading: toHeadingCardinal(Number(attrs.bearing)),
        speed: Number.isFinite(Number(attrs.speed)) ? Math.round(Number(attrs.speed) * MS_TO_MPH_FACTOR) : null,
        speedUnit: "mph",
        state: String(attrs.occupancy_status || "In service"),
        type: "train",
        lat,
        lon
      };
    })
    .filter(Boolean);
}

function extractGeoRows(value, maxRows = 400) {
  const rows = [];
  const queue = [value];
  const seen = new Set();

  while (queue.length && rows.length < maxRows) {
    const current = queue.shift();
    if (!current || typeof current !== "object") continue;
    if (seen.has(current)) continue;
    seen.add(current);

    if (Array.isArray(current)) {
      for (const item of current) queue.push(item);
      continue;
    }

    const lat = Number(current.lat ?? current.latitude ?? current.Latitude ?? current.LATITUDE ?? current.PositionLat);
    const lon = Number(current.lon ?? current.lng ?? current.longitude ?? current.Longitude ?? current.LONGITUDE ?? current.PositionLon);
    if (Number.isFinite(lat) && Number.isFinite(lon)) {
      rows.push(current);
    }

    for (const nested of Object.values(current)) {
      if (nested && typeof nested === "object") queue.push(nested);
    }
  }

  return rows;
}

function parseGenericGeoJson(data, city, defaultLine) {
  return extractGeoRows(data)
    .map((row, index) => {
      const lat = Number(row.lat ?? row.latitude ?? row.Latitude ?? row.LATITUDE ?? row.PositionLat);
      const lon = Number(row.lon ?? row.lng ?? row.longitude ?? row.Longitude ?? row.LONGITUDE ?? row.PositionLon);
      if (!Number.isFinite(lat) || !Number.isFinite(lon) || !inBbox(lat, lon, city.bbox)) return null;
      const speedMs = Number(row.speed ?? row.Speed ?? row.Velocity);
      const mph = Number.isFinite(speedMs) ? Math.round(speedMs * MS_TO_MPH_FACTOR) : null;
      const line = row.routeTag || row.route || row.Route || row.route_id || row.line || row.Line || row.TrainTypeName || defaultLine;
      const label = row.id || row.vehicle?.id || row.VehicleID || row.vehicleNo || row.TrainNo || row.trainNumber || `${index + 1}`;
      return {
        id: String(row.id || row.VehicleID || row.vehicleNo || row.trainNo || `${lat},${lon},${index}`),
        line: String(line || defaultLine),
        label: String(label),
        status: mph != null ? `${mph} mph` : String(row.status || row.Status || "Active"),
        heading: toHeadingCardinal(Number(row.heading ?? row.bearing ?? row.Bearing ?? row.DirectionDeg)),
        speed: mph,
        speedUnit: "mph",
        state: String(row.current_status || row.VehicleStatus || row.state || row.State || "In service"),
        type: "train",
        lat,
        lon
      };
    })
    .filter(Boolean);
}

function parseGtfsRealtime(buffer, city, fallbackLine) {
  let feed;
  try {
    feed = GtfsRealtime.FeedMessage.decode(new Uint8Array(buffer));
  } catch {
    return [];
  }

  const entities = Array.isArray(feed?.entity) ? feed.entity : [];
  return entities
    .map((entity, index) => {
      const vehicle = entity?.vehicle;
      const position = vehicle?.position;
      if (!position) return null;
      const lat = Number(position.latitude);
      const lon = Number(position.longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lon) || !inBbox(lat, lon, city.bbox)) return null;

      const speedMs = Number(position.speed);
      const speedKmh = Number.isFinite(speedMs) ? Math.round(speedMs * MS_TO_KMH_FACTOR) : null;
      const routeId = vehicle?.trip?.routeId;
      const tripId = vehicle?.trip?.tripId;
      const vehicleId = vehicle?.vehicle?.id || vehicle?.vehicle?.label;
      const ts = Number(vehicle?.timestamp?.low ?? vehicle?.timestamp);

      return {
        id: String(entity?.id || vehicleId || tripId || `${lat},${lon},${index}`),
        line: String(routeId || fallbackLine),
        label: String(vehicle?.vehicle?.label || vehicleId || tripId || "Vehicle"),
        status: ts ? `Updated ${new Date(ts * 1000).toISOString().slice(11, 16)} UTC` : "Active",
        heading: toHeadingCardinal(Number(position.bearing)),
        speed: speedKmh,
        speedUnit: "km/h",
        state: String(vehicle?.currentStatus || "In service"),
        type: "train",
        lat,
        lon
      };
    })
    .filter(Boolean);
}


function dedupeTrains(rows) {
  const out = [];
  const seen = new Set();
  for (const row of rows) {
    const key = `${row.id}|${row.line}|${row.label}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(row);
  }
  return out;
}

async function fetchWithTimeout(url, init = {}, timeoutMs = 12000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
      cache: "no-store",
      headers: {
        accept: "application/json;q=1.0, application/protobuf;q=0.95, application/vnd.google.protobuf;q=0.95, application/octet-stream;q=0.9, text/xml;q=0.8, */*;q=0.5",
        ...(init.headers || {})
      }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchFirst(urls, fetcher) {
  let lastError;
  for (const url of urls) {
    try {
      return await fetcher(url);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error("No data source available");
}

async function loadSourceData(city, source) {
  const endpoints = Array.isArray(source?.endpoints) ? source.endpoints : [];

  if (source.provider === "amtraker") {
    const data = await fetchFirst(endpoints, async (url) => (await fetchWithTimeout(url)).json());
    return parseAmtraker(data, city);
  }

  if (source.provider === "mbta-json") {
    const data = await fetchFirst(endpoints, async (url) => (await fetchWithTimeout(url)).json());
    return parseMbta(data, city);
  }

  if (source.provider === "septa-json") {
    const data = await fetchFirst(endpoints, async (url) => (await fetchWithTimeout(url)).json());
    return parseGenericGeoJson(data, city, "SEPTA");
  }

  if (source.provider === "gtfsrt-protobuf") {
    const buffer = await fetchFirst(endpoints, async (url) => (await fetchWithTimeout(url)).arrayBuffer());
    return parseGtfsRealtime(buffer, city, source.fallbackLine || city.id);
  }

  throw new Error(`Unsupported provider: ${source.provider}`);
}

async function loadCityData(city) {
  const sources = Array.isArray(city.sources)
    ? city.sources.filter(Boolean)
    : [];
  if (!sources.length) {
    return {
      trains: [],
      message: "No supported data source is configured for this selection."
    };
  }

  const settled = await Promise.all(
    sources.map(async (source) => {
      try {
        const trains = await loadSourceData(city, source);
        return { ok: true, source, trains };
      } catch (error) {
        return { ok: false, source, error };
      }
    })
  );

  const trains = dedupeTrains(
    settled
      .filter((entry) => entry.ok)
      .flatMap((entry) => entry.trains)
  );
  const successfulSources = settled
    .filter((entry) => entry.ok && entry.trains.length)
    .map((entry) => entry.source.label || entry.source.provider);
  const failedCount = settled.filter((entry) => !entry.ok).length;

  if (trains.length) {
    const sourceLabel = successfulSources.length
      ? successfulSources.join(", ")
      : "available feeds";
    const warning = failedCount ? " Some feeds are temporarily unavailable." : "";
    return {
      trains,
      message: `Loaded ${trains.length} train positions from ${sourceLabel}.${warning}`
    };
  }

  if (failedCount === sources.length) {
    return {
      trains: [],
      message: "All configured train feeds are temporarily unavailable for this area."
    };
  }

  if (failedCount > 0) {
    return {
      trains: [],
      message: "Some train feeds are temporarily unavailable for this area."
    };
  }

  return {
    trains: [],
    message: "No train positions found for this area."
  };
}

function getCached(cityId) {
  const cached = cityCache.get(cityId);
  if (!cached) return null;
  if (Date.now() - cached.timestamp > CACHE_TTL_MS) {
    cityCache.delete(cityId);
    return null;
  }
  return cached.payload;
}

async function loadCityDataCached(city) {
  const cached = getCached(city.id);
  if (cached) return cached;

  const inflight = inflightByCity.get(city.id);
  if (inflight) return inflight;

  const promise = loadCityData(city)
    .then((payload) => {
      cityCache.set(city.id, { timestamp: Date.now(), payload });
      return payload;
    })
    .finally(() => {
      inflightByCity.delete(city.id);
    });

  inflightByCity.set(city.id, promise);
  return promise;
}

export async function GET(request) {
  const url = new URL(request.url);
  const cityId = url.searchParams.get("city");
  const city = CITIES.find((entry) => entry.id === cityId) || CITIES[0];

  try {
    const payload = await loadCityDataCached(city);
    return new Response(JSON.stringify(payload), { status: 200, headers: jsonHeaders });
  } catch (error) {
    return new Response(
      JSON.stringify({ trains: [], message: `Unable to load train data: ${error.message}` }),
      { status: 200, headers: jsonHeaders }
    );
  }
}
