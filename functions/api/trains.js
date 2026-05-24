export const runtime = 'edge';
let trainsRouteModulePromise;
const ALLOWED_ENV_KEYS = new Set([
  "BART_API_KEY",
  "WMATA_API_KEYS",
  "WMATA_API_KEY",
  "WMATA_PRIMARY_KEY",
  "WMATA_SECONDARY_KEY",
  "MTA_API_KEY",
  "METRA_API_KEYS",
  "METRA_API_KEY",
  "HOUSTON_METRO_API_KEYS",
  "HOUSTON_METRO_API_KEY",
  "HOUSTON_METRO_PRIMARY_KEY",
  "HOUSTON_METRO_SECONDARY_KEY",
  "MOBILITY_DATABASE_API_BASE",
  "MOBILITY_DATABASE_ACCESS_TOKEN",
  "MOBILITY_DATABASE_REFRESH_TOKEN",
  "MOBILITY_DATABASE_MAX_ENDPOINTS"
]);

export async function onRequestGet(context) {
  const env = context.env;
  if (env && typeof env === "object" && typeof process !== "undefined" && process.env) {
    for (const [key, value] of Object.entries(env)) {
      if (ALLOWED_ENV_KEYS.has(key) && typeof value === "string") {
        process.env[key] = value;
      }
    }
  }

  try {
    trainsRouteModulePromise ||= import("../../src/app/api/trains/route.js");
    const { GET } = await trainsRouteModulePromise;
    return GET(context.request);
  } catch (error) {
    trainsRouteModulePromise = undefined;
    throw error;
  }
}
