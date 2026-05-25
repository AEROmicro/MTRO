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

function trimTrailingSlashes(value) {
  return String(value || "").replace(/\/+$/, "");
}

function createStrictKeyedSources(keys, createSource) {
  return Array.isArray(keys) && keys.length
    ? keys.map((key) => createSource(key)).filter(Boolean)
    : [];
}

const BART_PUBLIC_API_KEY = process.env.BART_API_KEY || "MW9S-E7SL-26DU-VV8V";
const WMATA_DEMO_API_KEY = String(process.env.WMATA_DEMO_API_KEY || "e13626d03d8e4c03ac07f95541b3091b").trim();
const WMATA_API_KEYS = parseApiKeys(
  process.env.WMATA_API_KEYS,
  process.env.WMATA_API_KEY,
  process.env.WMATA_PRIMARY_KEY,
  process.env.WMATA_SECONDARY_KEY
);
const WMATA_EFFECTIVE_API_KEYS = WMATA_API_KEYS.length
  ? WMATA_API_KEYS
  : parseApiKeys(WMATA_DEMO_API_KEY);
const MTA_API_KEY = process.env.MTA_API_KEY;
const METRA_API_KEYS = parseApiKeys(
  process.env.METRA_API_KEYS,
  process.env.METRA_API_KEY
);
const BAY_AREA_511_API_KEYS = parseApiKeys(
  process.env.BAY_AREA_511_API_KEYS,
  process.env.BAY_AREA_511_API_KEY
);
const HOUSTON_METRO_API_KEYS = parseApiKeys(
  process.env.HOUSTON_METRO_API_KEYS,
  process.env.HOUSTON_METRO_API_KEY,
  process.env.HOUSTON_METRO_PRIMARY_KEY,
  process.env.HOUSTON_METRO_SECONDARY_KEY
);
const STM_API_KEYS = parseApiKeys(
  process.env.STM_API_KEYS,
  process.env.STM_API_KEY
);
const TRANSLINK_API_KEYS = parseApiKeys(
  process.env.TRANSLINK_API_KEYS,
  process.env.TRANSLINK_API_KEY
);
const MOBILITY_DATABASE_API_BASE = trimTrailingSlashes(process.env.MOBILITY_DATABASE_API_BASE || "https://api.mobilitydatabase.org");
const MOBILITY_DATABASE_ACCESS_TOKEN = String(process.env.MOBILITY_DATABASE_ACCESS_TOKEN || "").trim();
const MOBILITY_DATABASE_REFRESH_TOKEN = String(process.env.MOBILITY_DATABASE_REFRESH_TOKEN || "").trim();
const MOBILITY_DATABASE_MAX_ENDPOINTS = Math.max(1, Math.min(25, Number(process.env.MOBILITY_DATABASE_MAX_ENDPOINTS) || 25));
const DEFAULT_MOBILITY_DATABASE_TOKEN_EXPIRY_SECONDS = 3600;
const MOBILITY_DATABASE_TOKEN_REUSE_BUFFER_MS = 15000;

