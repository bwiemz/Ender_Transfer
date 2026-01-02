const { readJson, buildConfig, withClient, mapEntry } = require("./_client");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end("Method Not Allowed");
    return;
  }
  try {
    const payload = await readJson(req);
    const config = buildConfig(payload);
    const path = payload.path || "/";
    const result = await withClient(config, async (client) => {
      await client.cd(path);
      const cwd = await client.pwd();
      const entries = await client.list();
      return { cwd, entries };
    });
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        cwd: result.cwd || "/",
        entries: result.entries.map(mapEntry),
      })
    );
  } catch (error) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: String(error) }));
  }
};
