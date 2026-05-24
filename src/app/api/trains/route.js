// Cloudflare Pages requires non-static Next.js routes to run on the Edge runtime.
export const runtime = "edge";
import gtfsRealtimeBindings from "gtfs-realtime-bindings";

const { transit_realtime: GtfsRealtime } = gtfsRealtimeBindings;

/**
 * Parse API keys from one or more env-style inputs and return unique values.
 * @param {...string} rawValues Comma/whitespace separated key strings.
 * @returns {string[]} Unique, trimmed API keys.
 */
function parseApiKeys(...rawValues) {
  return [...new Set(
    rawValues
      .flatMap((value) => String(value || "").split(/[,\s]+/))
      .map((value) => value.trim())
      .filter(Boolean)
  )];
}

function keysOrNull(keys) {
  return Array.isArray(keys) && keys.length ? keys : [null];
}

const BART_PUBLIC_API_KEY = process.env.BART_API_KEY || "MW9S-E7SL-26DU-VV8V";
const WMATA_API_KEYS = parseApiKeys(
  process.env.WMATA_API_KEYS,
  process.env.WMATA_API_KEY,
  process.env.WMATA_PRIMARY_KEY,
  process.env.WMATA_SECONDARY_KEY
);
const MTA_API_KEY = process.env.MTA_API_KEY;
const METRA_API_KEYS = parseApiKeys(
  process.env.METRA_API_KEYS,
  process.env.METRA_API_KEY
);
const HOUSTON_METRO_API_KEYS = parseApiKeys(
  process.env.HOUSTON_METRO_API_KEYS,
  process.env.HOUSTON_METRO_API_KEY,
  process.env.HOUSTON_METRO_PRIMARY_KEY,
  process.env.HOUSTON_METRO_SECONDARY_KEY
);

