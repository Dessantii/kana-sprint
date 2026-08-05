import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const authStorageKey = "kanaSprintSupabaseAuthV1";

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

function toLeaderboardEntry(row) {
  return {
    userName: row.display_name,
    summary: {
      xp: row.xp || 0,
      level: row.level || 1,
      rank: row.rank_title || "Novato",
      masteredCount: row.mastered_count || 0,
    },
  };
}

export function createSupabaseBridge({ url, anonKey }) {
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
      .select("id, display_name, xp, level, rank_title, mastered_count")
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
        level: 1,
        rank_title: "Novato",
        mastered_count: 0,
        updated_at: new Date().toISOString(),
      })
      .select("id, display_name, xp, level, rank_title, mastered_count")
      .single();

    if (error) {
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

    if (error) {
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
      .select("display_name, xp, level, rank_title, mastered_count")
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
      const activeUser = userId ? { id: userId } : await getActiveUser();
      if (!activeUser?.id) {
        throw new Error("Sessao indisponivel.");
      }

      const profilePayload = {
        id: activeUser.id,
        display_name: userName,
        xp: summary.xp || 0,
        level: summary.level || 1,
        rank_title: summary.rank || "Novato",
        mastered_count: summary.masteredCount || 0,
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
