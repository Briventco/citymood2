import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { readServerEnvironment } from "@/server/env";
import { createAdminClient } from "@/server/supabase/admin";
import { allowRequest } from "@/server/security/rate-limit";

export async function GET(request: Request) {
  const secret = readServerEnvironment().revalidationSecret;
  const authorization = request.headers.get("authorization");
  if (!secret || authorization !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!allowRequest("cron:publish", 2, 60_000)) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("publish_due_articles");
  if (error) return NextResponse.json({ error: "Publication job failed" }, { status: 500 });
  if (Number(data) > 0) revalidatePath("/");
  return NextResponse.json({ published: Number(data) });
}