const AMTRAKER_ENDPOINTS = [
  "https://api-v3.amtraker.com/v3/trains",
  "https://api-v3.amtraker.com/v1/trains"
];
const BART_ENDPOINTS = [
  `https://api.bart.gov/gtfsrt/vehicleposition.aspx?api_key=${encodeURIComponent(BART_PUBLIC_API_KEY)}`,
  `https://api.bart.gov/gtfsrt/vehiclepositions.aspx?api_key=${encodeURIComponent(BART_PUBLIC_API_KEY)}`,
  `https://api.bart.gov/gtfsrt/vehicleposition.pb?api_key=${encodeURIComponent(BART_PUBLIC_API_KEY)}`,
  `https://api.bart.gov/gtfsrt/vehiclepositions.pb?api_key=${encodeURIComponent(BART_PUBLIC_API_KEY)}`,
  "https://api.bart.gov/gtfsrt/vehicleposition.aspx",
  "https://api.bart.gov/gtfsrt/vehiclepositions.aspx",
  "https://api.bart.gov/gtfsrt/vehicleposition.pb",
  "https://api.bart.gov/gtfsrt/vehiclepositions.pb"
];
const MBTA_GTFSRT_ENDPOINTS = [
  "https://cdn.mbta.com/realtime/VehiclePositions.pb"
];
const SOUND_TRANSIT_ENDPOINTS = [
  "https://api.pugetsound.onebusaway.org/api/gtfs_realtime/vehicle-positions-for-agency/40.pb"
];
const SOUND_TRANSIT_ALT_ENDPOINTS = [
  "https://api.soundtransit.org/gtfsrealtime/vehicle-positions.pb"
];
const MARTA_ENDPOINTS = [
  "https://gtfs-rt.itsmarta.com/TMGTFSRealTimeWebService/vehicle",
  "https://gtfs-rt.itsmarta.com/TMGTFSRealTimeWebService/Vehicle/VehiclePositions.pb"
];
const VRE_ENDPOINTS = ["https://www.vre.org/gtfs-rt/vehiclepositions"];
const RTD_ENDPOINTS = ["https://www.rtd-denver.com/files/gtfs-rt/VehiclePosition.pb"];
const RTD_ALT_ENDPOINTS = [
  "https://gtfsrt.rtd-denver.com/gtfsrt/VehiclePosition"
];
const WMATA_RAIL_ENDPOINTS = [
  "https://api.wmata.com/gtfs/rail-gtfsrt-vehiclepositions.pb",
  "https://api.wmata.com/gtfs/rail-gtfsrt-vehiclepositions"
];
const WMATA_TRAIN_POSITIONS_ENDPOINTS = [
  "https://api.wmata.com/TrainPositions/TrainPositions?contentType=json",
  "https://api.wmata.com/TrainPositions/TrainPositions"
];
const WMATA_TRAIN_POSITION_SOURCES = keysOrNull(WMATA_API_KEYS).map((key) => ({
  provider: "wmata-json",
  endpoints: WMATA_TRAIN_POSITIONS_ENDPOINTS,
  label: "WMATA TrainPositions",
  headers: key ? { api_key: key } : undefined
}));
const WMATA_RAIL_SOURCES = keysOrNull(WMATA_API_KEYS).map((key) => ({
  provider: "gtfsrt-protobuf",
  endpoints: WMATA_RAIL_ENDPOINTS,
  fallbackLine: "WMATA",
  label: "WMATA Rail GTFS-RT",
  headers: key ? { api_key: key } : undefined
}));
const METRA_ENDPOINTS = [
  "https://gtfspublic.metrarail.com/gtfs/public/positions",
  ...METRA_API_KEYS.map((key) => `https://gtfspublic.metrarail.com/gtfs/public/positions?api_token=${encodeURIComponent(key)}`)
].filter(Boolean);
const HOUSTON_METRO_ENDPOINTS = [
  "https://api.ridemetro.org/data/gtfs/vehiclepositions",
  "https://api.ridemetro.org/data/gtfs/vehiclepositions/",
  "https://api.ridemetro.org/api/gtfs/vehiclepositions",
  "https://api.ridemetro.org/api/gtfs/vehiclepositions/"
];
const HOUSTON_METRO_SOURCE_BASE = {
  provider: "gtfsrt-protobuf",
  endpoints: HOUSTON_METRO_ENDPOINTS,
  fallbackLine: "METRO",
  label: "METRO GTFS Realtime"
};
const HOUSTON_METRO_SOURCES = keysOrNull(HOUSTON_METRO_API_KEYS).map((key) => ({
  ...HOUSTON_METRO_SOURCE_BASE,
  headers: key ? { "Ocp-Apim-Subscription-Key": key } : undefined
}));
const MTA_NYCT_ENDPOINTS = [
  "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs",
  "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct/gtfs"
];
const MTA_LIRR_ENDPOINTS = [
  "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/lirr%2Fgtfs-lirr",
  "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/lirr/gtfs-lirr"
];
const MTA_MNR_ENDPOINTS = [
  "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/mnr%2Fgtfs-mnr",
  "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/mnr/gtfs-mnr"
];
const SEPTA_RAIL_GTFSRT_ENDPOINTS = [
  "https://www3.septa.org/gtfsrt/septarail-pa-us/Vehicle/rtVehiclePosition.pb"
];
const SEPTA_BUS_GTFSRT_ENDPOINTS = [
  "https://www3.septa.org/gtfsrt/septa-pa-us/Vehicle/rtVehiclePosition.pb"
];
// Try canonical endpoint first, then common URL variants observed during upstream URL migrations.
const TRANSITOUS_ENDPOINTS = [
  "https://api.transitous.org/gtfs-rt/",
  "https://api.transitous.org/gtfs-rt",
  "https://transitous.org/gtfs-rt/"
];
const NEXTBUS_ENDPOINTS = {
  dcCirculator: "https://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=dc-circulator&t=0",
  mbta: "https://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=mbta&t=0",
  septa: "https://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=septa&t=0",
  sfmuni: "https://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=sf-muni&t=0",
  cta: "https://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=cta&t=0",
  laMetro: "https://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=lametro&t=0"
};

