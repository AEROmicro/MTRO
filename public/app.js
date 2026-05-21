const CITIES = [
  { id: "washington-dc", name: "Washington, DC", center: [38.9072, -77.0369], zoom: 10, bbox: [39.18, -77.5, 38.65, -76.73], provider: "amtraker" },
  { id: "new-york-city", name: "New York City", center: [40.7128, -74.006], zoom: 10, bbox: [41.05, -74.35, 40.45, -73.6], provider: "amtraker" },
  { id: "boston", name: "Boston", center: [42.3601, -71.0589], zoom: 10, bbox: [42.58, -71.35, 42.17, -70.85], provider: "amtraker" },
  { id: "chicago", name: "Chicago", center: [41.8781, -87.6298], zoom: 10, bbox: [42.1, -87.95, 41.62, -87.45], provider: "amtraker" },
  { id: "tokyo", name: "Tokyo", center: [35.6762, 139.6503], zoom: 10, bbox: [35.9, 139.4, 35.5, 139.95], provider: "none" },
  { id: "paris", name: "Paris", center: [48.8566, 2.3522], zoom: 10, bbox: [49.02, 2.12, 48.75, 2.57], provider: "none" },
  { id: "zurich", name: "Zurich, Switzerland", center: [47.3769, 8.5417], zoom: 10, bbox: [47.5, 8.4, 47.3, 8.68], provider: "none" },
  { id: "london", name: "London", center: [51.5072, -0.1276], zoom: 10, bbox: [51.66, -0.4, 51.38, 0.1], provider: "none" },
  { id: "berlin", name: "Berlin", center: [52.52, 13.405], zoom: 10, bbox: [52.67, 13.1, 52.35, 13.7], provider: "none" },
  { id: "madrid", name: "Madrid", center: [40.4168, -3.7038], zoom: 10, bbox: [40.55, -3.9, 40.3, -3.55], provider: "none" },
  { id: "rome", name: "Rome", center: [41.9028, 12.4964], zoom: 10, bbox: [42.05, 12.3, 41.77, 12.65], provider: "none" },
  { id: "vienna", name: "Vienna", center: [48.2082, 16.3738], zoom: 10, bbox: [48.33, 16.18, 48.1, 16.56], provider: "none" },
  { id: "amsterdam", name: "Amsterdam", center: [52.3676, 4.9041], zoom: 10, bbox: [52.44, 4.73, 52.28, 5.05], provider: "none" },
  { id: "brussels", name: "Brussels", center: [50.8503, 4.3517], zoom: 10, bbox: [50.92, 4.2, 50.78, 4.5], provider: "none" },
  { id: "copenhagen", name: "Copenhagen", center: [55.6761, 12.5683], zoom: 10, bbox: [55.77, 12.45, 55.58, 12.74], provider: "none" },
  { id: "stockholm", name: "Stockholm", center: [59.3293, 18.0686], zoom: 10, bbox: [59.42, 17.9, 59.24, 18.22], provider: "none" },
  { id: "oslo", name: "Oslo", center: [59.9139, 10.7522], zoom: 10, bbox: [60, 10.6, 59.82, 10.95], provider: "none" },
  { id: "helsinki", name: "Helsinki", center: [60.1699, 24.9384], zoom: 10, bbox: [60.3, 24.8, 60.1, 25.13], provider: "none" },
  { id: "lisbon", name: "Lisbon", center: [38.7223, -9.1393], zoom: 10, bbox: [38.82, -9.3, 38.65, -9.02], provider: "none" },
  { id: "prague", name: "Prague", center: [50.0755, 14.4378], zoom: 10, bbox: [50.18, 14.25, 49.96, 14.63], provider: "none" },
  { id: "budapest", name: "Budapest", center: [47.4979, 19.0402], zoom: 10, bbox: [47.6, 18.9, 47.4, 19.2], provider: "none" },
  { id: "warsaw", name: "Warsaw", center: [52.2297, 21.0122], zoom: 10, bbox: [52.33, 20.85, 52.13, 21.2], provider: "none" },
  { id: "seoul", name: "Seoul", center: [37.5665, 126.978], zoom: 10, bbox: [37.7, 126.82, 37.46, 127.15], provider: "none" },
  { id: "singapore", name: "Singapore", center: [1.3521, 103.8198], zoom: 11, bbox: [1.47, 103.6, 1.23, 104.02], provider: "none" },
  { id: "sydney", name: "Sydney", center: [-33.8688, 151.2093], zoom: 10, bbox: [-33.74, 150.95, -34.05, 151.35], provider: "none" },
  { id: "toronto", name: "Toronto", center: [43.6532, -79.3832], zoom: 10, bbox: [43.85, -79.7, 43.55, -79.1], provider: "none" },
  { id: "vancouver", name: "Vancouver", center: [49.2827, -123.1207], zoom: 10, bbox: [49.37, -123.32, 49.18, -122.95], provider: "none" },
  { id: "mexico-city", name: "Mexico City", center: [19.4326, -99.1332], zoom: 10, bbox: [19.57, -99.3, 19.32, -98.95], provider: "none" },
  { id: "san-francisco", name: "San Francisco", center: [37.7749, -122.4194], zoom: 10, bbox: [37.93, -122.56, 37.7, -122.3], provider: "amtraker" },
  { id: "los-angeles", name: "Los Angeles", center: [34.0522, -118.2437], zoom: 10, bbox: [34.22, -118.6, 33.88, -117.95], provider: "amtraker" },
  { id: "philadelphia", name: "Philadelphia", center: [39.9526, -75.1652], zoom: 10, bbox: [40.08, -75.35, 39.83, -74.95], provider: "amtraker" }
];