const AMTRAKER_ENDPOINTS = [
  "https://api-v3.amtraker.com/v3/trains",
  "https://api-v3.amtraker.com/v1/trains"
];
const BART_ENDPOINTS = [...new Set([
  `https://api.bart.gov/gtfsrt/vehicleposition.aspx?api_key=${encodeURIComponent(BART_PUBLIC_API_KEY)}`,
  `https://api.bart.gov/gtfsrt/vehiclepositions.aspx?api_key=${encodeURIComponent(BART_PUBLIC_API_KEY)}`,
  `https://api.bart.gov/gtfsrt/vehicleposition.pb?api_key=${encodeURIComponent(BART_PUBLIC_API_KEY)}`,
  `https://api.bart.gov/gtfsrt/vehiclepositions.pb?api_key=${encodeURIComponent(BART_PUBLIC_API_KEY)}`,
  "https://api.bart.gov/gtfsrt/vehiclepositions.aspx",
  "https://api.bart.gov/gtfsrt/vehicleposition.aspx",
  "https://api.bart.gov/gtfsrt/vehicleposition.pb",
  "https://api.bart.gov/gtfsrt/vehiclepositions.pb",
  // BART has historically served anonymous GTFS-RT over plain HTTP; keep unauthenticated
  // HTTP fallbacks only after all HTTPS options so legacy-only upstream paths still work.
  "http://api.bart.gov/gtfsrt/vehiclepositions.aspx",
  "http://api.bart.gov/gtfsrt/vehicleposition.aspx",
  "http://api.bart.gov/gtfsrt/vehicleposition.pb",
  "http://api.bart.gov/gtfsrt/vehiclepositions.pb"
])];
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
const WMATA_BUS_ENDPOINTS = [
  "https://api.wmata.com/gtfs/bus-vehicle-positions.pb",
  "https://api.wmata.com/gtfs/bus-vehicle-positions"
];
const WMATA_TRAIN_POSITIONS_ENDPOINTS = [
  "https://api.wmata.com/TrainPositions/TrainPositions?contentType=json",
  "https://api.wmata.com/TrainPositions/TrainPositions"
];
const WMATA_TRAIN_POSITION_SOURCES = WMATA_EFFECTIVE_API_KEYS.map((key) => ({
  provider: "wmata-json",
  endpoints: WMATA_TRAIN_POSITIONS_ENDPOINTS,
  label: "WMATA TrainPositions",
  headers: { api_key: key }
}));
const WMATA_RAIL_SOURCES = WMATA_EFFECTIVE_API_KEYS.map((key) => ({
  provider: "gtfsrt-protobuf",
  endpoints: WMATA_RAIL_ENDPOINTS,
  fallbackLine: "WMATA",
  label: "WMATA Rail GTFS-RT",
  defaultType: "train",
  headers: { api_key: key }
}));
const WMATA_BUS_SOURCES = WMATA_EFFECTIVE_API_KEYS.map((key) => ({
  provider: "gtfsrt-protobuf",
  endpoints: WMATA_BUS_ENDPOINTS,
  fallbackLine: "WMATA Bus",
  label: "WMATA Bus GTFS-RT",
  defaultType: "bus",
  headers: { api_key: key }
}));
const METRA_ENDPOINTS = [
  "https://gtfspublic.metrarail.com/gtfs/public/positions",
  ...METRA_API_KEYS.map((key) => `https://gtfspublic.metrarail.com/gtfs/public/positions?api_token=${encodeURIComponent(key)}`)
].filter(Boolean);
const HOUSTON_METRO_ENDPOINTS = [
  "https://api.ridemetro.org/gtfsVehiclePositions/VehiclePositions",
  "https://api.ridemetro.org/data/gtfs/vehiclepositions",
  "https://api.ridemetro.org/data/gtfs/vehiclepositions/",
  "https://api.ridemetro.org/api/gtfs/vehiclepositions",
  "https://api.ridemetro.org/api/gtfs/vehiclepositions/"
];
const HOUSTON_METRO_SOURCE_BASE = {
  provider: "gtfsrt-protobuf",
  endpoints: HOUSTON_METRO_ENDPOINTS,
  fallbackLine: "METRO",
  label: "METRO GTFS Realtime",
  defaultType: "bus"
};
const HOUSTON_METRO_SOURCES = keysOrNull(HOUSTON_METRO_API_KEYS).map((key) => ({
  ...HOUSTON_METRO_SOURCE_BASE,
  headers: key ? { "Ocp-Apim-Subscription-Key": key } : undefined
}));
const MCTS_ENDPOINTS = [
  "https://realtime.ridemcts.com/gtfsrt/vehicles"
];
const BAY_AREA_511_AGENCIES = [
  { agency: "RG", fallbackLine: "511 Regional", label: "511 Regional GTFS-RT" },
  { agency: "SF", fallbackLine: "SFMTA Muni", label: "511 SFMTA GTFS-RT", defaultType: "tram" },
  { agency: "AC", fallbackLine: "AC Transit", label: "511 AC Transit GTFS-RT", defaultType: "bus" },
  { agency: "SC", fallbackLine: "VTA", label: "511 VTA GTFS-RT", defaultType: "tram" },
  { agency: "CT", fallbackLine: "Caltrain", label: "511 Caltrain GTFS-RT", defaultType: "train" }
];
const BAY_AREA_511_SOURCES = createStrictKeyedSources(
  BAY_AREA_511_API_KEYS,
  (key) => BAY_AREA_511_AGENCIES.map((source) => ({
    provider: "gtfsrt-protobuf",
    endpoints: [`https://api.511.org/Transit/VehiclePositions?api_key=${encodeURIComponent(key)}&agency=${encodeURIComponent(source.agency)}`],
    fallbackLine: source.fallbackLine,
    label: source.label,
    defaultType: source.defaultType
  }))
).flat();
const LA_METRO_GTFS_ENDPOINTS = [
  "https://api.metro.net/gtfs/vehiclePositions/vehicles.pb"
];
const LA_METRO_JSON_SOURCES = [
  {
    provider: "gtfsrt-json",
    endpoints: ["https://api.metro.net/agencies/LACMTA/vehicle_positions/"],
    fallbackLine: "LA Metro Bus",
    label: "LA Metro API v2 Bus",
    defaultType: "bus"
  },
  {
    provider: "gtfsrt-json",
    endpoints: ["https://api.metro.net/agencies/LACMTA_Rail/vehicle_positions/"],
    fallbackLine: "LA Metro Rail",
    label: "LA Metro API v2 Rail",
    defaultType: "train"
  }
];
const MTA_NYCT_ENDPOINTS = [
  "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs",
  "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct/gtfs"
];
const MTA_BUS_ENDPOINTS = [
  "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/mta-bus",
  "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/mta-bus%2Fgtfs",
  "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/mta-bus/gtfs"
];
const MTA_LIRR_ENDPOINTS = [
  "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/lirr%2Fgtfs-lirr",
  "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/lirr/gtfs-lirr"
];
const MTA_MNR_ENDPOINTS = [
  "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/mnr%2Fgtfs-mnr",
  "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/mnr/gtfs-mnr"
];
const MTA_HEADERS = MTA_API_KEY ? { "x-api-key": MTA_API_KEY } : undefined;
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
const NEXTBUS_BASE_URL = "https://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=";
const nextBusUrl = (agencyTag) => `${NEXTBUS_BASE_URL}${encodeURIComponent(agencyTag)}&t=0`;
const NEXTBUS_ENDPOINTS = {
  dcCirculator: nextBusUrl("dc-circulator"),
  fairfaxConnector: nextBusUrl("fairfax"),
  mbta: nextBusUrl("mbta"),
  septa: nextBusUrl("septa"),
  sfmuni: nextBusUrl("sf-muni"),
  acTransit: nextBusUrl("actransit"),
  vta: nextBusUrl("vta"),
  samTrans: nextBusUrl("samtrans"),
  cta: nextBusUrl("cta"),
  pace: nextBusUrl("pace"),
  laMetro: nextBusUrl("lametro"),
  bigBlueBus: nextBusUrl("bigbluebus"),
  culverCityBus: nextBusUrl("culvercity")
};
const DETROIT_DDOT_ENDPOINTS = [
  "https://ddot-beta.herokuapp.com/gtfsrt/vehiclePositions.pb"
];
const DETROIT_DDOT_ALT_ENDPOINTS = [
  "https://ddotapi.herokuapp.com/vehicle_positions.pb"
];
const UTA_ENDPOINTS = [
  "https://apps.rideuta.com/tms/gtfs/Vehicle"
];
const UTA_ALT_ENDPOINTS = [
  "https://data.rideuta.com/gtfs-rt/VehiclePosition.pb"
];
const TTC_ENDPOINTS = [
  "https://bustime.ttc.ca/gtfsrt/vehicles"
];
const STM_ENDPOINTS = [
  "https://api.stm.info/pub/od/gtfs-rt/ic/vp"
];
const STM_SOURCES = createStrictKeyedSources(STM_API_KEYS, (key) => ({
  provider: "gtfsrt-protobuf",
  endpoints: STM_ENDPOINTS,
  fallbackLine: "STM",
  label: "STM GTFS-RT",
  headers: { apiKey: key }
}));
const TRANSLINK_SOURCES = createStrictKeyedSources(TRANSLINK_API_KEYS, (key) => ({
  provider: "gtfsrt-protobuf",
  endpoints: [`https://gtfsapi.translink.ca/v3/gtfsposition?apikey=${encodeURIComponent(key)}`],
  fallbackLine: "TransLink",
  label: "TransLink GTFS-RT"
}));
const MOBILITY_DATABASE_CITY_FILTERS = {
  "washington-dc": { country_code: "US", subdivision_name: "District of Columbia", municipality: "Washington" },
  "new-york-city": { country_code: "US", subdivision_name: "New York", municipality: "New York" },
  boston: { country_code: "US", subdivision_name: "Massachusetts", municipality: "Boston" },
  philadelphia: { country_code: "US", subdivision_name: "Pennsylvania", municipality: "Philadelphia" },
  "bay-area": { country_code: "US", subdivision_name: "California", municipality: "San Francisco" },
  seattle: { country_code: "US", subdivision_name: "Washington", municipality: "Seattle" },
  atlanta: { country_code: "US", subdivision_name: "Georgia", municipality: "Atlanta" },
  denver: { country_code: "US", subdivision_name: "Colorado", municipality: "Denver" },
  chicago: { country_code: "US", subdivision_name: "Illinois", municipality: "Chicago" },
  houston: { country_code: "US", subdivision_name: "Texas", municipality: "Houston" },
  detroit: { country_code: "US", subdivision_name: "Michigan", municipality: "Detroit" },
  "salt-lake-city": { country_code: "US", subdivision_name: "Utah", municipality: "Salt Lake City" },
  milwaukee: { country_code: "US", subdivision_name: "Wisconsin", municipality: "Milwaukee" },
  "los-angeles": { country_code: "US", subdivision_name: "California", municipality: "Los Angeles" },
  toronto: { country_code: "CA", subdivision_name: "Ontario", municipality: "Toronto" },
  montreal: { country_code: "CA", subdivision_name: "Quebec", municipality: "Montreal" },
  vancouver: { country_code: "CA", subdivision_name: "British Columbia", municipality: "Vancouver" }
};