const CITIES = [
  {
    id: "washington-dc",
    provider: "multi",
    bbox: [39.18, -77.50, 38.65, -76.73],
    sources: [
      { provider: "gtfsrt-protobuf", endpoints: VRE_ENDPOINTS, fallbackLine: "VRE", label: "VRE GTFS-RT" },
      ...WMATA_TRAIN_POSITION_SOURCES,
      ...WMATA_RAIL_SOURCES,
      { provider: "nextbus-json", endpoints: [NEXTBUS_ENDPOINTS.dcCirculator], fallbackLine: "DC Circulator", label: "NextBus DC Circulator" },
      { provider: "amtraker", endpoints: AMTRAKER_ENDPOINTS, label: "Amtrak" },
      { provider: "gtfsrt-protobuf", endpoints: TRANSITOUS_ENDPOINTS, fallbackLine: "Transitous", label: "Transitous GTFS-RT" }
    ]
  },
  {
    id: "new-york-city",
    provider: "multi",
    bbox: [41.05, -74.35, 40.45, -73.60],
    sources: [
      {
        provider: "gtfsrt-protobuf",
        endpoints: MTA_NYCT_ENDPOINTS,
        fallbackLine: "MTA Subway",
        label: "MTA NYCT GTFS-RT",
        headers: MTA_API_KEY ? { "x-api-key": MTA_API_KEY } : undefined
      },
      {
        provider: "gtfsrt-protobuf",
        endpoints: MTA_LIRR_ENDPOINTS,
        fallbackLine: "LIRR",
        label: "MTA LIRR GTFS-RT",
        headers: MTA_API_KEY ? { "x-api-key": MTA_API_KEY } : undefined
      },
      {
        provider: "gtfsrt-protobuf",
        endpoints: MTA_MNR_ENDPOINTS,
        fallbackLine: "Metro-North",
        label: "MTA MNR GTFS-RT",
        headers: MTA_API_KEY ? { "x-api-key": MTA_API_KEY } : undefined
      },
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
      { provider: "gtfsrt-protobuf", endpoints: MBTA_GTFSRT_ENDPOINTS, fallbackLine: "MBTA", label: "MBTA GTFS-RT" },
      { provider: "nextbus-json", endpoints: [NEXTBUS_ENDPOINTS.mbta], fallbackLine: "MBTA", label: "NextBus MBTA" },
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
      { provider: "gtfsrt-protobuf", endpoints: SEPTA_RAIL_GTFSRT_ENDPOINTS, fallbackLine: "SEPTA Rail", label: "SEPTA Rail GTFS-RT" },
      { provider: "gtfsrt-protobuf", endpoints: SEPTA_BUS_GTFSRT_ENDPOINTS, fallbackLine: "SEPTA", label: "SEPTA GTFS-RT" },
      { provider: "nextbus-json", endpoints: [NEXTBUS_ENDPOINTS.septa], fallbackLine: "SEPTA", label: "NextBus SEPTA" },
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
        endpoints: BART_ENDPOINTS,
        fallbackLine: "BART",
        label: "BART GTFS-RT"
      },
      { provider: "nextbus-json", endpoints: [NEXTBUS_ENDPOINTS.sfmuni], fallbackLine: "SF Muni", label: "NextBus SF Muni" },
      { provider: "amtraker", endpoints: AMTRAKER_ENDPOINTS, label: "Amtrak" },
      { provider: "gtfsrt-protobuf", endpoints: TRANSITOUS_ENDPOINTS, fallbackLine: "Transitous", label: "Transitous GTFS-RT" }
    ]
  },
  {
    id: "seattle",
    provider: "multi",
    bbox: [47.90, -122.55, 47.35, -121.95],
    sources: [
      {
        provider: "gtfsrt-protobuf",
        endpoints: SOUND_TRANSIT_ENDPOINTS,
        fallbackLine: "Sound Transit",
        label: "Sound Transit GTFS-RT"
      },
      {
        provider: "gtfsrt-protobuf",
        endpoints: SOUND_TRANSIT_ALT_ENDPOINTS,
        fallbackLine: "Sound Transit",
        label: "Sound Transit GTFS-RT (alt)"
      },
      { provider: "amtraker", endpoints: AMTRAKER_ENDPOINTS, label: "Amtrak" },
      { provider: "gtfsrt-protobuf", endpoints: TRANSITOUS_ENDPOINTS, fallbackLine: "Seattle Rail", label: "Transitous GTFS-RT" }
    ]
  },
  {
    id: "atlanta",
    provider: "multi",
    bbox: [34.15, -84.70, 33.40, -83.95],
    sources: [
      {
        provider: "gtfsrt-protobuf",
        endpoints: MARTA_ENDPOINTS,
        fallbackLine: "MARTA",
        label: "MARTA GTFS-RT"
      },
      { provider: "amtraker", endpoints: AMTRAKER_ENDPOINTS, label: "Amtrak" },
      { provider: "gtfsrt-protobuf", endpoints: TRANSITOUS_ENDPOINTS, fallbackLine: "Atlanta Rail", label: "Transitous GTFS-RT" }
    ]
  },
  {
    id: "denver",
    provider: "multi",
    bbox: [40.10, -105.30, 39.55, -104.70],
    sources: [
      { provider: "gtfsrt-protobuf", endpoints: RTD_ENDPOINTS, fallbackLine: "RTD", label: "RTD GTFS-RT" },
      { provider: "gtfsrt-protobuf", endpoints: RTD_ALT_ENDPOINTS, fallbackLine: "RTD", label: "RTD GTFS-RT (alt)" },
      { provider: "amtraker", endpoints: AMTRAKER_ENDPOINTS, label: "Amtrak" },
      { provider: "gtfsrt-protobuf", endpoints: TRANSITOUS_ENDPOINTS, fallbackLine: "Transitous", label: "Transitous GTFS-RT" }
    ]
  },
  {
    id: "chicago",
    provider: "multi",
    bbox: [42.15, -88.10, 41.60, -87.45],
    sources: [
      { provider: "gtfsrt-protobuf", endpoints: METRA_ENDPOINTS, fallbackLine: "Metra", label: "Metra GTFS-RT" },
      { provider: "nextbus-json", endpoints: [NEXTBUS_ENDPOINTS.cta], fallbackLine: "CTA", label: "NextBus CTA" },
      { provider: "amtraker", endpoints: AMTRAKER_ENDPOINTS, label: "Amtrak" },
      { provider: "gtfsrt-protobuf", endpoints: TRANSITOUS_ENDPOINTS, fallbackLine: "Chicago Rail", label: "Transitous GTFS-RT" }
    ]
  },
  {
    id: "houston",
    provider: "multi",
    bbox: [30.20, -95.80, 29.40, -95.00],
    sources: [
      ...HOUSTON_METRO_SOURCES,
      { provider: "amtraker", endpoints: AMTRAKER_ENDPOINTS, label: "Amtrak" },
      { provider: "gtfsrt-protobuf", endpoints: TRANSITOUS_ENDPOINTS, fallbackLine: "Houston Rail", label: "Transitous GTFS-RT" }
    ]
  },
  {
    id: "milwaukee",
    provider: "multi",
    bbox: [43.25, -88.20, 42.85, -87.75],
    sources: [
      { provider: "amtraker", endpoints: AMTRAKER_ENDPOINTS, label: "Amtrak" },
      { provider: "gtfsrt-protobuf", endpoints: TRANSITOUS_ENDPOINTS, fallbackLine: "Milwaukee Rail", label: "Transitous GTFS-RT" }
    ]
  },
  {
    id: "los-angeles",
    provider: "multi",
    bbox: [34.45, -118.90, 33.65, -117.60],
    sources: [
      { provider: "nextbus-json", endpoints: [NEXTBUS_ENDPOINTS.laMetro], fallbackLine: "LA Metro", label: "NextBus LA Metro" },
      { provider: "amtraker", endpoints: AMTRAKER_ENDPOINTS, label: "Amtrak" },
      { provider: "gtfsrt-protobuf", endpoints: TRANSITOUS_ENDPOINTS, fallbackLine: "Los Angeles Rail", label: "Transitous GTFS-RT" }
    ]
  }
];

