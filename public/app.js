const MODE_COLORS = {
  train: "#991b1b",
  bus: "#2563eb",
  tram: "#16a34a",
  other: "#7c3aed",
  station: "#6b7280"
};
const MODE_LEGEND_ORDER = ["train", "bus", "tram", "other", "station"];

const HEADING_DEG = {
  N: 0, NNE: 22.5, NE: 45, ENE: 67.5, E: 90, ESE: 112.5, SE: 135, SSE: 157.5,
  S: 180, SSW: 202.5, SW: 225, WSW: 247.5, W: 270, WNW: 292.5, NW: 315, NNW: 337.5
};

const CITIES = [
  { id: "washington-dc", name: "Washington, DC", center: [38.9072, -77.0369], zoom: 10, bbox: [39.18, -77.5, 38.65, -76.73], provider: "multi", directFallbackProvider: "amtraker", timezone: "America/New_York" },
  { id: "new-york-city", name: "New York City", center: [40.7128, -74.0060], zoom: 10, bbox: [41.05, -74.35, 40.45, -73.6], provider: "multi", directFallbackProvider: "amtraker", timezone: "America/New_York" },
  { id: "boston", name: "Boston", center: [42.3601, -71.0589], zoom: 10, bbox: [42.58, -71.35, 42.17, -70.85], provider: "multi", timezone: "America/New_York" },
  { id: "philadelphia", name: "Philadelphia", center: [39.9526, -75.1652], zoom: 10, bbox: [40.08, -75.35, 39.83, -74.95], provider: "multi", directFallbackProvider: "amtraker", timezone: "America/New_York" },
  { id: "bay-area", name: "Bay Area", center: [37.8044, -122.2712], zoom: 10, bbox: [38.10, -122.75, 37.20, -121.60], provider: "multi", timezone: "America/Los_Angeles" },
  { id: "seattle", name: "Seattle", center: [47.6062, -122.3321], zoom: 10, bbox: [47.90, -122.55, 47.35, -121.95], provider: "multi", directFallbackProvider: "amtraker", timezone: "America/Los_Angeles" },
  { id: "atlanta", name: "Atlanta", center: [33.7490, -84.3880], zoom: 10, bbox: [34.15, -84.70, 33.40, -83.95], provider: "multi", directFallbackProvider: "amtraker", timezone: "America/New_York" },
  { id: "denver", name: "Denver", center: [39.7392, -104.9903], zoom: 10, bbox: [40.10, -105.30, 39.55, -104.70], provider: "multi", directFallbackProvider: "amtraker", timezone: "America/Denver" },
  { id: "chicago", name: "Chicago", center: [41.8781, -87.6298], zoom: 10, bbox: [42.15, -88.10, 41.60, -87.45], provider: "multi", directFallbackProvider: "amtraker", timezone: "America/Chicago" },
  { id: "houston", name: "Houston", center: [29.7604, -95.3698], zoom: 10, bbox: [30.20, -95.80, 29.40, -95.00], provider: "multi", directFallbackProvider: "amtraker", timezone: "America/Chicago" },
  { id: "milwaukee", name: "Milwaukee", center: [43.0389, -87.9065], zoom: 10, bbox: [43.25, -88.20, 42.85, -87.75], provider: "multi", directFallbackProvider: "amtraker", timezone: "America/Chicago" },
  { id: "los-angeles", name: "Los Angeles", center: [34.0522, -118.2437], zoom: 10, bbox: [34.45, -118.90, 33.65, -117.60], provider: "multi", directFallbackProvider: "amtraker", timezone: "America/Los_Angeles" }
];

const citySearch = document.getElementById("citySearch");
const cityOptions = document.getElementById("cityOptions");
const citySelect = document.getElementById("citySelect");
const snapshotSelect = document.getElementById("snapshotSelect");
const refreshBtn = document.getElementById("refreshBtn");
const statusEl = document.getElementById("status");
const trainList = document.getElementById("trainList");
const panelTitle = document.getElementById("panelTitle");
const modeLegend = document.getElementById("modeLegend");
const utcTimeEl = document.getElementById("utcTime");
const localTimeEl = document.getElementById("localTime");
const DEFAULT_CITY_ID = "new-york-city";
const defaultCity = CITIES.find((city) => city.id === DEFAULT_CITY_ID) || CITIES[0];

const map = L.map("map", { zoomControl: true }).setView(defaultCity.center, defaultCity.zoom);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const markerLayer = L.layerGroup().addTo(map);
const historyByCity = new Map();
let currentCity = defaultCity;
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

  const autoOption = document.createElement("option");
  autoOption.value = city.name;
  cityOptions.append(autoOption);
}
citySelect.value = defaultCity.id;
citySearch.value = CITIES.find((city) => city.id === citySelect.value)?.name || "";

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

