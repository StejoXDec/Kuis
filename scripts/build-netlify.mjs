// Builds a Netlify drag-and-drop deploy: kuis-netlify.zip
//
//   zip root/            <- contents of dist/ (index.html, assets/)
//   netlify.toml         <- functions dir + SPA redirect
//   netlify/functions/generate.mjs  <- self-contained function, no node_modules
//
// Usage: npm run build:netlify
// Then: drop the zip on https://app.netlify.com/drop (or Deploys > drag and
// drop), and set GEMINI_API_KEY under Site configuration > Environment variables.

import { execSync } from "node:child_process";
import { build } from "esbuild";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const stage = path.join(root, ".netlify-stage");
const zipName = "kuis-netlify.zip";

const run = (cmd) => execSync(cmd, { cwd: root, stdio: "inherit" });

// 1. Static site
run("npx vite build");

// 2. Function bundle (one file; the Claude SDK stays external and is only
//    needed when ANTHROPIC_API_KEY is used instead of Gemini)
const fnOut = path.join(root, "netlify", "functions", "generate.mjs");
await build({
  entryPoints: [path.join(root, "netlify", "generate.js")],
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node18",
  outfile: fnOut,
  external: ["@anthropic-ai/sdk"],
  logLevel: "info",
});

// 3. Stage the zip layout
fs.rmSync(stage, { recursive: true, force: true });
fs.cpSync(dist, stage, { recursive: true });
fs.mkdirSync(path.join(stage, "netlify", "functions"), { recursive: true });
fs.copyFileSync(fnOut, path.join(stage, "netlify", "functions", "generate.mjs"));
fs.writeFileSync(
  path.join(stage, "netlify.toml"),
  `[functions]
  directory = "netlify/functions"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`
);

// 4. Zip
const zipPath = path.join(root, zipName);
fs.rmSync(zipPath, { force: true });
execSync(`zip -qr "${zipPath}" .`, { cwd: stage, stdio: "inherit" });
fs.rmSync(stage, { recursive: true, force: true });

const kb = Math.round(fs.statSync(zipPath).size / 1024);
console.log(`\nSiap: ${zipName} (${kb} KB). Upload ke https://app.netlify.com/drop`);
console.log("Jangan lupa set GEMINI_API_KEY di Site configuration > Environment variables.");