const citySelect = document.getElementById("citySelect");
const snapshotSelect = document.getElementById("snapshotSelect");
const refreshBtn = document.getElementById("refreshBtn");
const statusEl = document.getElementById("status");
const trainList = document.getElementById("trainList");
const panelTitle = document.getElementById("panelTitle");

const map = L.map("map", { zoomControl: true }).setView([38.9072, -77.0369], 10);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap contributors"
}).addTo(map);

const markerLayer = L.layerGroup().addTo(map);
const historyByCity = new Map();
let currentCity = CITIES[0];
const API_PROXY_PATH = "/api/trains";
const AMTRAKER_ENDPOINTS = [
  "https://api-v3.amtraker.com/v3/trains",
  "https://api-v3.amtraker.com/v1/trains"
];
const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.openstreetmap.fr/api/interpreter"
];
const LIVE_REFRESH_INTERVAL_MS = 10000;
const LIVE_ANIMATION_DURATION_MS = 9000;
const liveMarkers = new Map();
let activeAnimationFrame = null;

for (const city of CITIES) {
  const option = document.createElement("option");
  option.value = city.id;
  option.textContent = city.name;
  citySelect.append(option);
}
citySelect.value = "washington-dc";

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function inBbox(lat, lon, bbox) {
  return lat <= bbox[0] && lon >= bbox[1] && lat >= bbox[2] && lon <= bbox[3];
}

function parseAmtraker(data, city) {
  const rows = Array.isArray(data) ? data : Object.values(data || {});
  return rows
    .map((row) => {
      const lat = Number(row.lat ?? row.latitude);
      const lon = Number(row.lon ?? row.lng ?? row.longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
        return null;
      }

      return {
        id: String(row.train_id ?? row.id ?? `${lat},${lon}`),
        line: row.route_name || row.route || row.train_num || "Train",
        label: row.train_name || row.name || "Live train",
        status: row.velocity ? `${Math.round(Number(row.velocity))} mph` : "Live",
        lat,
        lon
      };
    })
    .filter((train) => train && inBbox(train.lat, train.lon, city.bbox));
}

function parseOverpass(data, city) {
  const rows = Array.isArray(data?.elements) ? data.elements : [];
  const trains = [];

  for (const row of rows) {
    if (row.type !== "node") {
      continue;
    }

    const lat = Number(row.lat);
    const lon = Number(row.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || !inBbox(lat, lon, city.bbox)) {
      continue;
    }

    const tags = row.tags || {};
    const name = tags.name || tags.ref || "Rail stop";
    trains.push({
      id: String(row.id ?? `${lat},${lon}`),
      line: name,
      label: tags.operator || tags.network || "Railway station",
      status: tags.railway || "station",
      lat,
      lon
    });
  }

  return trains.slice(0, 250);
}

