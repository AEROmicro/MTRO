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
  { id: "san-francisco",   bbox: [37.93, -122.56, 37.70, -122.30], provider: "bart" },
  { id: "oakland",         bbox: [37.90, -122.38, 37.65, -122.10], provider: "bart" },
  { id: "los-angeles",     bbox: [34.22, -118.60, 33.88, -117.95], provider: "amtraker" },
  // ── Country-level rail departures (transport.rest) ─────────────────────────
  { id: "finland",         bbox: [70.20, 19.00, 59.70, 31.90], provider: "transport-rest", stationQuery: "Helsinki" },
  { id: "switzerland",     bbox: [47.85, 5.95, 45.75, 10.55], provider: "transport-rest", stationQuery: "Zuerich HB" },
  { id: "luxembourg",      bbox: [50.20, 5.73, 49.42, 6.53],  provider: "transport-rest", stationQuery: "Luxembourg, Gare" },
  { id: "germany",         bbox: [55.10, 5.86, 47.20, 15.05], provider: "transport-rest", stationQuery: "Berlin Hbf" },
  { id: "austria",         bbox: [49.05, 9.50, 46.35, 17.20], provider: "transport-rest", stationQuery: "Wien Hbf" },
  { id: "netherlands",     bbox: [53.70, 3.20, 50.70, 7.30],  provider: "transport-rest", stationQuery: "Amsterdam Centraal" }
];

const AMTRAKER_ENDPOINTS = [
  "https://api-v3.amtraker.com/v3/trains",
  "https://api-v3.amtraker.com/v1/trains"
];

const TRANSPORT_REST_ENDPOINTS = [
  "https://v6.db.transport.rest",
  "https://v5.db.transport.rest"
];
const BART_ENDPOINTS = [
  "https://api.bart.gov/api"
];
// Public BART demo key documented by BART for no-auth sample usage.
const DEFAULT_BART_API_KEY = "MW9S-E7SL-26DU-VV8V";
const BART_API_KEY = process.env.BART_API_KEY || DEFAULT_BART_API_KEY;
const RAIL_MODES = ["train", "subway", "tram"];
const RAIL_PRODUCTS = ["national", "nationalexp", "regional", "regionalexp", "suburban", "train", "subway", "tram"];
const RAIL_CATEGORY_PATTERN = /(rail|train|ice|ic|ec|re|rb|s\d|ir|tgv|rjx|ter|cfl)/i;
const DEPARTURE_DURATION_MINUTES = 120;
const MAX_DEPARTURE_RESULTS = 200;
const MAX_BART_RESULTS = 250;

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

