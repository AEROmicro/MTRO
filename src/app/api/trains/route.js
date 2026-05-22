// Cloudflare Pages requires non-static Next.js routes to run on the Edge runtime.
export const runtime = "edge";
import gtfsRealtimeBindings from "gtfs-realtime-bindings";

const { transit_realtime: GtfsRealtime } = gtfsRealtimeBindings;

const CITIES = [
  { id: "washington-dc", provider: "amtraker", bbox: [39.18, -77.50, 38.65, -76.73], endpoints: ["https://api-v3.amtraker.com/v3/trains", "https://api-v3.amtraker.com/v1/trains"] },
  { id: "new-york-city", provider: "amtraker", bbox: [41.05, -74.35, 40.45, -73.60], endpoints: ["https://api-v3.amtraker.com/v3/trains", "https://api-v3.amtraker.com/v1/trains"] },
  { id: "boston", provider: "mbta-json", bbox: [42.58, -71.35, 42.17, -70.85], endpoints: ["https://api-v3.mbta.com/vehicles"] },
  { id: "philadelphia", provider: "amtraker", bbox: [40.08, -75.35, 39.83, -74.95], endpoints: ["https://api-v3.amtraker.com/v3/trains", "https://api-v3.amtraker.com/v1/trains"] },
  { id: "baltimore", provider: "amtraker", bbox: [39.38, -76.75, 39.20, -76.50], endpoints: ["https://api-v3.amtraker.com/v3/trains", "https://api-v3.amtraker.com/v1/trains"] },
  { id: "richmond-va", provider: "amtraker", bbox: [37.65, -77.60, 37.43, -77.30], endpoints: ["https://api-v3.amtraker.com/v3/trains", "https://api-v3.amtraker.com/v1/trains"] },
  { id: "charlotte", provider: "amtraker", bbox: [35.37, -80.98, 35.12, -80.68], endpoints: ["https://api-v3.amtraker.com/v3/trains", "https://api-v3.amtraker.com/v1/trains"] },
  { id: "atlanta", provider: "marta-json", bbox: [33.92, -84.65, 33.62, -84.18], endpoints: ["https://gtfs-rt.itsmarta.com/TMRI/metropositions"] },
  { id: "miami", provider: "amtraker", bbox: [25.92, -80.42, 25.59, -80.00], endpoints: ["https://api-v3.amtraker.com/v3/trains", "https://api-v3.amtraker.com/v1/trains"] },
  { id: "orlando", provider: "amtraker", bbox: [28.68, -81.55, 28.40, -81.22], endpoints: ["https://api-v3.amtraker.com/v3/trains", "https://api-v3.amtraker.com/v1/trains"] },
  { id: "new-orleans", provider: "amtraker", bbox: [30.10, -90.30, 29.85, -89.87], endpoints: ["https://api-v3.amtraker.com/v3/trains", "https://api-v3.amtraker.com/v1/trains"] },
  { id: "chicago", provider: "amtraker", bbox: [42.10, -87.95, 41.62, -87.45], endpoints: ["https://api-v3.amtraker.com/v3/trains", "https://api-v3.amtraker.com/v1/trains"] },
  { id: "milwaukee", provider: "amtraker", bbox: [43.22, -88.10, 42.95, -87.77], endpoints: ["https://api-v3.amtraker.com/v3/trains", "https://api-v3.amtraker.com/v1/trains"] },
  { id: "minneapolis", provider: "amtraker", bbox: [45.08, -93.45, 44.86, -93.12], endpoints: ["https://api-v3.amtraker.com/v3/trains", "https://api-v3.amtraker.com/v1/trains"] },
  { id: "st-louis", provider: "amtraker", bbox: [38.78, -90.42, 38.50, -89.97], endpoints: ["https://api-v3.amtraker.com/v3/trains", "https://api-v3.amtraker.com/v1/trains"] },
  { id: "kansas-city", provider: "amtraker", bbox: [39.25, -94.78, 38.96, -94.38], endpoints: ["https://api-v3.amtraker.com/v3/trains", "https://api-v3.amtraker.com/v1/trains"] },
  { id: "detroit", provider: "amtraker", bbox: [42.45, -83.28, 42.20, -82.88], endpoints: ["https://api-v3.amtraker.com/v3/trains", "https://api-v3.amtraker.com/v1/trains"] },
  { id: "pittsburgh", provider: "amtraker", bbox: [40.58, -80.18, 40.32, -79.82], endpoints: ["https://api-v3.amtraker.com/v3/trains", "https://api-v3.amtraker.com/v1/trains"] },
  { id: "cleveland", provider: "amtraker", bbox: [41.62, -81.88, 41.38, -81.52], endpoints: ["https://api-v3.amtraker.com/v3/trains", "https://api-v3.amtraker.com/v1/trains"] },
  { id: "houston", provider: "amtraker", bbox: [29.92, -95.58, 29.60, -95.18], endpoints: ["https://api-v3.amtraker.com/v3/trains", "https://api-v3.amtraker.com/v1/trains"] },
  { id: "denver", provider: "amtraker", bbox: [39.88, -105.12, 39.59, -104.85], endpoints: ["https://api-v3.amtraker.com/v3/trains", "https://api-v3.amtraker.com/v1/trains"] },
  { id: "salt-lake-city", provider: "amtraker", bbox: [40.88, -112.03, 40.66, -111.76], endpoints: ["https://api-v3.amtraker.com/v3/trains", "https://api-v3.amtraker.com/v1/trains"] },
  { id: "albuquerque", provider: "amtraker", bbox: [35.22, -106.77, 34.98, -106.45], endpoints: ["https://api-v3.amtraker.com/v3/trains", "https://api-v3.amtraker.com/v1/trains"] },
  { id: "seattle", provider: "amtraker", bbox: [47.78, -122.55, 47.48, -122.20], endpoints: ["https://api-v3.amtraker.com/v3/trains", "https://api-v3.amtraker.com/v1/trains"] },
  { id: "portland-or", provider: "gtfsrt-protobuf", bbox: [45.65, -122.88, 45.43, -122.50], endpoints: ["https://developer.trimet.org/gtfs/realtime/vehiclePositions"] },
  { id: "sacramento", provider: "amtraker", bbox: [38.72, -121.65, 38.47, -121.37], endpoints: ["https://api-v3.amtraker.com/v3/trains", "https://api-v3.amtraker.com/v1/trains"] },
  { id: "san-francisco", provider: "gtfsrt-protobuf", bbox: [37.93, -122.56, 37.70, -122.30], endpoints: ["https://api.bart.gov/gtfsrt/vehiclepositions.aspx", "https://api.bart.gov/gtfsrt/vehicles.pb", "http://api.bart.gov/gtfsrt/vehiclepositions.aspx", "http://api.bart.gov/gtfsrt/vehicles.pb"] },
  { id: "oakland", provider: "gtfsrt-protobuf", bbox: [37.90, -122.38, 37.65, -122.10], endpoints: ["https://api.bart.gov/gtfsrt/vehiclepositions.aspx", "https://api.bart.gov/gtfsrt/vehicles.pb", "http://api.bart.gov/gtfsrt/vehiclepositions.aspx", "http://api.bart.gov/gtfsrt/vehicles.pb"] },
  { id: "los-angeles", provider: "amtraker", bbox: [34.22, -118.60, 33.88, -117.95], endpoints: ["https://api-v3.amtraker.com/v3/trains", "https://api-v3.amtraker.com/v1/trains"] },

  { id: "toronto", provider: "nextbus-json", bbox: [43.88, -79.67, 43.50, -79.10], endpoints: ["https://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=ttc&t=0"] },
  { id: "luxembourg", provider: "gtfsrt-protobuf", bbox: [50.20, 5.73, 49.42, 6.53], endpoints: ["https://data.public.lu/api/realtime/gtfs-rt/vehicle-positions"] },
  { id: "france", provider: "gtfsrt-protobuf", bbox: [51.3, -5.4, 41.2, 9.8], endpoints: ["https://proxy.transport.data.gouv.fr/resource/sncf-tgv-idtgv-info-circulations"] },
  { id: "paris-region", provider: "gtfsrt-protobuf", bbox: [49.4, 1.0, 48.1, 3.7], endpoints: ["https://proxy.transport.data.gouv.fr/resource/idfm-gtfs-rt-vehicle-positions"] },
  { id: "netherlands", provider: "gtfsrt-protobuf", bbox: [53.7, 3.2, 50.7, 7.3], endpoints: ["https://gtfs.ovapi.nl/vehiclePositions.pb"] },
  { id: "norway", provider: "gtfsrt-protobuf", bbox: [71.3, 4.5, 57.8, 31.3], endpoints: ["https://api.entur.io/realtime/v1/gtfs-rt/vehicle-positions"] },
  { id: "finland", provider: "digitraffic-json", bbox: [70.2, 19.0, 59.7, 31.9], endpoints: ["https://rata.digitraffic.fi/api/v1/train-locations/latest/"] },
  { id: "belgium", provider: "gtfsrt-protobuf", bbox: [51.6, 2.5, 49.4, 6.4], endpoints: ["https://gtfs.irail.be/nmbs/vehicle-positions.pb"] },
  { id: "sydney", provider: "gtfsrt-protobuf", bbox: [-32.8, 150.5, -34.4, 152.2], endpoints: ["https://opendata.transport.nsw.gov.au/gtfs/vehiclepos/buses"] },
  { id: "auckland", provider: "gtfsrt-protobuf", bbox: [-36.7, 174.4, -37.2, 175.2], endpoints: ["https://api.at.govt.nz/v2/public/realtime/vehiclepositions"] },
  { id: "santiago", provider: "gtfsrt-protobuf", bbox: [-33.2, -70.9, -33.8, -70.4], endpoints: ["https://api.dtpm.cl/gtfs-rt/vehiclePositions.pb"] },
  { id: "taiwan-hsr", provider: "taiwan-json", bbox: [25.5, 119.9, 21.8, 122.3], endpoints: ["https://tdx.transportdata.tw/api/basic/v2/Transit/RealTimeByFrequency/Train/THSR"] },
  { id: "transitous-global", provider: "gtfsrt-protobuf", bbox: [85, -180, -85, 180], endpoints: ["https://api.transitous.org/gtfs-rt/"] },
  { id: "switzerland", provider: "gtfsrt-protobuf", bbox: [47.85, 5.95, 45.75, 10.55], endpoints: ["https://gtfs.geops.ch/v1/gtfs-rt/vehicle-positions"] },
  { id: "london-central", provider: "tfl-xml", bbox: [51.67, -0.56, 51.25, 0.28], endpoints: ["https://api.tfl.gov.uk/TrackerNet/PredictionSummary/Central"] }
];

