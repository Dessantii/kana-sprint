const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const playwrightModule = process.argv[2] || "playwright";
const appUrl = process.argv[3] || "http://127.0.0.1:4173/";
const browserExecutable = process.argv[4] || undefined;
const { chromium } = require(playwrightModule);

const artifactDir = path.join(__dirname, "artifacts");
fs.mkdirSync(artifactDir, { recursive: true });

function assertVisibleMessage(message, label) {
  assert.ok(message && message.trim(), `${label} did not show feedback.`);
}

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: browserExecutable,
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    serviceWorkers: "block",
  });
  const page = await context.newPage();
  const pageErrors = [];
  const consoleErrors = [];

  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  await page.route("**/api/runtime-config", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ supabaseUrl: "", supabaseAnonKey: "" }),
    })
  );

  await page.goto(appUrl, { waitUntil: "networkidle" });
  await page.locator('[data-auth-mode="signup"]').click();
  const userName = `qa-${Date.now()}`;
  const password = "kana-test-123";
  await page.locator("#signup-name").fill(userName);
  await page.locator("#signup-password").fill(password);
  await page.locator("#signup-form button[type=submit]").click();
  await page.locator("#auth-gate").waitFor({ state: "hidden" });

  const kanaTileCount = await page.locator("#kana-grid .kana-tile").count();
  assert.ok(kanaTileCount >= 40, `Expected a populated kana grid, found ${kanaTileCount} tiles.`);
  const kanaGridText = await page.locator("#kana-grid").innerText();
  assert.ok(!/\?{3,}/.test(kanaGridText), "Kana grid contains corrupted question-mark text.");

  await page.locator('[data-section-target="training"]').first().click();

  const activateMode = async (mode) => {
    await page.locator(`#train-nav [data-train-target="${mode}"]`).evaluate((button) => button.click());
    await page.locator(`[data-train-panel="${mode}"]`).waitFor({ state: "visible" });
  };

  await activateMode("context");
  const initialContextRotationCount = await page.evaluate(() => {
    const key = Object.keys(localStorage).find((entry) => entry.startsWith("kanaSprintProgressV4::"));
    return JSON.parse(localStorage.getItem(key)).contentRotation.seenByMode.context.length;
  });
  assert.ok(initialContextRotationCount >= 1, "The initial context item was not tracked after login.");
  const weeklyContextItems = [];
  for (let index = 0; index < 10; index += 1) {
    const contextText = await page.locator("#context-word").innerText();
    weeklyContextItems.push(contextText.trim());
    assert.equal(
      await page.locator("#context-breakdown").isHidden(),
      true,
      "Context breakdown leaked before the answer."
    );
    if (index < 9) {
      await page.locator("#next-context").click();
    }
  }
  assert.equal(
    new Set(weeklyContextItems).size,
    weeklyContextItems.length,
    "Context rotation repeated an item before exhausting the active deck."
  );

  let foundKonnichiwa = weeklyContextItems.at(-1) === "こんにちは";
  for (let index = 0; !foundKonnichiwa && index < 50; index += 1) {
    await page.locator("#next-context").click();
    foundKonnichiwa = (await page.locator("#context-word").innerText()).trim() === "こんにちは";
  }
  assert.equal(foundKonnichiwa, true, "Could not reach the konnichiwa context item.");
  assert.equal(await page.locator("#context-breakdown").isHidden(), true);
  await page.locator("#context-input").fill("konichiwa");
  await page.locator('#context-form button[type="submit"]').click();
  assert.match(await page.locator("#context-feedback").innerText(), /Dica:.*nn/);
  assert.equal(await page.locator("#context-breakdown").isVisible(), true);
  assert.equal(await page.locator("#context-input").isDisabled(), true);
  assert.equal(await page.locator('#context-form button[type="submit"]').isDisabled(), true);
  assert.equal(
    await page.locator('#context-form button[type="submit"]').innerText(),
    "Resposta registrada"
  );

  const xpAfterSingleN = await page.evaluate(() => {
    const key = Object.keys(localStorage).find((entry) => entry.startsWith("kanaSprintProgressV4::"));
    return JSON.parse(localStorage.getItem(key)).xp;
  });
  await page.locator("#context-form").evaluate((form) =>
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }))
  );
  const xpAfterRepeatedSubmit = await page.evaluate(() => {
    const key = Object.keys(localStorage).find((entry) => entry.startsWith("kanaSprintProgressV4::"));
    return JSON.parse(localStorage.getItem(key)).xp;
  });
  assert.equal(xpAfterRepeatedSubmit, xpAfterSingleN, "Repeated submit changed XP.");

  foundKonnichiwa = false;
  for (let index = 0; !foundKonnichiwa && index < 50; index += 1) {
    await page.locator("#next-context").click();
    foundKonnichiwa = (await page.locator("#context-word").innerText()).trim() === "こんにちは";
  }
  assert.equal(foundKonnichiwa, true, "Could not revisit konnichiwa for the corrected answer.");
  await page.locator("#context-input").fill("konnichiwa");
  await page.locator('#context-form button[type="submit"]').click();
  assert.match(await page.locator("#context-feedback").innerText(), /^Boa\./);

  await activateMode("recognition");
  await page.locator("#quiz-options button").first().click();
  assertVisibleMessage(await page.locator("#quiz-feedback").innerText(), "Recognition");

  const formModes = [
    ["reading", "#reading-input", "#reading-form", "#reading-feedback"],
    ["phrases", "#phrase-input", "#phrase-form", "#phrase-feedback"],
    ["dictation", "#dictation-input", "#dictation-form", "#dictation-feedback"],
  ];

  for (const [mode, input, form, feedback] of formModes) {
    await activateMode(mode);
    if (mode === "phrases") {
      assert.equal(
        await page.locator("#phrase-breakdown").isHidden(),
        true,
        "Phrase breakdown leaked before the answer."
      );
    }
    await page.locator(input).fill("resposta-incorreta");
    await page.locator(`${form} button[type=submit]`).click();
    await page.locator(`${feedback}.has-message`).waitFor({ state: "visible" });
    assertVisibleMessage(await page.locator(feedback).innerText(), mode);
    assert.equal(await page.locator(input).isDisabled(), true, `${mode} input was not locked.`);
    assert.equal(
      await page.locator(`${form} button[type=submit]`).isDisabled(),
      true,
      `${mode} submit was not locked.`
    );
    if (mode === "phrases") {
      assert.equal(await page.locator("#phrase-breakdown").isVisible(), true);
    }
  }

  await activateMode("cloze");
  await page.locator("#cloze-options button").first().click();
  assertVisibleMessage(await page.locator("#cloze-feedback").innerText(), "Cloze");

  await activateMode("confusion");
  await page.locator("#confusion-options button").first().click();
  assertVisibleMessage(await page.locator("#confusion-feedback").innerText(), "Confusion");

  await activateMode("builder");
  assert.ok(await page.locator("#builder-bank button").count(), "Builder has no selectable kana.");
  await page.locator("#next-builder").click();
  assert.ok(await page.locator("#builder-bank button").count(), "Builder did not generate the next item.");

  for (const section of ["today", "study", "progress", "review", "arcade"]) {
    await page.locator(`[data-section-target="${section}"]`).first().click();
    await page.locator(`[data-section-panel="${section}"].is-active`).waitFor({ state: "visible" });
  }

  const hiraganaRomaji = {
    あ: "a", い: "i", う: "u", え: "e", お: "o",
    か: "ka", き: "ki", く: "ku", け: "ke", こ: "ko",
    さ: "sa", し: "shi", す: "su", せ: "se", そ: "so",
    た: "ta", ち: "chi", つ: "tsu", て: "te", と: "to",
    な: "na", に: "ni", ぬ: "nu", ね: "ne", の: "no",
    は: "ha", ひ: "hi", ふ: "fu", へ: "he", ほ: "ho",
    ま: "ma", み: "mi", む: "mu", め: "me", も: "mo",
    や: "ya", ゆ: "yu", よ: "yo",
    ら: "ra", り: "ri", る: "ru", れ: "re", ろ: "ro",
    わ: "wa", を: "o", ん: "n",
  };

  await page.locator('[data-arcade-launch="shuriken"]:visible').first().click();
  await page.locator('[data-arcade-panel="shuriken"].is-active').waitFor({ state: "visible" });
  const shurikenKana = (await page.locator("#shuriken-token").innerText()).trim();
  assert.ok(hiraganaRomaji[shurikenKana], `Unknown shuriken kana: ${shurikenKana}`);
  await page.locator("#shuriken-input").fill(hiraganaRomaji[shurikenKana]);
  await page.waitForFunction(() => Number(document.querySelector("#shuriken-score")?.textContent) > 0);

  await page.locator('[data-arcade-panel="shuriken"] [data-arcade-screen="games"]').click();
  await page.locator('[data-arcade-launch="foods"]:visible').first().click();
  await page.locator('[data-arcade-panel="foods"].is-active').waitFor({ state: "visible" });
  const foodAnswers = {
    takoyaki: "bolinho de polvo",
    raamen: "lamen",
    onigiri: "bolinho de arroz",
    tenpura: "fritura leve",
    matcha: "cha verde matcha",
    okonomiyaki: "panqueca salgada",
    misoshiru: "sopa de miso",
    kareeraisu: "arroz com curry",
  };
  const foodRomaji = (await page.locator("#food-romaji").innerText()).trim();
  assert.ok(foodAnswers[foodRomaji], `Unknown food item: ${foodRomaji}`);
  await page.locator(`[data-food-choice="${foodAnswers[foodRomaji]}"]`).click();
  assert.ok(Number(await page.locator("#food-score").innerText()) > 0, "Food game did not score.");

  await page.locator('[data-arcade-panel="foods"] [data-arcade-screen="games"]').click();
  await page.locator('[data-arcade-launch="pairs"]:visible').first().click();
  await page.locator('[data-arcade-panel="pairs"].is-active').waitFor({ state: "visible" });
  await page.waitForTimeout(1100);
  const pairCards = await page.locator("#pairs-grid [data-pair-index]").evaluateAll((buttons) =>
    buttons.map((button) => ({
      index: Number(button.dataset.pairIndex),
      label: button.querySelector(".pair-card-back")?.textContent.trim() || "",
    }))
  );
  for (const card of pairCards.filter((entry) => hiraganaRomaji[entry.label])) {
    const partner = pairCards.find((entry) => entry.label === hiraganaRomaji[card.label]);
    assert.ok(partner, `Missing romaji pair for ${card.label}.`);
    await page.locator(`[data-pair-index="${card.index}"]`).click();
    await page.locator(`[data-pair-index="${partner.index}"]`).click();
  }
  await page.waitForFunction(() => document.querySelector("#pairs-status")?.textContent.includes("Tabuleiro completo"));
  assert.notEqual((await page.locator("#pairs-record").innerText()).trim(), "-");

  const progressKeys = await page.evaluate(() =>
    Object.keys(localStorage).filter((key) => key.startsWith("kanaSprintProgressV4::"))
  );
  assert.equal(progressKeys.length, 1, "Local progress was not persisted exactly once.");

  const xpBeforeLogout = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)).xp, progressKeys[0]);
  await page.locator("#logout-button").click();
  await page.locator("#auth-gate").waitFor({ state: "visible" });
  await page.locator("#login-name").fill(userName);
  await page.locator("#login-password").fill(password);
  await page.locator('#login-form button[type="submit"]').click();
  await page.locator("#auth-gate").waitFor({ state: "hidden" });
  const xpAfterLogin = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)).xp, progressKeys[0]);
  assert.equal(xpAfterLogin, xpBeforeLogout, "Progress changed across logout/login.");

  await page.screenshot({
    path: path.join(artifactDir, "smoke-final.png"),
    fullPage: true,
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: "networkidle" });
  await page.locator("#auth-gate").waitFor({ state: "hidden" });
  for (const section of ["today", "study", "training", "progress", "review", "arcade"]) {
    await page.locator(`[data-section-target="${section}"]`).first().click();
    await page.locator(`[data-section-panel="${section}"].is-active`).waitFor({ state: "visible" });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    assert.ok(overflow <= 1, `${section} overflows the mobile viewport by ${overflow}px.`);
  }
  await page.locator("#mobile-nav-toggle").click();
  assert.equal(await page.locator("#main-nav").evaluate((nav) => nav.classList.contains("is-mobile-collapsed")), true);
  assert.equal(await page.locator("#section-nav").isHidden(), true);
  assert.equal(await page.locator("#mobile-nav-toggle").getAttribute("aria-expanded"), "false");
  assert.ok((await page.locator("#main-nav").boundingBox()).height < 64, "Collapsed mobile menu is too tall.");
  await page.screenshot({
    path: path.join(artifactDir, "mobile-nav-collapsed.png"),
    fullPage: true,
  });
  await page.locator("#mobile-nav-toggle").click();
  assert.equal(await page.locator("#section-nav").isVisible(), true);
  assert.equal(await page.locator("#mobile-nav-toggle").getAttribute("aria-expanded"), "true");
  await page.screenshot({
    path: path.join(artifactDir, "smoke-mobile.png"),
    fullPage: true,
  });

  assert.deepEqual(pageErrors, [], `Page errors: ${pageErrors.join(" | ")}`);
  assert.deepEqual(consoleErrors, [], `Console errors: ${consoleErrors.join(" | ")}`);

  console.log(
    JSON.stringify(
      {
        status: "ok",
        kanaTileCount,
        weeklyContextItems,
        standardRomanization: "konnichiwa",
        repeatedSubmitLocked: true,
        testedArcadeGames: ["shuriken", "foods", "pairs"],
        localSessionRestored: true,
        mobileViewport: "390x844",
        mobileNavigationToggle: true,
        testedModes: ["recognition", "reading", "context", "phrases", "cloze", "dictation", "confusion", "builder"],
        testedSections: ["today", "study", "training", "progress", "review", "arcade"],
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