function parseStopLocation(stop) {
  if (!stop || typeof stop !== "object") return null;
  const location = stop.location || stop.station?.location || stop.stop?.location || {};
  const lat = Number(location.latitude ?? location.lat);
  const lon = Number(location.longitude ?? location.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  return { lat, lon };
}

function mapBartStations(stationsData) {
  const stations = Array.isArray(stationsData?.root?.stations?.station)
    ? stationsData.root.stations.station
    : [];
  const stationMap = new Map();
  for (const station of stations) {
    const abbr = String(station?.abbr || "").trim();
    const lat = Number(station?.gtfs_latitude ?? station?.latitude);
    const lon = Number(station?.gtfs_longitude ?? station?.longitude);
    if (!abbr || !Number.isFinite(lat) || !Number.isFinite(lon)) continue;
    stationMap.set(abbr, { lat, lon });
  }
  return stationMap;
}

function parseBartDepartures(etdData, city, stationMap) {
  const stations = Array.isArray(etdData?.root?.station) ? etdData.root.station : [];
  const trains = [];

  for (const station of stations) {
    const stationAbbr = String(station?.abbr || "").trim();
    const stationName = String(station?.name || stationAbbr || "BART");
    const stationPoint = stationMap.get(stationAbbr);
    const lat = Number(stationPoint?.lat);
    const lon = Number(stationPoint?.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || !inBbox(lat, lon, city.bbox)) continue;

    const departures = Array.isArray(station?.etd) ? station.etd : [];
    for (let depIndex = 0; depIndex < departures.length; depIndex += 1) {
      const dep = departures[depIndex];
      const destination = String(dep?.destination || "BART");
      const estimates = Array.isArray(dep?.estimate) ? dep.estimate : [];
      for (let i = 0; i < estimates.length; i += 1) {
        const estimate = estimates[i] || {};
        const minutes = String(estimate?.minutes || "Leaving");
        const cars = estimate?.length ? `${estimate.length} cars` : "Active";
        trains.push({
          id: `${stationAbbr}-${destination}-${depIndex}-${i}`,
          line: `BART ${destination}`,
          label: stationAbbr || stationName,
          status: minutes === "Leaving" ? "Departing now" : `${minutes} min`,
          heading: estimate?.direction || null,
          speed: null,
          state: cars,
          type: "train",
          lat,
          lon
        });
      }
    }
  }

  return trains.slice(0, MAX_BART_RESULTS);
}

function toRailMode(value) {
  return String(value || "").toLowerCase();
}

function isRailDeparture(departure) {
  const mode = toRailMode(departure?.line?.mode);
  const product = toRailMode(departure?.line?.product);
  const category = toRailMode(departure?.line?.productName || departure?.line?.name);
  if (mode && !RAIL_MODES.includes(mode)) return false;
  if (product && RAIL_PRODUCTS.includes(product)) return true;
  if (category && RAIL_CATEGORY_PATTERN.test(category)) return true;
  // Some transport.rest feeds omit mode/product for rail lines; keep those rows.
  return !product && !mode;
}

function parseTransportRestDepartures(data, city, fallbackLocation) {
  const rows = Array.isArray(data?.departures) ? data.departures : (Array.isArray(data) ? data : []);
  return rows
    .filter(isRailDeparture)
    .map((row, index) => {
      const point = parseStopLocation(row.stop) || fallbackLocation;
      if (!point || !inBbox(point.lat, point.lon, city.bbox)) return null;
      const lineName = row?.line?.name || row?.line?.productName || row?.line?.fahrtNr || "Rail";
      const depTime = row?.when || row?.plannedWhen || row?.prognosis?.when || row?.prognosis?.prognosedWhen;
      const depLabel = depTime ? new Date(depTime).toISOString().slice(11, 16) : "Now";
      return {
        id: String(row.tripId || row.trip?.id || `${lineName}-${depTime || index}`),
        line: String(lineName),
        label: String(row?.line?.fahrtNr || row.tripId || depLabel),
        status: depTime ? `Departure ${depLabel}` : "Departure",
        heading: null,
        speed: null,
        state: row.cancelled ? "Cancelled" : "Scheduled",
        type: "train",
        lat: point.lat,
        lon: point.lon
      };
    })
    .filter(Boolean)
    .slice(0, 120);
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
    const amtrakerData = await fetchFirst(AMTRAKER_ENDPOINTS, { cache: "no-store" });
    const trains = parseAmtraker(amtrakerData, city);
    return {
      trains,
      message: trains.length
        ? `Loaded ${trains.length} live Amtrak train${trains.length !== 1 ? "s" : ""}.`
        : "No live Amtrak trains found in this area right now."
    };
  }

  if (city.provider === "bart") {
    const [etdData, stationsData] = await Promise.all([
      fetchFirst(
        BART_ENDPOINTS.map((base) => `${base}/etd.aspx?cmd=etd&orig=ALL&key=${encodeURIComponent(BART_API_KEY)}&json=y`),
        { cache: "no-store" }
      ),
      fetchFirst(
        BART_ENDPOINTS.map((base) => `${base}/stn.aspx?cmd=stns&key=${encodeURIComponent(BART_API_KEY)}&json=y`),
        { cache: "no-store" }
      )
    ]);
    const trains = parseBartDepartures(etdData, city, mapBartStations(stationsData));
    return {
      trains,
      message: trains.length
        ? `Loaded ${trains.length} BART departure estimate${trains.length !== 1 ? "s" : ""}.`
        : "No BART departures returned for this area."
    };
  }

  if (city.provider === "transport-rest") {
    const query = city.stationQuery || city.id;
    const stopLookupData = await fetchFirst(
      TRANSPORT_REST_ENDPOINTS.map((base) => `${base}/stops?query=${encodeURIComponent(query)}&results=1`),
      { cache: "no-store" }
    );
    const stopRows = Array.isArray(stopLookupData?.stops) ? stopLookupData.stops : (Array.isArray(stopLookupData) ? stopLookupData : []);
    const stop = stopRows[0];
    if (!stop) {
      return { trains: [], message: "No railway stop found for this selection." };
    }
    const stopId = stop.id ?? stop.station?.id ?? stop.stop?.id;
    const stopLocation = parseStopLocation(stop);
    if (!stopId || !stopLocation) {
      return { trains: [], message: "Rail stop data is incomplete for this selection." };
    }
    const departuresData = await fetchFirst(
      TRANSPORT_REST_ENDPOINTS.map(
        (base) => `${base}/stops/${encodeURIComponent(String(stopId))}/departures?duration=${DEPARTURE_DURATION_MINUTES}&results=${MAX_DEPARTURE_RESULTS}&remarks=false&language=en`
      ),
      { cache: "no-store" }
    );
    const trains = parseTransportRestDepartures(departuresData, city, stopLocation);
    return {
      trains,
      message: trains.length
        ? `Loaded ${trains.length} train departures.`
        : "No train departures returned for this selection."
    };
  }

  return {
    trains: [],
    message: "No supported real-time train API is configured for this selection."
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
