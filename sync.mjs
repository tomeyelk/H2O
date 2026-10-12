// H2O sync: keeps your phone and computer in step.
// Data lives in Netlify Blobs; every request must carry your code (H2O_CODE on Netlify).
import { getStore } from "@netlify/blobs";

const ID = /^(settings|m-\d{4}-\d{2})$/;
const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

export default async (req) => {
  const code = Netlify.env.get("H2O_CODE");
  // H2O_CODE is optional: when it isn't set on Netlify, the app opens without a code.
  if (code && req.headers.get("x-h2o-code") !== code) return json({ error: "unauthorized" }, 401);

  const store = getStore({ name: "h2o", consistency: "strong" });

  if (req.method === "GET") {
    const { blobs } = await store.list();
    const docs = {};
    await Promise.all(
      blobs.map(async (b) => {
        docs[b.key] = await store.get(b.key, { type: "json" });
      })
    );
    return json({ docs });
  }

  if (req.method === "PUT") {
    const b = await req.json().catch(() => null);
    const valid =
      b && typeof b.id === "string" && ID.test(b.id) &&
      typeof b.ts === "number" &&
      b.data && typeof b.data === "object";
    if (!valid) return json({ error: "bad request" }, 400);
    if (JSON.stringify(b.data).length > 250000) return json({ error: "too large" }, 413);

    const current = await store.get(b.id, { type: "json" });
    // Last change wins: an older edit never overwrites a newer one.
    if (!current || current.ts <= b.ts) await store.setJSON(b.id, { data: b.data, ts: b.ts });
    return json({ ok: true });
  }

  return json({ error: "method not allowed" }, 405);
};

export const config = { path: "/api/sync" };
