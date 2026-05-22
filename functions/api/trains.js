import { GET } from "../../src/app/api/trains/route.js";

export async function onRequestGet(context) {
  return GET(context.request);
}
