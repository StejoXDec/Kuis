// Production server: serves the built app from dist/ and handles /api/generate.
// Usage: npm run build && ANTHROPIC_API_KEY=sk-ant-... npm start

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { handleGenerate } from "./api/generate.js";
import { loadEnv } from "./api/env.js";

const here = path.dirname(fileURLToPath(import.meta.url));
loadEnv(here);
const DIST = path.join(here, "dist");
const PORT = Number(process.env.PORT) || 3000;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".json": "application/json; charset=utf-8",
};

const serveStatic = (req, res) => {
  const url = new URL(req.url, "http://localhost");
  let file = path.normalize(path.join(DIST, url.pathname));
  if (!file.startsWith(DIST)) {
    res.statusCode = 403;
    return res.end();
  }
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    file = path.join(DIST, "index.html"); // single-page app fallback
  }
  res.setHeader("content-type", TYPES[path.extname(file)] || "application/octet-stream");
  fs.createReadStream(file).pipe(res);
};

http
  .createServer(async (req, res) => {
    if (req.url.startsWith("/api/generate")) return handleGenerate(req, res);
    return serveStatic(req, res);
  })
  .listen(PORT, () => {
    console.log(`Kuis berjalan di http://localhost:${PORT}`);
    if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
      console.warn("Peringatan: ANTHROPIC_API_KEY belum diset. Fitur acak soal tidak akan jalan.");
    }
  });