function createMobilityDatabaseSource(cityId, fallbackLine, defaultType = "train", options = {}) {
  const locationFilter = MOBILITY_DATABASE_CITY_FILTERS[cityId];
  if (!locationFilter) return null; // Intentionally optional so unsupported cities can skip discovery.
  const filterMode = options.officialFilter || "official-only";
  const mobilityDatabase = {
    ...locationFilter,
    entity_types: "vp",
    ...(options.mobilityDatabase || {})
  };
  if (options.includeMunicipality === false) {
    delete mobilityDatabase.municipality;
  }
  if (filterMode === "official-only") {
    mobilityDatabase.is_official = true;
  } else if (filterMode === "community-only") {
    mobilityDatabase.is_official = false;
  } else if (filterMode === "official-and-community") {
    delete mobilityDatabase.is_official;
  } else {
    mobilityDatabase.is_official = true;
  }
  return {
    provider: "mobilitydb-gtfsrt-discovery",
    label: options.label || "Mobility Database GTFS-RT",
    fallbackLine,
    defaultType,
    mobilityDatabase
  };
}

function createMobilityDatabaseSourceBundle(cityId, fallbackLine, defaultType = "train") {
  const citySource = createMobilityDatabaseSource(cityId, fallbackLine, defaultType);
  if (!citySource) return [];
  return [
    citySource,
    createMobilityDatabaseSource(cityId, fallbackLine, defaultType, {
      label: "Mobility Database GTFS-RT (regional official)",
      includeMunicipality: false
    }),
    createMobilityDatabaseSource(cityId, fallbackLine, defaultType, {
      label: "Mobility Database GTFS-RT (regional community)",
      includeMunicipality: false,
      officialFilter: "official-and-community"
    })
  ].filter(Boolean);
}