function normalizeVehicleType(type) {
  const normalized = String(type || "other").toLowerCase();
  if (normalized === "rail") return "train";
  if (normalized === "streetcar" || normalized === "light_rail" || normalized === "light-rail") return "tram";
  if (normalized === "station") return "station";
  if (normalized === "train" || normalized === "bus" || normalized === "tram" || normalized === "other") return normalized;
  return "other";
}

function getVehicleColor(type) {
  const normalized = normalizeVehicleType(type);
  return MODE_COLORS[normalized] || MODE_COLORS.other;
}

function getVehicleLabel(type) {
  const normalized = normalizeVehicleType(type);
  if (normalized === "bus") return "Bus";
  if (normalized === "tram") return "Tram";
  if (normalized === "station") return "Station";
  if (normalized === "other") return "Vehicle";
  return "Train";
}

function renderModeLegend() {
  if (!modeLegend) return;
  modeLegend.textContent = "";
  for (const type of MODE_LEGEND_ORDER) {
    const item = document.createElement("li");
    item.className = "mode-legend-item";

    const dot = document.createElement("span");
    dot.className = "mode-legend-dot";
    dot.style.background = getVehicleColor(type);

    const label = document.createElement("span");
    label.textContent = getVehicleLabel(type);

    item.append(dot, label);
    modeLegend.append(item);
  }
}

function headingToDeg(h) {
  if (typeof h === "number" && Number.isFinite(h)) return h;
  return HEADING_DEG[h] ?? null;
}

