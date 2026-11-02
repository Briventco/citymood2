import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { createClient } from "@/server/supabase/server";
import { allowRequest } from "@/server/security/rate-limit";

type ViewRouteProps = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: ViewRouteProps) {
  const { id } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return NextResponse.json({ recorded: false }, { status: 400 });
  }

  const headerStore = await headers();
  const forwarded = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
  const address = forwarded || headerStore.get("x-real-ip") || "unknown";
  if (!allowRequest(`view:${address}`, 60, 60_000)) return NextResponse.json({ recorded: false }, { status: 429 });
  const userAgent = headerStore.get("user-agent") ?? "unknown";
  const visitorHash = createHash("sha256").update(`${address}|${userAgent}`).digest("hex");

  const supabase = await createClient();
  const { error } = await supabase.rpc("record_article_view", {
    p_article_id: id,
    p_visitor_hash: visitorHash,
  });
  if (error) return NextResponse.json({ recorded: false }, { status: 202 });
  return NextResponse.json({ recorded: true }, { status: 202 });
}