const jsonHeaders = {
  "content-type": "application/json; charset=UTF-8",
  "cache-control": "public, max-age=15, s-maxage=15, stale-while-revalidate=30"
};

const CACHE_TTL_MS = 15000;
const MIN_STOPPED_THRESHOLD_SECONDS = 15;
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

function parseWmataJson(data, city) {
  const rows = Array.isArray(data?.TrainPositions) ? data.TrainPositions : [];
  return rows
    .map((row, index) => {
      if (!row || typeof row !== "object") return null;
      const lat = Number(row.Lat ?? row.lat ?? row.latitude);
      const lon = Number(row.Lon ?? row.lon ?? row.longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lon) || !inBbox(lat, lon, city.bbox)) return null;
      const trainId = row.TrainId ?? row.TrainNumber ?? row.Car ?? row.ID;
      const lineCode = row.LineCode ?? row.ServiceType ?? "WMATA";
      const atStopSeconds = Number(row.SecondsAtLocation);
      const destination = row.DestinationStationName ?? row.DestinationStationCode ?? row.ServiceType ?? "In service";
      const status = Number.isFinite(atStopSeconds) && atStopSeconds >= MIN_STOPPED_THRESHOLD_SECONDS
        ? `Stopped ${Math.round(atStopSeconds)}s`
        : "Active";

      return {
        id: String(trainId || `wmata-unknown-${index}`),
        line: String(lineCode),
        label: String(trainId || "WMATA train"),
        status,
        heading: null,
        speed: null,
        speedUnit: "mph",
        state: String(destination),
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

function parseNextBus(data, city, defaultLine) {
  const rows = Array.isArray(data?.vehicle) ? data.vehicle : [];
  return rows
    .map((row, index) => {
      const lat = Number(row?.lat);
      const lon = Number(row?.lon);
      if (!Number.isFinite(lat) || !Number.isFinite(lon) || !inBbox(lat, lon, city.bbox)) return null;
      const speedKmHr = Number(row?.speedKmHr);
      const speedMph = Number.isFinite(speedKmHr) ? Math.round(speedKmHr / 1.60934) : null;
      const secsSinceReport = Number(row?.secsSinceReport);
      const status = Number.isFinite(speedMph)
        ? `${speedMph} mph`
        : Number.isFinite(secsSinceReport)
          ? `Reported ${secsSinceReport} sec ago`
          : "Active";

      return {
        id: String(row?.id || `${lat.toFixed(6)},${lon.toFixed(6)},${index}`),
        line: String(row?.routeTag || defaultLine),
        label: String(row?.id || row?.vehicleLabel || `${index + 1}`),
        status,
        heading: toHeadingCardinal(Number(row?.heading)),
        speed: speedMph,
        speedUnit: "mph",
        state: String(row?.dirTag || "In service"),
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
    throw new Error("Invalid GTFS-RT protobuf payload");
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
  const requestInit = source?.headers ? { headers: source.headers } : {};

  if (source.provider === "amtraker") {
    const data = await fetchFirst(endpoints, async (url) => (await fetchWithTimeout(url, requestInit)).json());
    return parseAmtraker(data, city);
  }

  if (source.provider === "mbta-json") {
    const data = await fetchFirst(endpoints, async (url) => (await fetchWithTimeout(url, requestInit)).json());
    return parseMbta(data, city);
  }

  if (source.provider === "septa-json") {
    const data = await fetchFirst(endpoints, async (url) => (await fetchWithTimeout(url, requestInit)).json());
    return parseGenericGeoJson(data, city, "SEPTA");
  }

  if (source.provider === "nextbus-json") {
    const data = await fetchFirst(endpoints, async (url) => (await fetchWithTimeout(url, requestInit)).json());
    return parseNextBus(data, city, source.fallbackLine || city.id);
  }

  if (source.provider === "wmata-json") {
    const data = await fetchFirst(endpoints, async (url) => (await fetchWithTimeout(url, requestInit)).json());
    return parseWmataJson(data, city);
  }

  if (source.provider === "gtfsrt-protobuf") {
    const buffer = await fetchFirst(endpoints, async (url) => (await fetchWithTimeout(url, requestInit)).arrayBuffer());
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
