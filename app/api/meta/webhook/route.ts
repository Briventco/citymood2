import { createHmac, timingSafeEqual } from "node:crypto";

import { NextResponse } from "next/server";

import { readMetaConfiguration } from "@/server/meta/config";

function matches(actual: string, expected: string): boolean {
  const actualBytes = Buffer.from(actual);
  const expectedBytes = Buffer.from(expected);
  return actualBytes.length === expectedBytes.length && timingSafeEqual(actualBytes, expectedBytes);
}

export async function GET(request: Request) {
  const configuration = readMetaConfiguration();
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");
  if (mode === "subscribe" && challenge && configuration.webhookVerifyToken && token && matches(token, configuration.webhookVerifyToken)) {
    return new NextResponse(challenge, { status: 200, headers: { "content-type": "text/plain" } });
  }
  return NextResponse.json({ error: "Webhook verification failed" }, { status: 403 });
}

export async function POST(request: Request) {
  const configuration = readMetaConfiguration();
  if (!configuration.appSecret) return NextResponse.json({ error: "Webhook is not configured" }, { status: 503 });
  const body = await request.text();
  const signature = request.headers.get("x-hub-signature-256") ?? "";
  const expected = `sha256=${createHmac("sha256", configuration.appSecret).update(body).digest("hex")}`;
  if (!matches(signature, expected)) return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  try {
    const payload = JSON.parse(body) as { object?: string; entry?: unknown[] };
    console.info("Meta webhook received", { object: payload.object ?? "unknown", entries: payload.entry?.length ?? 0 });
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  return NextResponse.json({ received: true });
}