const CITIES = [
  {
    id: "washington-dc",
    provider: "multi",
    bbox: [39.18, -77.50, 38.65, -76.73],
    sources: [
      { provider: "gtfsrt-protobuf", endpoints: VRE_ENDPOINTS, fallbackLine: "VRE", label: "VRE GTFS-RT" },
      ...WMATA_TRAIN_POSITION_SOURCES,
      ...WMATA_RAIL_SOURCES,
      ...WMATA_BUS_SOURCES,
      { provider: "nextbus-json", endpoints: [NEXTBUS_ENDPOINTS.dcCirculator], fallbackLine: "DC Circulator", label: "NextBus DC Circulator", defaultType: "bus" },
      { provider: "nextbus-json", endpoints: [NEXTBUS_ENDPOINTS.fairfaxConnector], fallbackLine: "Fairfax Connector", label: "NextBus Fairfax Connector", defaultType: "bus" },
      ...createMobilityDatabaseSourceBundle("washington-dc", "Washington Transit"),
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
        headers: MTA_HEADERS
      },
      {
        provider: "gtfsrt-protobuf",
        endpoints: MTA_BUS_ENDPOINTS,
        fallbackLine: "MTA Bus",
        label: "MTA Bus GTFS-RT",
        defaultType: "bus",
        headers: MTA_HEADERS
      },
      {
        provider: "gtfsrt-protobuf",
        endpoints: MTA_LIRR_ENDPOINTS,
        fallbackLine: "LIRR",
        label: "MTA LIRR GTFS-RT",
        headers: MTA_HEADERS
      },
      {
        provider: "gtfsrt-protobuf",
        endpoints: MTA_MNR_ENDPOINTS,
        fallbackLine: "Metro-North",
        label: "MTA MNR GTFS-RT",
        headers: MTA_HEADERS
      },
      ...createMobilityDatabaseSourceBundle("new-york-city", "New York Transit"),
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
      ...createMobilityDatabaseSourceBundle("boston", "Boston Transit"),
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
      ...createMobilityDatabaseSourceBundle("philadelphia", "Philadelphia Transit"),
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
        label: "BART GTFS-RT",
        defaultType: "train"
      },
      { provider: "nextbus-json", endpoints: [NEXTBUS_ENDPOINTS.sfmuni], fallbackLine: "SF Muni", label: "NextBus SF Muni", defaultType: "tram" },
      { provider: "nextbus-json", endpoints: [NEXTBUS_ENDPOINTS.acTransit], fallbackLine: "AC Transit", label: "NextBus AC Transit", defaultType: "bus" },
      { provider: "nextbus-json", endpoints: [NEXTBUS_ENDPOINTS.vta], fallbackLine: "VTA", label: "NextBus VTA", defaultType: "tram" },
      { provider: "nextbus-json", endpoints: [NEXTBUS_ENDPOINTS.samTrans], fallbackLine: "SamTrans", label: "NextBus SamTrans", defaultType: "bus" },
      ...BAY_AREA_511_SOURCES,
      ...createMobilityDatabaseSourceBundle("bay-area", "Bay Area Transit"),
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
      ...createMobilityDatabaseSourceBundle("seattle", "Seattle Transit"),
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
      ...createMobilityDatabaseSourceBundle("atlanta", "Atlanta Transit"),
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
      ...createMobilityDatabaseSourceBundle("denver", "Denver Transit"),
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
      { provider: "nextbus-json", endpoints: [NEXTBUS_ENDPOINTS.cta], fallbackLine: "CTA", label: "NextBus CTA", defaultType: "bus" },
      { provider: "nextbus-json", endpoints: [NEXTBUS_ENDPOINTS.pace], fallbackLine: "Pace", label: "NextBus Pace", defaultType: "bus" },
      ...createMobilityDatabaseSourceBundle("chicago", "Chicago Transit"),
      { provider: "amtraker", endpoints: AMTRAKER_ENDPOINTS, label: "Amtrak" },
      { provider: "gtfsrt-protobuf", endpoints: TRANSITOUS_ENDPOINTS, fallbackLine: "Chicago Transit", label: "Transitous GTFS-RT" }
    ]
  },
  {
    id: "houston",
    provider: "multi",
    bbox: [30.20, -95.80, 29.40, -95.00],
    sources: [
      ...HOUSTON_METRO_SOURCES,
      ...createMobilityDatabaseSourceBundle("houston", "Houston Transit", "bus"),
      { provider: "amtraker", endpoints: AMTRAKER_ENDPOINTS, label: "Amtrak" },
      { provider: "gtfsrt-protobuf", endpoints: TRANSITOUS_ENDPOINTS, fallbackLine: "Houston Transit", label: "Transitous GTFS-RT", defaultType: "bus" }
    ]
  },
  {
    id: "milwaukee",
    provider: "multi",
    bbox: [43.25, -88.20, 42.85, -87.75],
    sources: [
      { provider: "gtfsrt-protobuf", endpoints: MCTS_ENDPOINTS, fallbackLine: "MCTS", label: "MCTS GTFS-RT", defaultType: "bus" },
      ...createMobilityDatabaseSourceBundle("milwaukee", "Milwaukee Transit", "bus"),
      { provider: "amtraker", endpoints: AMTRAKER_ENDPOINTS, label: "Amtrak" },
      { provider: "gtfsrt-protobuf", endpoints: TRANSITOUS_ENDPOINTS, fallbackLine: "Milwaukee Rail", label: "Transitous GTFS-RT" }
    ]
  },
  {
    id: "los-angeles",
    provider: "multi",
    bbox: [34.45, -118.90, 33.65, -117.60],
    sources: [
      ...LA_METRO_JSON_SOURCES,
      { provider: "nextbus-json", endpoints: [NEXTBUS_ENDPOINTS.laMetro], fallbackLine: "LA Metro", label: "NextBus LA Metro", defaultType: "bus" },
      { provider: "nextbus-json", endpoints: [NEXTBUS_ENDPOINTS.bigBlueBus], fallbackLine: "Big Blue Bus", label: "NextBus Big Blue Bus", defaultType: "bus" },
      { provider: "nextbus-json", endpoints: [NEXTBUS_ENDPOINTS.culverCityBus], fallbackLine: "Culver CityBus", label: "NextBus Culver CityBus", defaultType: "bus" },
      { provider: "gtfsrt-protobuf", endpoints: LA_METRO_GTFS_ENDPOINTS, fallbackLine: "LA Metro", label: "LA Metro GTFS-RT", defaultType: "tram" },
      ...createMobilityDatabaseSourceBundle("los-angeles", "Los Angeles Transit"),
      { provider: "amtraker", endpoints: AMTRAKER_ENDPOINTS, label: "Amtrak" },
      { provider: "gtfsrt-protobuf", endpoints: TRANSITOUS_ENDPOINTS, fallbackLine: "Los Angeles Transit", label: "Transitous GTFS-RT" }
    ]
  },
  {
    id: "detroit",
    provider: "multi",
    bbox: [42.55, -83.40, 42.20, -82.90],
    sources: [
      { provider: "gtfsrt-protobuf", endpoints: DETROIT_DDOT_ENDPOINTS, fallbackLine: "DDOT", label: "DDOT GTFS-RT", defaultType: "bus" },
      { provider: "gtfsrt-protobuf", endpoints: DETROIT_DDOT_ALT_ENDPOINTS, fallbackLine: "DDOT", label: "DDOT GTFS-RT (official)", defaultType: "bus" },
      ...createMobilityDatabaseSourceBundle("detroit", "Detroit Transit", "bus"),
      { provider: "amtraker", endpoints: AMTRAKER_ENDPOINTS, label: "Amtrak" },
      { provider: "gtfsrt-protobuf", endpoints: TRANSITOUS_ENDPOINTS, fallbackLine: "Detroit Transit", label: "Transitous GTFS-RT", defaultType: "bus" }
    ]
  },
  {
    id: "salt-lake-city",
    provider: "multi",
    bbox: [40.92, -112.20, 40.45, -111.70],
    sources: [
      { provider: "gtfsrt-protobuf", endpoints: UTA_ENDPOINTS, fallbackLine: "UTA", label: "UTA GTFS-RT", defaultType: "tram" },
      { provider: "gtfsrt-protobuf", endpoints: UTA_ALT_ENDPOINTS, fallbackLine: "UTA", label: "UTA GTFS-RT (data.rideuta.com)", defaultType: "tram" },
      ...createMobilityDatabaseSourceBundle("salt-lake-city", "Salt Lake Transit"),
      { provider: "amtraker", endpoints: AMTRAKER_ENDPOINTS, label: "Amtrak" },
      { provider: "gtfsrt-protobuf", endpoints: TRANSITOUS_ENDPOINTS, fallbackLine: "Salt Lake Transit", label: "Transitous GTFS-RT", defaultType: "bus" }
    ]
  },
  {
    id: "toronto",
    provider: "multi",
    bbox: [43.90, -79.70, 43.50, -79.05],
    sources: [
      { provider: "gtfsrt-protobuf", endpoints: TTC_ENDPOINTS, fallbackLine: "TTC", label: "TTC GTFS-RT", defaultType: "bus" },
      ...createMobilityDatabaseSourceBundle("toronto", "Toronto Transit"),
      { provider: "amtraker", endpoints: AMTRAKER_ENDPOINTS, label: "Amtrak" },
      { provider: "gtfsrt-protobuf", endpoints: TRANSITOUS_ENDPOINTS, fallbackLine: "Toronto Transit", label: "Transitous GTFS-RT", defaultType: "bus" }
    ]
  },
  {
    id: "montreal",
    provider: "multi",
    bbox: [45.75, -74.30, 45.35, -73.40],
    sources: [
      ...STM_SOURCES,
      ...createMobilityDatabaseSourceBundle("montreal", "Montreal Transit"),
      { provider: "gtfsrt-protobuf", endpoints: TRANSITOUS_ENDPOINTS, fallbackLine: "Montreal Transit", label: "Transitous GTFS-RT", defaultType: "bus" }
    ]
  },
  {
    id: "vancouver",
    provider: "multi",
    bbox: [49.45, -123.30, 49.00, -122.60],
    sources: [
      ...TRANSLINK_SOURCES,
      ...createMobilityDatabaseSourceBundle("vancouver", "Vancouver Transit"),
      { provider: "gtfsrt-protobuf", endpoints: TRANSITOUS_ENDPOINTS, fallbackLine: "Vancouver Transit", label: "Transitous GTFS-RT", defaultType: "bus" }
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
const MPH_PER_KMH = 0.621371;
const COORDINATE_PRECISION = 6;

const cityCache = globalThis.__mtroCityCache || new Map();
const inflightByCity = globalThis.__mtroInflightByCity || new Map();
const mobilityDatabaseTokenState = globalThis.__mtroMobilityDatabaseTokenState || { token: null, expiresAt: 0 };

globalThis.__mtroCityCache = cityCache;
globalThis.__mtroInflightByCity = inflightByCity;
globalThis.__mtroMobilityDatabaseTokenState = mobilityDatabaseTokenState;

function inBbox(lat, lon, bbox) {
  return lat <= bbox[0] && lon >= bbox[1] && lat >= bbox[2] && lon <= bbox[3];
}

function toHeadingCardinal(degrees) {
  if (!Number.isFinite(degrees)) return null;
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const normalized = ((degrees % 360) + 360) % 360;
  return dirs[Math.round(normalized / 22.5) % dirs.length];
}

const VEHICLE_TYPE_ALIASES = {
  rail: "train",
  streetcar: "tram",
  light_rail: "tram",
  "light-rail": "tram"
};
const TRAM_KEYWORDS = /(streetcar|tram|trolley|light rail|lightrail|lrt|muni)/;
const BUS_KEYWORDS = /(bus|coach|circulator|metrobus|rapidbus|brt|mcts|cta|ac transit)/;
const TRAIN_KEYWORDS = /(train|rail|subway|bart|metra|amtrak|lirr|mnr|vre|marta|septa|wmata|sound transit|rtd|metro rail|mta nyct)/;

function normalizeVehicleType(type) {
  if (!type) return null;
  const normalized = String(type).trim().toLowerCase();
  if (VEHICLE_TYPE_ALIASES[normalized]) return VEHICLE_TYPE_ALIASES[normalized];
  if (["train", "bus", "tram", "other", "station"].includes(normalized)) return normalized;
  return null;
}

function inferVehicleType(defaultType, ...values) {
  const explicit = normalizeVehicleType(defaultType);
  if (explicit) return explicit;
  const text = values
    .filter(Boolean)
    .map((value) => String(value).toLowerCase())
    .join(" ");
  if (!text) return "other";
  if (TRAM_KEYWORDS.test(text)) return "tram";
  if (BUS_KEYWORDS.test(text)) return "bus";
  if (TRAIN_KEYWORDS.test(text)) return "train";
  return "other";
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

function parseMbta(data, city, source = {}) {
  const rows = Array.isArray(data?.data) ? data.data : [];
  return rows
    .map((row) => {
      const attrs = row?.attributes || {};
      const lat = Number(attrs.latitude);
      const lon = Number(attrs.longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lon) || !inBbox(lat, lon, city.bbox)) return null;
      const routeId = row?.relationships?.route?.data?.id;
      const type = inferVehicleType(
        source.defaultType,
        attrs.vehicle_type,
        attrs.route_type,
        routeId,
        attrs.label,
        attrs.current_status
      );
      return {
        id: String(row?.id || `${lat},${lon}`),
        line: String(routeId || attrs.label || "MBTA"),
        label: String(attrs.label || attrs.vehicle_label || row?.id || "Vehicle"),
        status: String(attrs.current_status || "Active"),
        heading: toHeadingCardinal(Number(attrs.bearing)),
        speed: Number.isFinite(Number(attrs.speed)) ? Math.round(Number(attrs.speed) * MS_TO_MPH_FACTOR) : null,
        speedUnit: "mph",
        state: String(attrs.occupancy_status || "In service"),
        type,
        lat,
        lon
      };
    })
    .filter(Boolean);
}

function parseWmataJson(data, city, source = {}) {
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
        type: inferVehicleType(source.defaultType, lineCode, destination),
        lat,
        lon
      };
    })
    .filter(Boolean);
}