function parseAmtraker(data, city) {
  const rows = Array.isArray(data) ? data : Object.values(data || {}).flat();
  return rows
    .map((row) => {
      if (!row || typeof row !== "object") return null;
      const lat = Number(row.lat ?? row.latitude);
      const lon = Number(row.lon ?? row.lng ?? row.longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
      return {
        id: String(row.trainID ?? row.train_id ?? row.id ?? `${lat},${lon}`),
        line: String(row.routeName || row.route_name || row.route || row.trainNum || row.train_num || "Amtrak"),
        label: String(row.trainNum || row.trainID || row.train_num || row.train_id || "Train"),
        status: row.velocity != null ? `${Math.round(Number(row.velocity))} mph` : "Active",
        heading: Number.isFinite(Number(row.heading)) ? Number(row.heading) : null,
        speed: row.velocity != null ? Math.round(Number(row.velocity)) : null,
        speedUnit: "mph",
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
      const response = await fetch(url, {
        ...init,
        signal: controller.signal,
        headers: {
          accept: "application/json",
          ...(init?.headers || {})
        }
      });
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
  const fallbackProvider = city.directFallbackProvider || city.provider;
  if (fallbackProvider === "amtraker") {
    const amtrakerData = await fetchJsonFromFirstHealthy(AMTRAKER_ENDPOINTS, { cache: "no-store" });
    const amtrakerTrains = parseAmtraker(amtrakerData, city);
    return {
      trains: amtrakerTrains,
      message: amtrakerTrains.length
        ? `${amtrakerTrains.length} active Amtrak train${amtrakerTrains.length !== 1 ? "s" : ""} in this area.`
        : "No live Amtrak trains found in this area right now."
    };
  }

  throw new Error("This location needs the server /api/trains proxy because the provider is integrated server-side.");
}

async function fetchFromProxy(city) {
  let response;
  try {
    response = await fetch(`${API_PROXY_PATH}?city=${encodeURIComponent(city.id)}`, { cache: "no-store" });
  } catch (error) {
    const proxyError = new Error(`Proxy request failed: ${error?.message || "Network error"}`);
    proxyError.kind = "proxy-network";
    throw proxyError;
  }
  let result = null;
  try {
    result = await response.json();
  } catch {
    result = null;
  }
  if (!response.ok) {
    const message = typeof result?.message === "string" && result.message.trim()
      ? result.message.trim()
      : `Proxy unavailable (${response.status})`;
    const proxyError = new Error(message);
    proxyError.kind = "proxy-http";
    proxyError.status = response.status;
    throw proxyError;
  }
  return {
    trains: Array.isArray(result?.trains) ? result.trains : [],
    message: typeof result?.message === "string" ? result.message : "Data loaded."
  };
}

async function fetchCityTrains(city) {
  try {
    return await fetchFromProxy(city);
  } catch (proxyError) {
    const fallbackProvider = city.directFallbackProvider || city.provider;
    if (fallbackProvider !== "amtraker") {
      const missingProxyRoute = proxyError?.status === 404 || proxyError?.status === 405;
      if (!missingProxyRoute) {
        return {
          trains: [],
          message: `Live data is temporarily unavailable from /api/trains. ${proxyError?.message || "Please try again shortly."}`
        };
      }
      return {
        trains: [],
        message: "Live data for this location needs the /api/trains route. Use npm run dev/start for self-hosting, or deploy with Cloudflare Pages Functions so /api/trains is available."
      };
    }
    const fallbackPrefix = "Loaded in self-host mode without proxy.";
    const fallbackDetails = proxyError?.message ? ` Reason: ${proxyError.message}` : "";
    return {
      ...(await fetchBrowserDirect(city)),
      message: `${fallbackPrefix}${fallbackDetails}`
    };
  }
}


function resolveCitySearch(input) {
  const term = String(input || "").trim().toLowerCase();
  if (!term) return null;

  const exact = CITIES.find((city) => city.name.toLowerCase() === term || city.id.toLowerCase() === term);
  if (exact) return exact;

  return CITIES.find((city) => city.name.toLowerCase().startsWith(term) || city.id.toLowerCase().startsWith(term)) || null;
}

function applyCitySearch() {
  const match = resolveCitySearch(citySearch.value);
  if (!match) return;
  citySelect.value = match.id;
  citySearch.value = match.name;
  loadCity(match.id);
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
      speedUnit: String(train.speedUnit || "mph"),
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

function getTimeZoneLabel(timezone, date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZoneName: "short"
  }).formatToParts(date);
  const tzPart = parts.find((part) => part.type === "timeZoneName");
  return tzPart?.value || timezone;
}

function updateTimeBar() {
  const now = new Date();
  const utc = new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(now);
  const local = new Intl.DateTimeFormat("en-GB", {
    timeZone: currentCity.timezone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(now);
  const tzLabel = getTimeZoneLabel(currentCity.timezone, now);

  utcTimeEl.textContent = `UTC ${utc}`;
  localTimeEl.textContent = `${currentCity.name} ${local} (${tzLabel})`;
}

async function loadCity(cityId) {
  const city = CITIES.find((entry) => entry.id === cityId) || CITIES[0];
  currentCity = city;
  citySearch.value = city.name;
  map.setView(city.center, city.zoom);
  panelTitle.textContent = `${city.name} Transit`;
  statusEl.textContent = "Loading…";
  updateTimeBar();

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
  const selected = CITIES.find((city) => city.id === citySelect.value);
  citySearch.value = selected?.name || "";
  loadCity(citySelect.value);
});

citySearch.addEventListener("change", applyCitySearch);
citySearch.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    applyCitySearch();
  }
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

setInterval(updateTimeBar, 1000);

loadCity(defaultCity.id);
renderModeLegend();
updateTimeBar();

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

  const activeVehicles = trains.filter((t) => t.type !== "station");

  if (!trains.length) {
    const empty = document.createElement("li");
    empty.className = "train-item train-item--empty";
    empty.textContent = "No data available for this view.";
    trainList.append(empty);
    return;
  }

  if (activeVehicles.length) {
    panelTitle.textContent = `${currentCity.name} Transit (${activeVehicles.length} active)`;
  }

  for (const train of trains) {
    const item = document.createElement("li");
    item.className = `train-item${train.type === "station" ? " train-item--station" : ""}`;
    item.dataset.id = train.id;
    item.style.borderLeft = `4px solid ${getVehicleColor(train.type)}`;

    if (train.type !== "station") {
      const dot = document.createElement("span");
      dot.className = "train-color-dot";
      dot.style.background = getVehicleColor(train.type);
      item.append(dot);
    }

    const route = document.createElement("div");
    route.className = "train-route";
    route.textContent = train.line;

    const meta = document.createElement("div");
    meta.className = "train-meta";
    const labelPart = train.type === "station" ? "Station" : `${getVehicleLabel(train.type)} #${train.label}`;
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
  const color = escapeHtml(getVehicleColor(train.type));
  const vehicleLabel = getVehicleLabel(train.type);
  const speedStr = train.speed != null ? `${train.speed} ${escapeHtml(train.speedUnit)}` : train.status;
  const headingStr = train.heading ? ` · ${escapeHtml(train.heading)}` : "";
  const stateStr = train.state && train.state !== "Active" ? ` · ${escapeHtml(train.state)}` : "";
  return [
    `<div class="popup-train">`,
    `<div class="popup-route-bar" style="background:${color}"></div>`,
    `<strong class="popup-train-id">${escapeHtml(vehicleLabel)} #${escapeHtml(train.label)}</strong>`,
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
  if (train.speed != null) parts.push(`${train.speed} ${escapeHtml(train.speedUnit)}`);
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

  const color = getVehicleColor(train.type);
  const deg = headingToDeg(train.heading);
  const rotation = deg ?? 0;
  const arrowSvg = deg !== null
    ? '<polygon class="train-arrow" points="0,-11 -3.5,-5.5 3.5,-5.5"/>'
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
