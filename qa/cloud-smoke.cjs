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
  const context = await browser.newContext({ serviceWorkers: "block" });
  const page = await context.newPage();
  const pageErrors = [];
  const consoleErrors = [];

  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  await page.route("**/supabase-config.js", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/javascript",
      body: `window.KANA_SPRINT_CONFIG = {
        supabaseUrl: "https://qa-project.supabase.co",
        supabaseAnonKey: "qa-anon-key"
      };`,
    })
  );
  await page.route("**/api/runtime-config", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ supabaseUrl: "", supabaseAnonKey: "" }),
    })
  );
  await page.route("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/javascript",
      headers: { "Access-Control-Allow-Origin": "*" },
      body: `export function createClient() {
        return {
          auth: {
            getSession: async () => ({ data: { session: null }, error: null })
          }
        };
      }`,
    })
  );

  await page.goto(appUrl, { waitUntil: "networkidle" });
  await page.locator("#sync-badge").waitFor({ state: "visible" });
  assert.equal(
    (await page.locator("#sync-badge").innerText()).trim(),
    "Nuvem pronta",
    "An empty runtime response overwrote the valid local Supabase config."
  );

  const contract = await page.evaluate(async () => {
    const database = {
      profiles: [],
      player_progress: [],
    };
    const users = new Map();
    let activeUser = null;
    let nextId = 1;

    const clone = (value) => (value == null ? value : JSON.parse(JSON.stringify(value)));

    class Query {
      constructor(table) {
        this.table = table;
        this.operation = "select";
        this.filters = [];
        this.orders = [];
        this.maxRows = Infinity;
        this.payload = null;
      }

      select() {
        return this;
      }

      eq(column, value) {
        this.filters.push([column, value]);
        return this;
      }

      insert(payload) {
        this.operation = "insert";
        this.payload = payload;
        return this;
      }

      upsert(payload) {
        this.operation = "upsert";
        this.payload = payload;
        return this;
      }

      order(column, options = {}) {
        this.orders.push([column, options.ascending !== false]);
        return this;
      }

      limit(value) {
        this.maxRows = value;
        return this;
      }

      maybeSingle() {
        return this.execute("maybeSingle");
      }

      single() {
        return this.execute("single");
      }

      then(resolve, reject) {
        return this.execute().then(resolve, reject);
      }

      async execute(singleMode = "many") {
        let affected = [];
        if (this.operation === "insert") {
          affected = (Array.isArray(this.payload) ? this.payload : [this.payload]).map(clone);
          database[this.table].push(...affected);
        } else if (this.operation === "upsert") {
          const key = this.table === "profiles" ? "id" : "user_id";
          const incoming = clone(this.payload);
          const index = database[this.table].findIndex((row) => row[key] === incoming[key]);
          if (index === -1) {
            database[this.table].push(incoming);
          } else {
            database[this.table][index] = { ...database[this.table][index], ...incoming };
          }
          affected = [incoming];
        } else {
          affected = database[this.table].filter((row) =>
            this.filters.every(([column, value]) => row[column] === value)
          );
        }

        for (const [column, ascending] of this.orders.slice().reverse()) {
          affected.sort((left, right) => {
            if (left[column] === right[column]) return 0;
            const result = left[column] > right[column] ? 1 : -1;
            return ascending ? result : -result;
          });
        }
        affected = affected.slice(0, this.maxRows).map(clone);

        if (singleMode === "single") {
          return { data: affected[0] || null, error: affected.length === 1 ? null : new Error("single") };
        }
        if (singleMode === "maybeSingle") {
          return { data: affected[0] || null, error: affected.length <= 1 ? null : new Error("multiple") };
        }
        return { data: this.operation === "select" ? affected : null, error: null };
      }
    }

    function createClient() {
      return {
        auth: {
          async getUser() {
            return { data: { user: activeUser }, error: null };
          },
          async getSession() {
            return { data: { session: activeUser ? { user: activeUser } : null }, error: null };
          },
          async signUp({ email, password, options }) {
            if (users.has(email)) {
              return { data: {}, error: new Error("User already registered") };
            }
            const user = {
              id: `user-${nextId++}`,
              email,
              password,
              user_metadata: options?.data || {},
            };
            users.set(email, user);
            activeUser = user;
            return { data: { user, session: { user } }, error: null };
          },
          async signInWithPassword({ email, password }) {
            const user = users.get(email);
            if (!user || user.password !== password) {
              return { data: {}, error: new Error("Invalid login credentials") };
            }
            activeUser = user;
            return { data: { user }, error: null };
          },
          async signOut() {
            activeUser = null;
            return { error: null };
          },
        },
        from(table) {
          return new Query(table);
        },
      };
    }

    const module = await import(`/supabase-bridge.js?qa=${Date.now()}`);
    const bridge = await module.createSupabaseBridge({
      url: "https://qa-project.supabase.co",
      anonKey: "qa-anon-key",
      createClient,
    });

    const created = await bridge.signUp("Pedro QA", "kana-test-123");
    await bridge.saveProgress({
      userId: created.userId,
      userName: created.userName,
      progress: { xp: 125, charStats: { "hiragana:a": { hits: 3, misses: 0 } } },
      summary: {
        xp: 125,
        weeklyXp: 42,
        level: 2,
        rank: "Viajante",
        masteredCount: 1,
        dailyStreak: 3,
        bestDailyStreak: 4,
      },
    });
    const leaderboard = await bridge.loadLeaderboard();
    await bridge.signOut();
    const signedOutSession = await bridge.restoreSession();
    const signedIn = await bridge.signIn("Pedro QA", "kana-test-123");

    let mismatchRejected = false;
    try {
      await bridge.saveProgress({
        userId: "different-user",
        userName: "Pedro QA",
        progress: {},
        summary: {},
      });
    } catch {
      mismatchRejected = true;
    }

    return {
      created,
      leaderboard,
      signedOutSession,
      signedIn,
      mismatchRejected,
      rows: {
        profiles: database.profiles.length,
        progress: database.player_progress.length,
      },
    };
  });

  assert.equal(contract.created.userName, "Pedro QA");
  assert.equal(contract.rows.profiles, 1);
  assert.equal(contract.rows.progress, 1);
  assert.equal(contract.leaderboard[0].summary.xp, 125);
  assert.equal(contract.leaderboard[0].summary.weeklyXp, 42);
  assert.equal(contract.signedOutSession, null);
  assert.equal(contract.signedIn.progress.xp, 125);
  assert.equal(contract.mismatchRejected, true);
  assert.deepEqual(pageErrors, [], `Page errors: ${pageErrors.join(" | ")}`);
  assert.deepEqual(consoleErrors, [], `Console errors: ${consoleErrors.join(" | ")}`);

  console.log(
    JSON.stringify(
      {
        status: "ok",
        runtimeConfigFallback: true,
        cloudOperations: ["signup", "save", "restore", "signin", "signout", "leaderboard"],
        sessionMismatchRejected: true,
        rows: contract.rows,
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
