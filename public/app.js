// Route color palette — bright on dark background (ADSB-style)
const PALETTE = ["#f87171","#60a5fa","#4ade80","#fbbf24","#c084fc","#34d399","#fb923c","#f472b6","#22d3ee","#a3e635"];

// Cardinal/intercardinal heading strings → clockwise degrees from north
const HEADING_DEG = {
  N:0,NNE:22.5,NE:45,ENE:67.5,E:90,ESE:112.5,SE:135,SSE:157.5,
  S:180,SSW:202.5,SW:225,WSW:247.5,W:270,WNW:292.5,NW:315,NNW:337.5
};

const CITIES = [
  // ── United States (Amtrak live positions) ─────────────────────────────────
  { id: "washington-dc",   name: "Washington, DC",    center: [38.9072, -77.0369],  zoom: 10, bbox: [39.18, -77.5,   38.65, -76.73],  provider: "amtraker" },
  { id: "new-york-city",   name: "New York City",     center: [40.7128, -74.006],   zoom: 10, bbox: [41.05, -74.35,  40.45, -73.6],   provider: "amtraker" },
  { id: "boston",          name: "Boston",            center: [42.3601, -71.0589],  zoom: 10, bbox: [42.58, -71.35,  42.17, -70.85],  provider: "amtraker" },
  { id: "philadelphia",    name: "Philadelphia",      center: [39.9526, -75.1652],  zoom: 10, bbox: [40.08, -75.35,  39.83, -74.95],  provider: "amtraker" },
  { id: "baltimore",       name: "Baltimore",         center: [39.2904, -76.6122],  zoom: 10, bbox: [39.38, -76.75,  39.20, -76.50],  provider: "amtraker" },
  { id: "richmond-va",     name: "Richmond, VA",      center: [37.5407, -77.4360],  zoom: 10, bbox: [37.65, -77.60,  37.43, -77.30],  provider: "amtraker" },
  { id: "charlotte",       name: "Charlotte, NC",     center: [35.2271, -80.8431],  zoom: 10, bbox: [35.37, -80.98,  35.12, -80.68],  provider: "amtraker" },
  { id: "atlanta",         name: "Atlanta",           center: [33.7490, -84.3880],  zoom: 10, bbox: [33.92, -84.65,  33.62, -84.18],  provider: "amtraker" },
  { id: "miami",           name: "Miami",             center: [25.7617, -80.1918],  zoom: 10, bbox: [25.92, -80.42,  25.59, -80.00],  provider: "amtraker" },
  { id: "orlando",         name: "Orlando",           center: [28.5383, -81.3792],  zoom: 10, bbox: [28.68, -81.55,  28.40, -81.22],  provider: "amtraker" },
  { id: "new-orleans",     name: "New Orleans",       center: [29.9511, -90.0715],  zoom: 10, bbox: [30.10, -90.30,  29.85, -89.87],  provider: "amtraker" },
  { id: "chicago",         name: "Chicago",           center: [41.8781, -87.6298],  zoom: 10, bbox: [42.10, -87.95,  41.62, -87.45],  provider: "amtraker" },
  { id: "milwaukee",       name: "Milwaukee",         center: [43.0389, -87.9065],  zoom: 10, bbox: [43.22, -88.10,  42.95, -87.77],  provider: "amtraker" },
  { id: "minneapolis",     name: "Minneapolis",       center: [44.9778, -93.2650],  zoom: 10, bbox: [45.08, -93.45,  44.86, -93.12],  provider: "amtraker" },
  { id: "st-louis",        name: "St. Louis",         center: [38.6270, -90.1994],  zoom: 10, bbox: [38.78, -90.42,  38.50, -89.97],  provider: "amtraker" },
  { id: "kansas-city",     name: "Kansas City",       center: [39.0997, -94.5786],  zoom: 10, bbox: [39.25, -94.78,  38.96, -94.38],  provider: "amtraker" },
  { id: "detroit",         name: "Detroit",           center: [42.3314, -83.0458],  zoom: 10, bbox: [42.45, -83.28,  42.20, -82.88],  provider: "amtraker" },
  { id: "pittsburgh",      name: "Pittsburgh",        center: [40.4406, -79.9959],  zoom: 10, bbox: [40.58, -80.18,  40.32, -79.82],  provider: "amtraker" },
  { id: "cleveland",       name: "Cleveland",         center: [41.4993, -81.6944],  zoom: 10, bbox: [41.62, -81.88,  41.38, -81.52],  provider: "amtraker" },
  { id: "dallas",          name: "Dallas / Fort Worth",center: [32.7767, -96.7970], zoom: 10, bbox: [33.00, -97.05,  32.62, -96.58],  provider: "amtraker" },
  { id: "houston",         name: "Houston",           center: [29.7604, -95.3698],  zoom: 10, bbox: [29.92, -95.58,  29.60, -95.18],  provider: "amtraker" },
  { id: "san-antonio",     name: "San Antonio",       center: [29.4241, -98.4936],  zoom: 10, bbox: [29.58, -98.68,  29.28, -98.32],  provider: "amtraker" },
  { id: "denver",          name: "Denver",            center: [39.7392, -104.9903], zoom: 10, bbox: [39.88, -105.12, 39.59, -104.85], provider: "amtraker" },
  { id: "salt-lake-city",  name: "Salt Lake City",    center: [40.7608, -111.8910], zoom: 10, bbox: [40.88, -112.03, 40.66, -111.76], provider: "amtraker" },
  { id: "albuquerque",     name: "Albuquerque",       center: [35.0853, -106.6056], zoom: 10, bbox: [35.22, -106.77, 34.98, -106.45], provider: "amtraker" },
  { id: "seattle",         name: "Seattle",           center: [47.6062, -122.3321], zoom: 10, bbox: [47.78, -122.55, 47.48, -122.20], provider: "amtraker" },
  { id: "portland-or",     name: "Portland, OR",      center: [45.5051, -122.6750], zoom: 10, bbox: [45.65, -122.88, 45.43, -122.50], provider: "amtraker" },
  { id: "sacramento",      name: "Sacramento",        center: [38.5816, -121.4944], zoom: 10, bbox: [38.72, -121.65, 38.47, -121.37], provider: "amtraker" },
  { id: "san-francisco",   name: "San Francisco",     center: [37.7749, -122.4194], zoom: 10, bbox: [37.93, -122.56, 37.70, -122.30], provider: "bart" },
  { id: "oakland",         name: "Oakland",           center: [37.8044, -122.2712], zoom: 10, bbox: [37.90, -122.38, 37.65, -122.10], provider: "bart" },
  { id: "los-angeles",     name: "Los Angeles",       center: [34.0522, -118.2437], zoom: 10, bbox: [34.22, -118.60, 33.88, -117.95], provider: "amtraker" },
  // ── Country-level train departures (transport.rest) ───────────────────────
  { id: "finland",         name: "Finland",           center: [61.9241, 25.7482],   zoom: 6,  bbox: [70.20, 19.00, 59.70, 31.90],      provider: "transport-rest" },
  { id: "switzerland",     name: "Switzerland",       center: [46.8182,  8.2275],   zoom: 7,  bbox: [47.85, 5.95, 45.75, 10.55],       provider: "transport-rest" },
  { id: "luxembourg",      name: "Luxembourg",        center: [49.8153,  6.1296],   zoom: 9,  bbox: [50.20, 5.73, 49.42, 6.53],        provider: "transport-rest" },
  { id: "germany",         name: "Germany",           center: [51.1657, 10.4515],   zoom: 6,  bbox: [55.10, 5.86, 47.20, 15.05],       provider: "transport-rest" },
  { id: "austria",         name: "Austria",           center: [47.5162, 14.5501],   zoom: 7,  bbox: [49.05, 9.50, 46.35, 17.20],       provider: "transport-rest" },
  { id: "netherlands",     name: "Netherlands",       center: [52.1326,  5.2913],   zoom: 7,  bbox: [53.70, 3.20, 50.70, 7.30],        provider: "transport-rest" }
];

