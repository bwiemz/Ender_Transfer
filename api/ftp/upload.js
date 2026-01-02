const Busboy = require("busboy");
const { buildConfig, withClient } = require("./_client");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end("Method Not Allowed");
    return;
  }

  const busboy = Busboy({ headers: req.headers });
  let payload = {};
  let fileStream = null;
  let fileName = null;

  busboy.on("field", (name, value) => {
    payload[name] = value;
  });

  busboy.on("file", (_name, stream, info) => {
    fileStream = stream;
    fileName = info.filename;
  });

  busboy.on("finish", async () => {
    if (!fileStream) {
      res.statusCode = 400;
      res.end("No file uploaded");
      return;
    }
    try {
      const config = buildConfig({
        host: payload.host,
        port: payload.port ? Number(payload.port) : 21,
        username: payload.username,
        password: payload.password || "",
        secure: payload.secure === "true",
      });
      const remotePath = payload.remotePath || fileName;
      await withClient(config, (client) => client.uploadFrom(fileStream, remotePath));
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ ok: true }));
    } catch (error) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: String(error) }));
    }
  });

  req.pipe(busboy);
};