const jsonHeaders = {
  "content-type": "application/json; charset=UTF-8",
  "cache-control": "public, max-age=15, s-maxage=15, stale-while-revalidate=30"
};

const CACHE_TTL_MS = 15000;
const TRANSITOUS_ENDPOINTS = ["https://api.transitous.org/gtfs-rt/", "https://api.transitous.org/gtfs-rt", "https://transitous.org/gtfs-rt/"];
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

function parseTflXml(text, city) {
  const trains = [];
  const tagMatches = text.matchAll(/<(T|S)\s+([^>]+?)\/?>(?:<\/\1>)?/g);

  for (const match of tagMatches) {
    const attrsText = match[2];
    const attrs = {};
    for (const attr of attrsText.matchAll(/(\w+)="([^"]*)"/g)) {
      attrs[attr[1]] = attr[2];
    }
    const lat = Number(attrs.Lat ?? attrs.lat ?? attrs.Latitude);
    const lon = Number(attrs.Lon ?? attrs.lon ?? attrs.Longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || !inBbox(lat, lon, city.bbox)) continue;

    trains.push({
      id: String(attrs.VehicleId || attrs.I || attrs.N || `${lat},${lon}`),
      line: "TfL Central",
      label: String(attrs.N || attrs.VehicleId || "Train"),
      status: String(attrs.S || attrs.Status || "Active"),
      heading: toHeadingCardinal(Number(attrs.Heading)),
      speed: null,
      speedUnit: "mph",
      state: String(attrs.D || attrs.Destination || "In service"),
      type: "train",
      lat,
      lon
    });
  }

  return trains;
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

