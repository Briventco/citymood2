import "server-only";

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

import { readMetaConfiguration } from "@/server/meta/config";

export const metaOAuthStateCookie = "citymood_meta_oauth_state";
export const metaOAuthScopes = ["pages_show_list", "pages_manage_posts", "pages_read_engagement", "instagram_basic", "instagram_content_publish"];

export function createOAuthState(): string {
  const configuration = readMetaConfiguration();
  if (!configuration.appSecret) throw new Error("Meta App Secret is not configured.");
  const value = randomBytes(32).toString("hex");
  const signature = createHmac("sha256", configuration.appSecret).update(value).digest("hex");
  return `${value}.${signature}`;
}

export function isValidOAuthState(value: string, expected: string): boolean {
  const configuration = readMetaConfiguration();
  if (!configuration.appSecret || !value || value !== expected) return false;
  const [nonce, signature] = value.split(".");
  if (!nonce || !signature) return false;
  const expectedSignature = createHmac("sha256", configuration.appSecret).update(nonce).digest("hex");
  const actual = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expectedSignature, "hex");
  return actual.length === expectedBuffer.length && timingSafeEqual(actual, expectedBuffer);
}

export function graphUrl(path: string, parameters: Record<string, string>): string {
  const configuration = readMetaConfiguration();
  const url = new URL(`https://graph.facebook.com/${configuration.graphVersion}${path}`);
  Object.entries(parameters).forEach(([name, value]) => url.searchParams.set(name, value));
  return url.toString();
}

export async function metaJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { cache: "no-store" });
  const body = await response.json() as T & { error?: { code?: string; message?: string } };
  if (!response.ok || body.error) {
    const error = body.error;
    throw new Error(`Meta API request failed: ${error?.code ?? response.status} ${error?.message ?? "unknown error"}`);
  }
  return body;
}