function extractCoordinates(value = {}) {
  const lat = Number(
    value.lat
    ?? value.latitude
    ?? value.Latitude
    ?? value.LATITUDE
    ?? value.PositionLat
    ?? value.position?.latitude
    ?? value.position?.lat
  );
  const lon = Number(
    value.lon
    ?? value.lng
    ?? value.longitude
    ?? value.Longitude
    ?? value.LONGITUDE
    ?? value.PositionLon
    ?? value.position?.longitude
    ?? value.position?.lon
  );
  return { lat, lon };
}

function extractRouteId(row, defaultLine) {
  return row.routeTag
    || row.route
    || row.Route
    || row.route_id
    || row.routeId
    || row.line
    || row.Line
    || row.TrainTypeName
    || row.trip?.routeId
    || defaultLine;
}

/**
 * Return the first array found on a known list of property keys, or the value
 * itself when the root payload is already an array.
 * @param {any} value Response payload to inspect.
 * @param {string[]} keys Candidate property names that may contain entity arrays.
 * @returns {any[]} The first matching array, or an empty array when none exist.
 */
function extractArrayByKeys(value, keys = []) {
  for (const key of keys) {
    const candidate = value?.[key];
    if (Array.isArray(candidate)) return candidate;
  }
  return Array.isArray(value) ? value : [];
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

    const { lat, lon } = extractCoordinates(current);
    if (Number.isFinite(lat) && Number.isFinite(lon)) {
      rows.push({
        ...current,
        lat,
        lon
      });
    }

    for (const nested of Object.values(current)) {
      if (nested && typeof nested === "object") queue.push(nested);
    }
  }

  return rows;
}

