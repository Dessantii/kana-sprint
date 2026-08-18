const authStorageKey = "kanaSprintSupabaseAuthV1";
const supabaseModuleUrl = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
let createClientPromise = null;

async function resolveCreateClient(injectedCreateClient) {
  if (typeof injectedCreateClient === "function") {
    return injectedCreateClient;
  }

  createClientPromise ||= import(supabaseModuleUrl).then((module) => module.createClient);
  const createClient = await createClientPromise;
  if (typeof createClient !== "function") {
    throw new Error("Cliente Supabase indisponivel.");
  }
  return createClient;
}

function slugifyUserName(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30);
}

function buildAuthEmail(userName) {
  const slug = slugifyUserName(userName) || "jogador";
  return `${slug}@kana-sprint.app`;
}

function normalizeProgressPayload(progress) {
  return progress && typeof progress === "object" ? progress : {};
}

function isUniqueViolation(error) {
  const message = String(error?.message || "").toLowerCase();
  return error?.code === "23505" || message.includes("duplicate key");
}

function toLeaderboardEntry(row) {
  return {
    userName: row.display_name,
    summary: {
      xp: row.xp || 0,
      weeklyXp: row.weekly_xp || 0,
      level: row.level || 1,
      rank: row.rank_title || "Novato",
      masteredCount: row.mastered_count || 0,
      dailyStreak: row.current_streak || 0,
      bestDailyStreak: row.best_daily_streak || 0,
    },
  };
}

export async function createSupabaseBridge({ url, anonKey, createClient: injectedCreateClient }) {
  if (!url || !anonKey) {
    throw new Error("Configuracao do Supabase incompleta.");
  }

  const createClient = await resolveCreateClient(injectedCreateClient);
  const client = createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: authStorageKey,
    },
  });

  async function getActiveUser() {
    const { data, error } = await client.auth.getUser();
    if (error) {
      throw error;
    }
    return data.user;
  }

  async function ensureProfileRow(user, displayName) {
    const fallbackName =
      displayName ||
      user.user_metadata?.display_name ||
      user.email?.split("@")[0] ||
      "Jogador";

    const { data: existing, error: existingError } = await client
      .from("profiles")
      .select(
        "id, display_name, xp, weekly_xp, level, rank_title, mastered_count, current_streak, best_daily_streak"
      )
      .eq("id", user.id)
      .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    if (existing) {
      return existing;
    }

    const { data, error } = await client
      .from("profiles")
      .insert({
        id: user.id,
        display_name: fallbackName,
        xp: 0,
        weekly_xp: 0,
        level: 1,
        rank_title: "Novato",
        mastered_count: 0,
        current_streak: 0,
        best_daily_streak: 0,
        updated_at: new Date().toISOString(),
      })
      .select(
        "id, display_name, xp, weekly_xp, level, rank_title, mastered_count, current_streak, best_daily_streak"
      )
      .single();

    if (error) {
      if (isUniqueViolation(error)) {
        const { data: racedProfile, error: racedError } = await client
          .from("profiles")
          .select(
            "id, display_name, xp, weekly_xp, level, rank_title, mastered_count, current_streak, best_daily_streak"
          )
          .eq("id", user.id)
          .maybeSingle();
        if (!racedError && racedProfile) {
          return racedProfile;
        }
      }
      throw error;
    }

    return data;
  }

  async function ensureProgressRow(userId) {
    const { data: existing, error: existingError } = await client
      .from("player_progress")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (existingError) {
      throw existingError;
    }

    if (existing) {
      return existing;
    }

    const { error } = await client.from("player_progress").insert({
      user_id: userId,
      payload: {},
      updated_at: new Date().toISOString(),
    });

    if (error && !isUniqueViolation(error)) {
      throw error;
    }

    return { user_id: userId };
  }

  async function loadProgressRow(userId) {
    const { data, error } = await client
      .from("player_progress")
      .select("payload")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return normalizeProgressPayload(data?.payload);
  }

  async function loadLeaderboard(limit = 25) {
    const { data, error } = await client
      .from("profiles")
      .select(
        "display_name, xp, weekly_xp, level, rank_title, mastered_count, current_streak, best_daily_streak"
      )
      .order("xp", { ascending: false })
      .order("mastered_count", { ascending: false })
      .order("display_name", { ascending: true })
      .limit(limit);

    if (error) {
      throw error;
    }

    return (data || []).map(toLeaderboardEntry);
  }

  async function getUserBundle(user, displayName) {
    const profile = await ensureProfileRow(user, displayName);
    await ensureProgressRow(user.id);
    const progress = await loadProgressRow(user.id);
    const leaderboard = await loadLeaderboard();

    return {
      userId: user.id,
      userName: profile.display_name,
      progress,
      leaderboard,
    };
  }

  return {
    enabled: true,
    async restoreSession() {
      const { data, error } = await client.auth.getSession();
      if (error) {
        throw error;
      }

      if (!data.session?.user) {
        return null;
      }

      return getUserBundle(data.session.user);
    },
    async signIn(userName, password) {
      const { data, error } = await client.auth.signInWithPassword({
        email: buildAuthEmail(userName),
        password,
      });

      if (error) {
        throw error;
      }
      if (!data.user) {
        throw new Error("Sessao indisponivel.");
      }

      return getUserBundle(data.user, userName);
    },
    async signUp(userName, password) {
      const { data, error } = await client.auth.signUp({
        email: buildAuthEmail(userName),
        password,
        options: {
          data: {
            display_name: userName,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error("Nao foi possivel criar a conta.");
      }

      if (!data.session) {
        return {
          pendingConfirmation: true,
        };
      }

      return getUserBundle(data.user, userName);
    },
    async saveProgress({ userId, userName, progress, summary }) {
      const activeUser = await getActiveUser();
      if (!activeUser?.id) {
        throw new Error("Sessao indisponivel.");
      }
      if (userId && activeUser.id !== userId) {
        throw new Error("A sessao ativa nao corresponde ao progresso salvo.");
      }

      const safeSummary = summary && typeof summary === "object" ? summary : {};
      const profilePayload = {
        id: activeUser.id,
        display_name: userName,
        xp: safeSummary.xp || 0,
        weekly_xp: safeSummary.weeklyXp || 0,
        level: safeSummary.level || 1,
        rank_title: safeSummary.rank || "Novato",
        mastered_count: safeSummary.masteredCount || 0,
        current_streak: safeSummary.dailyStreak || 0,
        best_daily_streak: safeSummary.bestDailyStreak || 0,
        updated_at: new Date().toISOString(),
      };

      const progressPayload = {
        user_id: activeUser.id,
        payload: normalizeProgressPayload(progress),
        updated_at: new Date().toISOString(),
      };

      const { error: profileError } = await client
        .from("profiles")
        .upsert(profilePayload, { onConflict: "id" });

      if (profileError) {
        throw profileError;
      }

      const { error: progressError } = await client
        .from("player_progress")
        .upsert(progressPayload, { onConflict: "user_id" });

      if (progressError) {
        throw progressError;
      }
    },
    async signOut() {
      const { error } = await client.auth.signOut();
      if (error) {
        throw error;
      }
    },
    async loadLeaderboard(limit = 25) {
      return loadLeaderboard(limit);
    },
  };
}