async function loadTransitousFallback(city, fallbackLine = "Transitous") {
  try {
    const buffer = await fetchFirst(TRANSITOUS_ENDPOINTS, async (url) => (await fetchWithTimeout(url)).arrayBuffer());
    return parseGtfsRealtime(buffer, city, fallbackLine);
  } catch (error) {
    throw new Error(`Transitous fallback failed: ${error?.message || "unknown error"}`);
  }
}

async function loadCityData(city) {
  if (city.provider === "amtraker") {
    let amtrakerTrains = [];
    let amtrakerError = null;
    try {
      const data = await fetchFirst(city.endpoints, async (url) => (await fetchWithTimeout(url)).json());
      amtrakerTrains = parseAmtraker(data, city);
    } catch (error) {
      amtrakerError = error;
    }

    let transitousTrains = [];
    let transitousError = null;
    try {
      transitousTrains = await loadTransitousFallback(city);
    } catch (error) {
      transitousError = error;
      transitousTrains = [];
    }

    const trains = dedupeTrains([...amtrakerTrains, ...transitousTrains]);
    if (trains.length) {
      return {
        trains,
        message: `Loaded ${trains.length} train positions from Amtrak and Transitous.`
      };
    }

    const bothFeedErrors = amtrakerError && transitousError;
    const hasFeedError = amtrakerError || transitousError;
    return {
      trains: [],
      message: bothFeedErrors
        ? "Primary and fallback train feeds are temporarily unavailable for this area."
        : hasFeedError
          ? "Some train feeds are temporarily unavailable for this area."
          : "No train positions found for this area."
    };
  }

  if (city.provider === "mbta-json") {
    const data = await fetchFirst(city.endpoints, async (url) => (await fetchWithTimeout(url)).json());
    const trains = parseMbta(data, city);
    return {
      trains,
      message: trains.length ? `Loaded ${trains.length} MBTA vehicle positions.` : "No MBTA vehicle positions found for this area."
    };
  }

  if (city.provider === "nextbus-json") {
    const data = await fetchFirst(city.endpoints, async (url) => (await fetchWithTimeout(url)).json());
    const trains = parseGenericGeoJson(data, city, "TTC");
    return {
      trains,
      message: trains.length ? `Loaded ${trains.length} TTC vehicle positions.` : "No TTC vehicle positions found for this area."
    };
  }

  if (city.provider === "marta-json") {
    const data = await fetchFirst(city.endpoints, async (url) => (await fetchWithTimeout(url)).json());
    const trains = parseGenericGeoJson(data, city, "MARTA");
    return {
      trains,
      message: trains.length ? `Loaded ${trains.length} MARTA vehicle positions.` : "No MARTA vehicle positions found for this area."
    };
  }

  if (city.provider === "digitraffic-json") {
    const data = await fetchFirst(city.endpoints, async (url) => (await fetchWithTimeout(url)).json());
    const trains = parseGenericGeoJson(data, city, "Finland Rail");
    return {
      trains,
      message: trains.length ? `Loaded ${trains.length} Finland rail positions.` : "No Finland rail positions found for this area."
    };
  }

  if (city.provider === "taiwan-json") {
    const data = await fetchFirst(city.endpoints, async (url) => (await fetchWithTimeout(url)).json());
    const trains = parseGenericGeoJson(data, city, "THSR");
    return {
      trains,
      message: trains.length ? `Loaded ${trains.length} Taiwan rail positions.` : "No Taiwan rail positions found for this area."
    };
  }

  if (city.provider === "tfl-xml") {
    const text = await fetchFirst(city.endpoints, async (url) => (await fetchWithTimeout(url)).text());
    const trains = parseTflXml(text, city);
    return {
      trains,
      message: trains.length ? `Loaded ${trains.length} TfL tracker positions.` : "TfL feed returned no usable coordinate positions for this area."
    };
  }

  if (city.provider === "gtfsrt-protobuf") {
    let trains = [];
    let sourceLabel = "GTFS-RT";
    let gtfsrtError = null;
    let transitousError = null;
    try {
      const buffer = await fetchFirst(city.endpoints, async (url) => (await fetchWithTimeout(url)).arrayBuffer());
      trains = parseGtfsRealtime(buffer, city, city.id);
    } catch (error) {
      gtfsrtError = error;
      trains = [];
    }
    if (!trains.length) {
      try {
        trains = await loadTransitousFallback(city);
        if (trains.length) sourceLabel = "Transitous GTFS-RT";
      } catch (error) {
        transitousError = error;
      }
    }
    const bothFeedErrors = gtfsrtError && transitousError;
    const hasFeedError = gtfsrtError || transitousError;
    return {
      trains,
      message: trains.length
        ? `Loaded ${trains.length} ${sourceLabel} vehicle positions.`
        : bothFeedErrors
          ? "Primary and fallback GTFS-RT feeds are temporarily unavailable for this area."
          : hasFeedError
            ? "Some GTFS-RT feeds are temporarily unavailable for this area."
            : "No GTFS-RT vehicle positions found for this area."
    };
  }

  return { trains: [], message: "No supported data source is configured for this selection." };
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
