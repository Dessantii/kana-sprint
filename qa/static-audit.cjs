const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const html = read("index.html");
const app = read("app.js");
const schema = read("supabase-schema.sql");
const worker = read("service-worker.js");
const runtimeConfig = read(path.join("api", "runtime-config.js"));

function matches(source, pattern) {
  return [...source.matchAll(pattern)].map((match) => match[1]);
}

function duplicates(values) {
  return [...new Set(values.filter((value, index) => values.indexOf(value) !== index))];
}

const htmlIds = matches(html, /\bid="([^"]+)"/g);
const appElementIds = matches(app, /getElementById\("([^"]+)"\)/g);
assert.deepEqual(duplicates(htmlIds), [], "index.html contains duplicate IDs.");
assert.deepEqual(
  appElementIds.filter((id) => !htmlIds.includes(id)),
  [],
  "app.js references IDs that do not exist in index.html."
);

for (const targetType of ["section", "train"]) {
  const targets = new Set(matches(html, new RegExp(`data-${targetType}-target="([^"]+)"`, "g")));
  const panels = new Set(matches(html, new RegExp(`data-${targetType}-panel="([^"]+)"`, "g")));
  assert.deepEqual(
    [...targets].filter((target) => !panels.has(target)),
    [],
    `${targetType} navigation has targets without panels.`
  );
}

const localAssets = matches(html, /(?:href|src)="([^"?#]+)[^\"]*"/g).filter(
  (asset) => !asset.startsWith("/") && !asset.includes(":")
);
for (const asset of localAssets) {
  const assetPath = path.resolve(root, asset);
  assert.ok(assetPath.startsWith(root), `Asset escapes the project root: ${asset}`);
  assert.ok(fs.existsSync(assetPath), `Missing local asset: ${asset}`);
}

for (const requiredSql of [
  /create table if not exists public\.profiles/i,
  /create table if not exists public\.player_progress/i,
  /alter table public\.profiles enable row level security/i,
  /alter table public\.player_progress enable row level security/i,
  /create policy "profiles_select_authenticated"/i,
  /create policy "profiles_insert_own"/i,
  /create policy "profiles_update_own"/i,
  /create policy "progress_select_own"/i,
  /create policy "progress_insert_own"/i,
  /create policy "progress_update_own"/i,
]) {
  assert.match(schema, requiredSql);
}

assert.match(runtimeConfig, /process\.env\.SUPABASE_URL/);
assert.match(runtimeConfig, /process\.env\.SUPABASE_ANON_KEY/);
assert.match(runtimeConfig, /Cache-Control", "no-store/);
assert.match(worker, /scopedPath === "api\/runtime-config"/);
assert.match(worker, /networkFirst\(event\.request/);
assert.doesNotMatch(worker.match(/const APP_SHELL = \[[\s\S]*?\];/)?.[0] || "", /runtime-config/);

console.log(
  JSON.stringify(
    {
      status: "ok",
      htmlIds: htmlIds.length,
      appElementReferences: appElementIds.length,
      localAssets: localAssets.length,
      databaseTables: ["profiles", "player_progress"],
      rlsPolicies: 6,
    },
    null,
    2
  )
);
