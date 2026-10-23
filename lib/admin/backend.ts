import "server-only";
import path from "node:path";
import { asUser, ANON, type Actor } from "./dev-store/database";
import { createDevPublicReader, createDevRepo } from "./dev-store/repo";
import { buildSeed } from "./dev-store/seed";
import { fileStore, type DevStore } from "./dev-store/store";
import type { NewsroomPublicReader, NewsroomRepo } from "./repo";
import type { Uuid } from "./types";

// The one place that decides which backend the newsroom uses. Today: the dev
// JSON store. When Supabase arrives, these three functions return Supabase-backed
// implementations of the same interfaces and nothing else changes.

/** The dev store runs in development, or in a production build only when ADMIN_DEV_STORE=1 (local demos). */
export const devStoreEnabled = process.env.NODE_ENV !== "production" || process.env.ADMIN_DEV_STORE === "1";

const STORE_PATH = process.env.ADMIN_DEV_STORE_PATH ?? path.join(process.cwd(), "data", "admin-dev.json");

const globalStore = globalThis as unknown as { __cityMoodDevStore?: DevStore };

export function devStore(): DevStore {
  if (!devStoreEnabled) throw new Error("The newsroom backend is not connected.");
  globalStore.__cityMoodDevStore ??= fileStore(STORE_PATH, () => buildSeed());
  return globalStore.__cityMoodDevStore;
}

/** A repo bound to one user (or anon), like a Supabase client carrying that session. */
export function repoFor(uid: Uuid | null): NewsroomRepo {
  const actor: Actor = uid ? asUser(uid) : ANON;
  return createDevRepo(devStore(), actor);
}

/** Reader for the public site, with anon rights only. */
export function publicReader(): NewsroomPublicReader {
  return createDevPublicReader(devStore());
}
