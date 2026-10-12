// H2O assistant: passes your questions to Claude through the Anthropic API.
// Needs ANTHROPIC_API_KEY on Netlify. Without it the app works and simply hides "Ask H2O".
const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

export default async (req) => {
  const code = Netlify.env.get("H2O_CODE");
  // H2O_CODE is optional: when it isn't set on Netlify, the app opens without a code.
  if (code && req.headers.get("x-h2o-code") !== code) return json({ error: "unauthorized" }, 401);

  const key = Netlify.env.get("ANTHROPIC_API_KEY");
  if (req.method === "GET") return json({ ready: Boolean(key) });
  if (!key) return json({ error: "no_key" }, 503);
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  const b = await req.json().catch(() => null);
  if (!b || typeof b.system !== "string" || !Array.isArray(b.messages) || !b.messages.length)
    return json({ error: "bad request" }, 400);
  if (JSON.stringify(b).length > 200000) return json({ error: "too large" }, 413);

  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: Netlify.env.get("H2O_MODEL") || "claude-sonnet-5-5",
      max_tokens: 1024,
      system: b.system,
      messages: b.messages,
      tools: Array.isArray(b.tools) ? b.tools.slice(0, 5) : undefined,
    }),
  });
  const out = await r.json().catch(() => ({}));
  if (!r.ok) {
    const msg = (out.error && out.error.message) || "upstream error";
    return json({ error: msg }, r.status === 429 ? 429 : 502);
  }
  return json({ content: out.content, stop_reason: out.stop_reason });
};

export const config = { path: "/api/ask" };
