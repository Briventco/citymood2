import { assertServerRuntime } from "./runtime";

assertServerRuntime();

type Environment = Record<string, string | undefined>;

export type ServerEnvironment = {
  supabaseUrl: string | null;
  supabasePublishableKey: string | null;
  supabaseSecretKey: string | null;
  supabaseStorageBucket: string | null;
  revalidationSecret: string | null;
  metaAppId: string | null;
  metaAppSecret: string | null;
  metaRedirectUri: string | null;
  metaTokenEncryptionKey: string | null;
  metaGraphVersion: string;
  metaWebhookVerifyToken: string | null;
};

/**
 * Read server configuration without exposing secret values to client code.
 * null is intentional during the foundation phase: the app can continue to
 * use the existing empty content source until infrastructure is approved.
 */
export function readServerEnvironment(environment: Environment = process.env): ServerEnvironment {
  return {
    supabaseUrl: environment.NEXT_PUBLIC_SUPABASE_URL ?? null,
    supabasePublishableKey: environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? null,
    supabaseSecretKey: environment.SUPABASE_SECRET_KEY ?? environment.SUPABASE_SERVICE_ROLE_KEY ?? null,
    supabaseStorageBucket: environment.SUPABASE_STORAGE_BUCKET ?? null,
    revalidationSecret: environment.REVALIDATION_SECRET ?? null,
    metaAppId: environment.META_APP_ID ?? null,
    metaAppSecret: environment.META_APP_SECRET ?? null,
    metaRedirectUri: environment.META_REDIRECT_URI ?? null,
    metaTokenEncryptionKey: environment.META_TOKEN_ENCRYPTION_KEY ?? null,
    metaGraphVersion: environment.META_GRAPH_VERSION ?? "v26.0",
    metaWebhookVerifyToken: environment.META_WEBHOOK_VERIFY_TOKEN ?? null,
  };
}

export function requireProductionEnvironment(
  environment: ServerEnvironment = readServerEnvironment(),
): ServerEnvironment {
  const missing = Object.entries(environment)
    .filter(([, value]) => value === null)
    .map(([name]) => name);

  if (process.env.NODE_ENV === "production" && missing.length > 0) {
    throw new Error("Missing production backend configuration: " + missing.join(", "));
  }

  return environment;
}