const citySelect = document.getElementById("citySelect");
const snapshotSelect = document.getElementById("snapshotSelect");
const refreshBtn = document.getElementById("refreshBtn");
const statusEl = document.getElementById("status");
const trainList = document.getElementById("trainList");
const panelTitle = document.getElementById("panelTitle");

const map = L.map("map", { zoomControl: true }).setView([38.9072, -77.0369], 10);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const markerLayer = L.layerGroup().addTo(map);
const historyByCity = new Map();
let currentCity = CITIES[0];
const API_PROXY_PATH = "/api/trains";
const AMTRAKER_ENDPOINTS = [
  "https://api-v3.amtraker.com/v3/trains",
  "https://api-v3.amtraker.com/v1/trains"
];
const LIVE_REFRESH_INTERVAL_MS = 30000;
const LIVE_ANIMATION_DURATION_MS = 7000;
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

function getRouteColor(line) {
  let h = 0;
  for (let i = 0; i < line.length; i++) h = (Math.imul(31, h) + line.charCodeAt(i)) | 0;
  return PALETTE[Math.abs(h) % PALETTE.length];
}

function headingToDeg(h) { return HEADING_DEG[h] ?? null; }

function parseAmtraker(data, city) {
  // Amtraker v3 returns { "trainNum": [trainObj, ...], ... } — must flatten.
  // v1 may return a flat array. Handle both.
  const rows = Array.isArray(data) ? data : Object.values(data || {}).flat();
  return rows
    .map((row) => {
      if (!row || typeof row !== "object") return null;
      const lat = Number(row.lat ?? row.latitude);
      const lon = Number(row.lon ?? row.lng ?? row.longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

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
    .filter((train) => train && inBbox(train.lat, train.lon, city.bbox));
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

async function fetchBrowserDirect(city) {
  if (city.provider === "amtraker") {
    const amtrakerData = await fetchJsonFromFirstHealthy(AMTRAKER_ENDPOINTS, { cache: "no-store" });
    const amtrakerTrains = parseAmtraker(amtrakerData, city);
    return {
      trains: amtrakerTrains,
      message: amtrakerTrains.length
        ? `${amtrakerTrains.length} active Amtrak train${amtrakerTrains.length !== 1 ? "s" : ""} in this area.`
        : "No live Amtrak trains found in this area right now."
    };
  }

  throw new Error("Proxy is required for this city's live train provider.");
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
      status: String(train.status || "Active"),
      heading: train.heading || null,
      speed: train.speed != null ? Number(train.speed) : null,
      state: String(train.state || "Active"),
      type: String(train.type || "train"),
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
  panelTitle.textContent = `${city.name} Trains`;
  statusEl.textContent = "Loading…";

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

  const activeTrains = trains.filter((t) => t.type === "train");

  if (!trains.length) {
    const empty = document.createElement("li");
    empty.className = "train-item train-item--empty";
    empty.textContent = "No data available for this view.";
    trainList.append(empty);
    return;
  }

  // Update panel title with live count
  if (activeTrains.length) {
    panelTitle.textContent = `${currentCity.name} Trains (${activeTrains.length} active)`;
  }

  for (const train of trains) {
    const item = document.createElement("li");
    item.className = `train-item${train.type === "station" ? " train-item--station" : ""}`;
    item.dataset.id = train.id;

    if (train.type !== "station") {
      const dot = document.createElement("span");
      dot.className = "train-color-dot";
      dot.style.background = getRouteColor(train.line);
      item.append(dot);
    }

    const route = document.createElement("div");
    route.className = "train-route";
    route.textContent = train.line;

    const meta = document.createElement("div");
    meta.className = "train-meta";
    const labelPart = train.type === "station" ? "Station" : `#${train.label}`;
    const timePart = timestamp ? ` · ${new Date(timestamp).toLocaleTimeString()}` : "";
    meta.textContent = `${labelPart} · ${train.status}${timePart}`;

    item.append(route, meta);

    item.addEventListener("click", () => {
      map.setView([train.lat, train.lon], 14);
      const entry = liveMarkers.get(train.id);
      if (entry?.marker) entry.marker.openPopup();
    });

    trainList.append(item);
  }
}

function popupHtml(train) {
  if (train.type === "station") {
    return `<div class="popup-station"><strong>${escapeHtml(train.line)}</strong><div class="popup-meta">${escapeHtml(train.label)}</div></div>`;
  }
  const color = escapeHtml(getRouteColor(train.line));
  const speedStr = train.speed != null ? `${train.speed} mph` : train.status;
  const headingStr = train.heading ? ` · ${escapeHtml(train.heading)}` : "";
  const stateStr = train.state && train.state !== "Active" ? ` · ${escapeHtml(train.state)}` : "";
  return [
    `<div class="popup-train">`,
    `<div class="popup-route-bar" style="background:${color}"></div>`,
    `<strong class="popup-train-id">Train #${escapeHtml(train.label)}</strong>`,
    `<div class="popup-route-name">${escapeHtml(train.line)}</div>`,
    `<div class="popup-details">${escapeHtml(speedStr)}${headingStr}${stateStr}</div>`,
    `</div>`
  ].join("");
}

function tooltipHtml(train) {
  if (train.type === "station") {
    return `<strong>${escapeHtml(train.line)}</strong>`;
  }
  const parts = [`<strong>${escapeHtml(train.line)}</strong> #${escapeHtml(train.label)}`];
  if (train.speed != null) parts.push(`${train.speed} mph`);
  if (train.heading) parts.push(escapeHtml(train.heading));
  return parts.join(" · ");
}

function buildTrainIcon(train) {
  if (train.type === "station") {
    return L.divIcon({
      html: '<div class="station-dot"></div>',
      className: "",
      iconSize: [10, 10],
      iconAnchor: [5, 5]
    });
  }

  const color = getRouteColor(train.line);
  const deg = headingToDeg(train.heading);
  const rotation = deg ?? 0;
  const arrowSvg = deg !== null
    ? `<polygon class="train-arrow" points="0,-11 -3.5,-5.5 3.5,-5.5"/>`
    : "";

  const svg = `<svg class="train-svg" viewBox="-11 -11 22 22" xmlns="http://www.w3.org/2000/svg">${arrowSvg}<circle class="train-body" r="5.5"/></svg>`;

  return L.divIcon({
    html: `<div class="train-icon-wrap" style="--tc:${color};transform:rotate(${rotation}deg)">${svg}</div>`,
    className: "",
    iconSize: [22, 22],
    iconAnchor: [11, 11]
  });
}

function createTrainMarker(train) {
  const icon = buildTrainIcon(train);
  const marker = L.marker([train.lat, train.lon], {
    icon,
    zIndexOffset: train.type === "train" ? 200 : 0
  });
  marker.bindPopup(popupHtml(train));
  marker.bindTooltip(tooltipHtml(train), { direction: "top", offset: [0, -8] });
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
      // Refresh icon (heading may have changed) and popup/tooltip content
      entry.marker.setIcon(buildTrainIcon(train));
      entry.marker.setPopupContent(popupHtml(train));
      entry.marker.setTooltipContent(tooltipHtml(train));
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
