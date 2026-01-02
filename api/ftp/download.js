const path = require("path");
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
    const remotePath = payload.remotePath;
    const filename = payload.filename || path.basename(remotePath || "download");
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename.replace(/"/g, "")}"`
    );
    await withClient(config, (client) => client.downloadTo(res, remotePath));
  } catch (error) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: String(error) }));
  }
};
