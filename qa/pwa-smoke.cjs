const assert = require("node:assert/strict");

const playwrightModule = process.argv[2] || "playwright";
const appUrl = process.argv[3] || "http://127.0.0.1:4173/";
const browserExecutable = process.argv[4] || undefined;
const { chromium } = require(playwrightModule);

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: browserExecutable,
  });
  const context = await browser.newContext();
  const page = await context.newPage();
  const pageErrors = [];

  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.route("**/api/runtime-config", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ supabaseUrl: "", supabaseAnonKey: "" }),
    })
  );

  await page.goto(appUrl, { waitUntil: "networkidle" });
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(
    await page.evaluate(() => Boolean(navigator.serviceWorker.controller)),
    true,
    "The page was not controlled by the service worker."
  );

  await page.unroute("**/api/runtime-config");
  await context.setOffline(true);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.locator("#kana-grid .kana-tile").first().waitFor({ state: "attached" });
  const offlineTileCount = await page.locator("#kana-grid .kana-tile").count();
  assert.ok(offlineTileCount >= 40, `Offline PWA loaded only ${offlineTileCount} kana tiles.`);
  assert.equal(await page.title(), "Kana Sprint");
  assert.deepEqual(pageErrors, [], `Offline page errors: ${pageErrors.join(" | ")}`);

  console.log(
    JSON.stringify(
      {
        status: "ok",
        serviceWorkerControlled: true,
        offlineReload: true,
        offlineTileCount,
      },
      null,
      2
    )
  );

  await browser.close();
})().catch((error) => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
