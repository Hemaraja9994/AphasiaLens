const https = require("https");

// Claude model used for every AI analysis in AphasiaLens.
// When Anthropic retires this model, set ANTHROPIC_MODEL in Netlify
// (Project configuration → Environment variables) and redeploy — no code change.
// Model status list: https://platform.claude.com/docs/en/about-claude/model-deprecations
const DEFAULT_MODEL = "claude-sonnet-4-6";
const MAX_TOKENS_CAP = 4096;

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC_API_KEY) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "ANTHROPIC_API_KEY not set." }),
    };
  }

  let request;
  try {
    request = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Invalid request body." }),
    };
  }
  // The server, not the browser, decides the model and the output limit,
  // so the API key cannot be used for other models or very long outputs.
  request.model = process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;
  request.max_tokens = Math.min(Number(request.max_tokens) || 2500, MAX_TOKENS_CAP);

  return new Promise((resolve) => {
    try {
      const payload = JSON.stringify(request);
      const options = {
        hostname: "api.anthropic.com",
        path: "/v1/messages",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "Content-Length": Buffer.byteLength(payload),
        },
      };

      const req = https.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => { data += chunk; });
        res.on("end", () => {
          resolve({
            statusCode: res.statusCode,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
            body: data,
          });
        });
      });

      req.on("error", (err) => {
        resolve({
          statusCode: 500,
          headers: { "Access-Control-Allow-Origin": "*" },
          body: JSON.stringify({ error: err.message }),
        });
      });

      req.write(payload);
      req.end();
    } catch (err) {
      resolve({
        statusCode: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: err.message }),
      });
    }
  });
};