function parseGenericGeoJson(data, city, defaultLine, source = {}) {
  return extractGeoRows(data)
    .map((row, index) => {
      const { lat, lon } = extractCoordinates(row);
      if (!Number.isFinite(lat) || !Number.isFinite(lon) || !inBbox(lat, lon, city.bbox)) return null;
      const speedMs = Number(row.speed ?? row.Speed ?? row.Velocity ?? row.position?.speed);
      const mph = Number.isFinite(speedMs) ? Math.round(speedMs * MS_TO_MPH_FACTOR) : null;
      const line = extractRouteId(row, defaultLine);
      const label = row.id || row.vehicle?.id || row.vehicle?.label || row.VehicleID || row.vehicleNo || row.TrainNo || row.trainNumber || `${index + 1}`;
      const state = String(row.current_status || row.VehicleStatus || row.state || row.State || "In service");
      const type = inferVehicleType(
        source.defaultType,
        row.vehicleType,
        row.routeType,
        line,
        row.dirTag,
        state
      );
      return {
        id: String(row.id || row.VehicleID || row.vehicleNo || row.trainNo || `${lat},${lon},${index}`),
        line: String(line || defaultLine),
        label: String(label),
        status: mph != null ? `${mph} mph` : String(row.status || row.Status || "Active"),
        heading: toHeadingCardinal(Number(row.heading ?? row.bearing ?? row.Bearing ?? row.DirectionDeg ?? row.position?.bearing)),
        speed: mph,
        speedUnit: "mph",
        state,
        type,
        lat,
        lon
      };
    })
    .filter(Boolean);
}

/**
 * Parse NextBus vehicleLocations JSON into normalized train rows.
 * @param {any} data NextBus payload with a top-level `vehicle` array.
 * @param {{bbox:number[]}} city City config with bounding box filter.
 * @param {string} defaultLine Fallback route label for missing routeTag values.
 * @returns {Array<object>} Normalized train-style rows.
 */
