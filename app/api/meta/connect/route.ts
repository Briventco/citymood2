import { NextResponse } from "next/server";

import { hasPermission } from "@/server/auth/permissions";
import { getCurrentActor } from "@/server/auth/session";
import { readMetaConfiguration } from "@/server/meta/config";
import { createOAuthState, metaOAuthScopes, metaOAuthStateCookie } from "@/server/meta/oauth";

export async function GET(request: Request) {
  const actor = await getCurrentActor();
  if (!actor || actor.status !== "active") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasPermission(actor, "social:publish")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const configuration = readMetaConfiguration();
  if (!configuration.appId || !configuration.appSecret || !configuration.redirectUri || !configuration.tokenEncryptionKey) {
    return NextResponse.json({ error: "Meta integration is not configured" }, { status: 503 });
  }

  const state = createOAuthState();
  const loginUrl = new URL(`https://www.facebook.com/${configuration.graphVersion}/dialog/oauth`);
  loginUrl.searchParams.set("client_id", configuration.appId);
  loginUrl.searchParams.set("redirect_uri", configuration.redirectUri);
  loginUrl.searchParams.set("state", state);
  loginUrl.searchParams.set("response_type", "code");
  loginUrl.searchParams.set("scope", metaOAuthScopes.join(","));

  const response = NextResponse.redirect(loginUrl);
  response.cookies.set(metaOAuthStateCookie, state, {
    httpOnly: true,
    secure: new URL(request.url).protocol === "https:",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  return response;
}
