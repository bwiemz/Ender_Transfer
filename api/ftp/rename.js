const { readJson, buildConfig, withClient } = require("./_client");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end("Method Not Allowed");
    return;
  }
  try {
    const payload = await readJson(req);
    const config = buildConfig(payload);
    await withClient(config, (client) => client.rename(payload.from, payload.to));
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ ok: true }));
  } catch (error) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: String(error) }));
  }
};