function parseNextBus(data, city, defaultLine, source = {}) {
  const rows = Array.isArray(data?.vehicle) ? data.vehicle : [];
  return rows
    .map((row, index) => {
      const lat = Number(row?.lat);
      const lon = Number(row?.lon);
      if (!Number.isFinite(lat) || !Number.isFinite(lon) || !inBbox(lat, lon, city.bbox)) return null;
      const speedKmHr = Number(row?.speedKmHr);
      const speedMph = Number.isFinite(speedKmHr) ? Math.round(speedKmHr * MPH_PER_KMH) : null;
      const secsSinceReport = Number(row?.secsSinceReport);
      const status = Number.isFinite(speedMph)
        ? `${speedMph} mph`
        : Number.isFinite(secsSinceReport)
          ? `Reported ${secsSinceReport} sec ago`
          : "Active";

      const line = String(row?.routeTag || defaultLine);
      const state = String(row?.dirTag || "In service");
      return {
        id: String(row?.id || `nextbus-${lat.toFixed(COORDINATE_PRECISION)}-${lon.toFixed(COORDINATE_PRECISION)}-${index}`),
        line,
        label: String(row?.id || row?.vehicleLabel || `${index + 1}`),
        status,
        heading: toHeadingCardinal(Number(row?.heading)),
        speed: speedMph,
        speedUnit: "mph",
        state,
        type: inferVehicleType(source.defaultType, line, state),
        lat,
        lon
      };
    })
    .filter(Boolean);
}

function parseGtfsRealtime(buffer, city, fallbackLine, source = {}) {
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

      const line = String(routeId || fallbackLine);
      const state = String(vehicle?.currentStatus || "In service");
      return {
        id: String(entity?.id || vehicleId || tripId || `${lat},${lon},${index}`),
        line,
        label: String(vehicle?.vehicle?.label || vehicleId || tripId || "Vehicle"),
        status: ts ? `Updated ${new Date(ts * 1000).toISOString().slice(11, 16)} UTC` : "Active",
        heading: toHeadingCardinal(Number(position.bearing)),
        speed: speedKmh,
        speedUnit: "km/h",
        state,
        type: inferVehicleType(source.defaultType, line, tripId, state),
        lat,
        lon
      };
    })
    .filter(Boolean);
}