async function fetchJsonFromFirstHealthy(urls, init, timeoutMs = 12000) {
  let lastError = null;

  for (const url of urls) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { ...init, signal: controller.signal });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      lastError = error;
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError || new Error("No healthy API endpoint available");
}

function buildOverpassQuery(city) {
  const [north, west, south, east] = city.bbox;
  return `[out:json][timeout:20];node["railway"~"station|halt|tram_stop|subway_entrance"](${south},${west},${north},${east});out body 300;`;
}

async function fetchBrowserDirect(city) {
  if (city.provider === "amtraker") {
    try {
      const amtrakerData = await fetchJsonFromFirstHealthy(AMTRAKER_ENDPOINTS, { cache: "no-store" });
      const amtrakerTrains = parseAmtraker(amtrakerData, city);
      if (amtrakerTrains.length) {
        return {
          trains: amtrakerTrains,
          message: "Live train data loaded from Amtraker."
        };
      }
    } catch (error) {
      // Fall back to station-level data below.
    }
  }

  const overpassData = await fetchJsonFromFirstHealthy(
    OVERPASS_ENDPOINTS,
    {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body: buildOverpassQuery(city),
      cache: "no-store"
    }
  );
  const overpassTrains = parseOverpass(overpassData, city);
  return {
    trains: overpassTrains,
    message: overpassTrains.length
      ? "Showing railway stations for this city from OpenStreetMap/Overpass."
      : "No railway stations returned for this city yet."
  };
}

async function fetchFromProxy(city) {
  const response = await fetch(`${API_PROXY_PATH}?city=${encodeURIComponent(city.id)}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Proxy unavailable (${response.status})`);
  }
  const result = await response.json();
  return {
    trains: Array.isArray(result?.trains) ? result.trains : [],
    message: typeof result?.message === "string" ? result.message : "Data loaded."
  };
}

async function fetchCityTrains(city) {
  try {
    return await fetchFromProxy(city);
  } catch (proxyError) {
    return {
      ...(await fetchBrowserDirect(city)),
      message: "Loaded in self-host mode without proxy."
    };
  }
}

function normalizeTrains(trains) {
  return trains
    .map((train) => ({
      id: String(train.id ?? `${train.lat},${train.lon}`),
      line: String(train.line || "Train"),
      label: String(train.label || "Rail activity"),
      status: String(train.status || "Live"),
      lat: Number(train.lat),
      lon: Number(train.lon)
    }))
    .filter((train) => Number.isFinite(train.lat) && Number.isFinite(train.lon));
}

function renderStatus(message, payloadTimestamp) {
  statusEl.textContent = `${message} Last update: ${new Date(payloadTimestamp).toLocaleTimeString()}.`;
}

async function loadCity(cityId) {
  const city = CITIES.find((entry) => entry.id === cityId) || CITIES[0];
  currentCity = city;
  map.setView(city.center, city.zoom);
  panelTitle.textContent = `${city.name} Train Positions`;
  statusEl.textContent = "Loading data…";

  try {
    const result = await fetchCityTrains(city);
    const payload = { timestamp: new Date().toISOString(), trains: normalizeTrains(result.trains) };
    pushHistory(city.id, payload);
    refreshSnapshotSelector();
    renderTrains(payload.trains);
    renderStatus(result.message || "Data loaded.", payload.timestamp);
  } catch (error) {
    renderTrains([]);
    statusEl.textContent = `Unable to load train data: ${error.message}`;
    refreshSnapshotSelector();
  }
}

citySelect.addEventListener("change", () => {
  loadCity(citySelect.value);
});

snapshotSelect.addEventListener("change", () => {
  if (snapshotSelect.value === "live") {
    const latest = (historyByCity.get(currentCity.id) || [])[0];
    renderTrains(latest ? latest.trains : []);
    return;
  }

  const selected = (historyByCity.get(currentCity.id) || []).find(
    (item) => item.timestamp === snapshotSelect.value
  );
  if (selected) {
    renderTrains(selected.trains, selected.timestamp);
    statusEl.textContent = `Viewing saved snapshot from ${new Date(selected.timestamp).toLocaleString()}.`;
  }
});

refreshBtn.addEventListener("click", () => {
  loadCity(currentCity.id);
});

