import { NextResponse } from "next/server";

import { hasPermission } from "@/server/auth/permissions";
import { getCurrentActor } from "@/server/auth/session";
import { encryptMetaToken } from "@/server/meta/crypto";
import { readMetaConfiguration } from "@/server/meta/config";
import { graphUrl, isValidOAuthState, metaJson, metaOAuthStateCookie } from "@/server/meta/oauth";
import { createAdminClient } from "@/server/supabase/admin";

type PageAsset = { id: string; name: string; access_token: string; instagram_business_account?: { id: string; username?: string } };
type PagesResponse = { data?: PageAsset[] };
type TokenResponse = { access_token: string };

function result(request: Request, status: "connected" | "failed", count = 0) {
  const url = new URL("/admin", request.url);
  url.searchParams.set("meta", status);
  if (count) url.searchParams.set("count", String(count));
  return NextResponse.redirect(url);
}

export async function GET(request: Request) {
  const actor = await getCurrentActor();
  const url = new URL(request.url);
  const response = actor && hasPermission(actor, "social:publish")
    ? await connect(request, url.searchParams.get("code"), url.searchParams.get("state"), url.searchParams.get("error"), actor.id)
    : result(request, "failed");
  response.cookies.delete(metaOAuthStateCookie);
  return response;
}

async function connect(request: Request, code: string | null, state: string | null, oauthError: string | null, actorId: string) {
  const stateCookie = request.headers.get("cookie")?.split(";").map((item) => item.trim()).find((item) => item.startsWith(`${metaOAuthStateCookie}=`))?.split("=").slice(1).join("=");
  if (oauthError || !code || !state || !stateCookie || !isValidOAuthState(state, stateCookie)) return result(request, "failed");
  const configuration = readMetaConfiguration();
  if (!configuration.appId || !configuration.appSecret || !configuration.redirectUri) return result(request, "failed");

  try {
    const token = await metaJson<TokenResponse>(graphUrl("/oauth/access_token", {
      client_id: configuration.appId,
      client_secret: configuration.appSecret,
      redirect_uri: configuration.redirectUri,
      code,
    }));
    const pages = await metaJson<PagesResponse>(graphUrl("/me/accounts", {
      access_token: token.access_token,
      fields: "id,name,access_token,instagram_business_account{id,username}",
    }));
    const supabase = createAdminClient();
    let connected = 0;
    for (const page of pages.data ?? []) {
      connected += await saveConnection(supabase, "meta_facebook", page.id, page.name, page.access_token, actorId);
      if (page.instagram_business_account) {
        connected += await saveConnection(supabase, "meta_instagram", page.instagram_business_account.id, page.instagram_business_account.username ?? page.name, page.access_token, actorId);
      }
    }
    return result(request, connected ? "connected" : "failed", connected);
  } catch (error) {
    console.error("Meta OAuth connection failed", { message: error instanceof Error ? error.message : "unknown error" });
    return result(request, "failed");
  }
}

async function saveConnection(supabase: ReturnType<typeof createAdminClient>, platform: "meta_facebook" | "meta_instagram", accountId: string, accountName: string, accessToken: string, actorId: string) {
  const encrypted = encryptMetaToken(accessToken);
  const connection = await supabase.from("social_connections").upsert({ platform, account_id: accountId, account_name: accountName, scopes: [], status: "active", connected_by: actorId }, { onConflict: "platform,account_id" }).select("id").single();
  if (connection.error || !connection.data) throw connection.error ?? new Error("Meta connection was not saved.");
  const secret = await supabase.from("social_connection_secrets").upsert({ connection_id: connection.data.id, token_ciphertext: encrypted.ciphertext, token_nonce: encrypted.nonce, token_expires_at: null }, { onConflict: "connection_id" });
  if (secret.error) throw secret.error;
  return 1;
}