function parseGtfsRealtimeJson(data, city, fallbackLine, source = {}) {
  const entities = extractArrayByKeys(data, ["entity", "data", "vehicle_positions", "vehiclePositions", "vehicles"]);
  if (!entities.length) {
    return parseGenericGeoJson(data, city, fallbackLine, source);
  }

  return entities
    .map((entity, index) => {
      const vehicle = entity?.vehicle || entity;
      const position = vehicle?.position || entity?.position || {};
      const { lat, lon } = extractCoordinates({
        ...entity,
        ...vehicle,
        position
      });
      if (!Number.isFinite(lat) || !Number.isFinite(lon) || !inBbox(lat, lon, city.bbox)) return null;

      const routeId = vehicle?.trip?.routeId ?? entity?.route_id ?? entity?.routeId ?? vehicle?.routeId;
      const tripId = vehicle?.trip?.tripId ?? entity?.trip_id ?? entity?.tripId;
      const vehicleMeta = vehicle?.vehicle && typeof vehicle.vehicle === "object" ? vehicle.vehicle : {};
      const vehicleId = vehicleMeta.id ?? vehicle?.id ?? entity?.id;
      const label = vehicleMeta.label ?? vehicle?.label ?? vehicleId ?? tripId ?? "Vehicle";
      const currentStatus = vehicle?.currentStatus ?? entity?.current_status ?? entity?.currentStatus;
      const occupancyStatus = vehicle?.occupancyStatus ?? entity?.occupancy_status ?? entity?.occupancyStatus;
      const speedMs = Number(position.speed ?? vehicle?.speed ?? entity?.speed);
      const speedKmh = Number.isFinite(speedMs) ? Math.round(speedMs * MS_TO_KMH_FACTOR) : null;
      const ts = Number(vehicle?.timestamp?.low ?? vehicle?.timestamp ?? entity?.timestamp?.low ?? entity?.timestamp);

      return {
        id: String(vehicleId || tripId || `${lat},${lon},${index}`),
        line: String(routeId || fallbackLine),
        label: String(label),
        status: ts ? `Updated ${new Date(ts * 1000).toISOString().slice(11, 16)} UTC` : String(currentStatus || "Active"),
        heading: toHeadingCardinal(Number(position.bearing ?? vehicle?.bearing ?? entity?.bearing)),
        speed: speedKmh,
        speedUnit: "km/h",
        state: String(occupancyStatus || currentStatus || "In service"),
        type: inferVehicleType(source.defaultType, routeId, tripId, currentStatus, occupancyStatus),
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

async function getMobilityDatabaseAccessToken() {
  if (MOBILITY_DATABASE_ACCESS_TOKEN) return MOBILITY_DATABASE_ACCESS_TOKEN;
  const now = Date.now();
  if (mobilityDatabaseTokenState.token && mobilityDatabaseTokenState.expiresAt > now + MOBILITY_DATABASE_TOKEN_REUSE_BUFFER_MS) {
    return mobilityDatabaseTokenState.token;
  }
  if (!MOBILITY_DATABASE_REFRESH_TOKEN) return null;

  const response = await fetchWithTimeout(`${MOBILITY_DATABASE_API_BASE}/v1/tokens`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ refresh_token: MOBILITY_DATABASE_REFRESH_TOKEN })
  });
  const payload = await response.json();
  const token = String(payload?.access_token || payload?.accessToken || payload?.token || "").trim();
  if (!token) {
    const payloadKeys = payload && typeof payload === "object" ? Object.keys(payload).join(", ") : "none";
    throw new Error(`Mobility Database token exchange completed but returned no valid access token (response fields: ${payloadKeys || "none"})`);
  }
  const expiresInSeconds = Number(payload?.expires_in ?? payload?.expiresIn);
  const tokenLifetimeSeconds = expiresInSeconds > 0 ? expiresInSeconds : DEFAULT_MOBILITY_DATABASE_TOKEN_EXPIRY_SECONDS;
  mobilityDatabaseTokenState.token = token;
  mobilityDatabaseTokenState.expiresAt = now + tokenLifetimeSeconds * 1000;
  return token;
}

function extractMobilityDatabaseFeedUrl(feed) {
  // The catalog can expose producer URLs via multiple field names across versions/export formats.
  const candidates = [
    feed?.source_info?.producer_url,
    feed?.sourceInfo?.producerUrl,
    feed?.producer_url,
    feed?.producerUrl,
    feed?.url,
    feed?.urls?.producer,
    feed?.urls?.realtime
  ];
  return candidates.find((value) => typeof value === "string" && /^https?:\/\//i.test(value)) || null;
}

async function discoverMobilityDatabaseEndpoints(source = {}) {
  const token = await getMobilityDatabaseAccessToken();
  if (!token) {
    throw new Error("Mobility Database source is not configured: set MOBILITY_DATABASE_ACCESS_TOKEN or MOBILITY_DATABASE_REFRESH_TOKEN");
  }
  const filters = source.mobilityDatabase || {};
  const query = new URLSearchParams();
  query.set("entity_types", String(filters.entity_types || "vp"));
  query.set("limit", String(MOBILITY_DATABASE_MAX_ENDPOINTS));
  if (filters.country_code) query.set("country_code", String(filters.country_code));
  if (filters.subdivision_name) query.set("subdivision_name", String(filters.subdivision_name));
  if (filters.municipality) query.set("municipality", String(filters.municipality));
  if (typeof filters.is_official === "boolean") query.set("is_official", String(filters.is_official));
  const url = `${MOBILITY_DATABASE_API_BASE}/v1/gtfs_rt_feeds?${query.toString()}`;
  const response = await fetchWithTimeout(url, { headers: { authorization: `Bearer ${token}` } });
  const payload = await response.json();
  let feeds = [];
  if (Array.isArray(payload)) {
    feeds = payload;
  } else if (Array.isArray(payload?.results)) {
    feeds = payload.results;
  } else if (Array.isArray(payload?.feeds)) {
    feeds = payload.feeds;
  }
  const uniqueUrls = new Set();
  for (const feed of feeds) {
    const urlValue = extractMobilityDatabaseFeedUrl(feed);
    if (!urlValue) continue;
    uniqueUrls.add(urlValue);
    if (uniqueUrls.size >= MOBILITY_DATABASE_MAX_ENDPOINTS) break;
  }
  return [...uniqueUrls];
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
    return parseMbta(data, city, source);
  }

  if (source.provider === "septa-json") {
    const data = await fetchFirst(endpoints, async (url) => (await fetchWithTimeout(url, requestInit)).json());
    return parseGenericGeoJson(data, city, "SEPTA", source);
  }

  if (source.provider === "nextbus-json") {
    const data = await fetchFirst(endpoints, async (url) => (await fetchWithTimeout(url, requestInit)).json());
    return parseNextBus(data, city, source.fallbackLine || city.id, source);
  }

  if (source.provider === "wmata-json") {
    const data = await fetchFirst(endpoints, async (url) => (await fetchWithTimeout(url, requestInit)).json());
    return parseWmataJson(data, city, source);
  }

  if (source.provider === "gtfsrt-json") {
    const data = await fetchFirst(endpoints, async (url) => (await fetchWithTimeout(url, requestInit)).json());
    return parseGtfsRealtimeJson(data, city, source.fallbackLine || city.id, source);
  }

  if (source.provider === "mobilitydb-gtfsrt-discovery") {
    const discoveredEndpoints = await discoverMobilityDatabaseEndpoints(source);
    if (!discoveredEndpoints.length) return [];
    const settled = await Promise.allSettled(
      discoveredEndpoints.map(async (url) => {
        const buffer = await (await fetchWithTimeout(url, requestInit)).arrayBuffer();
        return parseGtfsRealtime(buffer, city, source.fallbackLine || city.id, source);
      })
    );
    const rows = settled
      .filter((entry) => entry.status === "fulfilled")
      .flatMap((entry) => entry.value);
    // Keep partial successes so one broken discovered feed does not block all discovered feeds.
    if (rows.length || settled.every((entry) => entry.status === "fulfilled")) return rows;
    const firstError = settled.find((entry) => entry.status === "rejected");
    throw firstError?.reason || new Error("Failed to fetch Mobility Database GTFS-RT feeds");
  }

  if (source.provider === "gtfsrt-protobuf") {
    const buffer = await fetchFirst(endpoints, async (url) => (await fetchWithTimeout(url, requestInit)).arrayBuffer());
    return parseGtfsRealtime(buffer, city, source.fallbackLine || city.id, source);
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
      message: `Loaded ${trains.length} vehicle positions from ${sourceLabel}.${warning}`
    };
  }

  if (failedCount === sources.length) {
    return {
      trains: [],
      message: "All configured vehicle feeds are temporarily unavailable for this area."
    };
  }

  if (failedCount > 0) {
    return {
      trains: [],
      message: "Some vehicle feeds are temporarily unavailable for this area."
    };
  }

  return {
    trains: [],
    message: "No vehicle positions found for this area."
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
