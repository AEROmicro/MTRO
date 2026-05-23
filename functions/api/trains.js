export const runtime = 'edge';

export async function onRequestGet(context) {
  const env = context?.env;
  if (env && typeof env === "object" && typeof process !== "undefined" && process.env) {
    for (const [key, value] of Object.entries(env)) {
      if (typeof value === "string") {
        process.env[key] = value;
      }
    }
  }

  const { GET } = await import("../../src/app/api/trains/route.js");
  return GET(context.request);
}
