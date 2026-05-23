export const runtime = 'edge';
let trainsRouteModulePromise;

export async function onRequestGet(context) {
  const env = context.env;
  if (env && typeof env === "object" && typeof process !== "undefined" && process.env) {
    for (const [key, value] of Object.entries(env)) {
      if (typeof value === "string") {
        process.env[key] = value;
      }
    }
  }

  trainsRouteModulePromise ||= import("../../src/app/api/trains/route.js");
  const { GET } = await trainsRouteModulePromise;
  return GET(context.request);
}