setInterval(() => {
  if (snapshotSelect.value === "live") {
    loadCity(currentCity.id);
  }
}, LIVE_REFRESH_INTERVAL_MS);

loadCity("washington-dc");
function renderTrains(trains, timestamp = null) {
  renderTrainList(trains, timestamp);
  if (timestamp) {
    renderSnapshotTrains(trains);
    return;
  }
  renderLiveTrains(trains);
}

function renderTrainList(trains, timestamp = null) {
  trainList.textContent = "";

  if (!trains.length) {
    const empty = document.createElement("li");
    empty.textContent = "No train positions available for this view.";
    trainList.append(empty);
    return;
  }

  for (const train of trains) {
    const item = document.createElement("li");
    const route = document.createElement("div");
    route.className = "train-route";
    route.textContent = train.line;

    const meta = document.createElement("div");
    meta.className = "train-meta";
    meta.textContent = `${train.label} • ${train.status}${timestamp ? ` • ${new Date(timestamp).toLocaleTimeString()}` : ""}`;

    item.append(route, meta);
    trainList.append(item);
  }
}

function popupHtml(train) {
  return `<strong>${escapeHtml(train.line)}</strong><br/>${escapeHtml(train.label)}<br/>${escapeHtml(train.status)}`;
}

function createTrainMarker(train) {
  const marker = L.circleMarker([train.lat, train.lon], {
    radius: 6,
    color: "#111",
    fillColor: "#111",
    fillOpacity: 0.9,
    weight: 1
  });
  marker.bindPopup(popupHtml(train));
  marker.addTo(markerLayer);
  return marker;
}

function clearLiveMarkers() {
  if (activeAnimationFrame) {
    cancelAnimationFrame(activeAnimationFrame);
    activeAnimationFrame = null;
  }
  markerLayer.clearLayers();
  liveMarkers.clear();
}

function renderSnapshotTrains(trains) {
  clearLiveMarkers();
  for (const train of trains) {
    createTrainMarker(train);
  }
}

function renderLiveTrains(trains) {
  if (activeAnimationFrame) {
    cancelAnimationFrame(activeAnimationFrame);
    activeAnimationFrame = null;
  }

  const incomingIds = new Set(trains.map((train) => train.id));
  for (const [id, entry] of liveMarkers) {
    if (!incomingIds.has(id)) {
      markerLayer.removeLayer(entry.marker);
      liveMarkers.delete(id);
    }
  }

  if (!trains.length) {
    clearLiveMarkers();
    return;
  }

  const transitions = [];
  for (const train of trains) {
    let entry = liveMarkers.get(train.id);
    if (!entry) {
      entry = {
        marker: createTrainMarker(train),
        lat: train.lat,
        lon: train.lon
      };
      liveMarkers.set(train.id, entry);
    } else {
      entry.marker.setPopupContent(popupHtml(train));
    }

    transitions.push({
      entry,
      fromLat: entry.lat,
      fromLon: entry.lon,
      toLat: train.lat,
      toLon: train.lon
    });
  }

  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / LIVE_ANIMATION_DURATION_MS, 1);
    for (const transition of transitions) {
      const lat = transition.fromLat + (transition.toLat - transition.fromLat) * progress;
      const lon = transition.fromLon + (transition.toLon - transition.fromLon) * progress;
      transition.entry.lat = lat;
      transition.entry.lon = lon;
      transition.entry.marker.setLatLng([lat, lon]);
    }

    if (progress < 1) {
      activeAnimationFrame = requestAnimationFrame(step);
    } else {
      activeAnimationFrame = null;
    }
  };

  activeAnimationFrame = requestAnimationFrame(step);
}

function pushHistory(cityId, payload) {
  const history = historyByCity.get(cityId) || [];
  history.unshift(payload);
  historyByCity.set(cityId, history.slice(0, 10));
}

function refreshSnapshotSelector() {
  const history = historyByCity.get(currentCity.id) || [];
  snapshotSelect.textContent = "";

  const live = document.createElement("option");
  live.value = "live";
  live.textContent = "Live";
  snapshotSelect.append(live);

  for (const entry of history) {
    const opt = document.createElement("option");
    opt.value = entry.timestamp;
    opt.textContent = new Date(entry.timestamp).toLocaleString();
    snapshotSelect.append(opt);
  }

  snapshotSelect.value = "live";
}
