"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "node:crypto";
import { imageSize } from "image-size";

import { hasPermission } from "@/server/auth/permissions";
import { requireStaff } from "@/server/auth/session";
import { createClient } from "@/server/supabase/server";

const mediaTypes = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" } as const;

const slots = ["leaderboard", "mpu", "billboard"] as const;
function value(formData: FormData, name: string): string { const item = formData.get(name); return typeof item === "string" ? item.trim() : ""; }
function fail(reason: string): never { redirect(`/admin/ads?error=${reason}`); }
function editFail(id: string, reason: string): never { redirect(`/admin/ads/${id}/edit?error=${reason}`); }
function validId(id: string): boolean { return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id); }

export async function createCampaign(formData: FormData): Promise<void> {
  const actor = await requireStaff();
  if (!hasPermission(actor, "ad:manage")) fail("forbidden");
  const name = value(formData, "name");
  const slot = value(formData, "slot");
  const mediaId = value(formData, "media_id");
  const altText = value(formData, "alt_text");
  const destinationUrl = value(formData, "destination_url");
  const startsAt = new Date(value(formData, "starts_at"));
  const endsAt = new Date(value(formData, "ends_at"));
  if (!name || !slots.includes(slot as (typeof slots)[number]) || !mediaId || !altText || altText.length > 500 || !/^https:\/\//i.test(destinationUrl) || Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime()) || endsAt <= startsAt) fail("invalid_input");

  const supabase = await createClient();
  const overlap = await supabase.from("ad_campaigns").select("id").eq("slot", slot).eq("active", true).lt("starts_at", endsAt.toISOString()).gt("ends_at", startsAt.toISOString()).limit(1);
  if (overlap.error || overlap.data?.length) fail("overlap");
  const { error } = await supabase.from("ad_campaigns").insert({ name, slot, media_id: mediaId, alt_text: altText, destination_url: destinationUrl, starts_at: startsAt.toISOString(), ends_at: endsAt.toISOString(), created_by: actor.id, active: true });
  if (error) fail("save_failed");
  revalidatePath("/");
  revalidatePath("/admin/ads");
  redirect("/admin/ads?created=1");
}

export async function toggleCampaign(formData: FormData): Promise<void> {
  const actor = await requireStaff();
  if (!hasPermission(actor, "ad:manage")) fail("forbidden");
  const campaignId = value(formData, "campaign_id");
  const active = value(formData, "active") === "true";
  if (!campaignId) fail("invalid_input");
  const supabase = await createClient();
  const { error } = await supabase.from("ad_campaigns").update({ active: !active }).eq("id", campaignId);
  if (error) fail("save_failed");
  revalidatePath("/");
  revalidatePath("/admin/ads");
  redirect("/admin/ads?updated=1");
}

export async function updateCampaign(formData: FormData): Promise<void> {
  const actor = await requireStaff();
  const campaignId = value(formData, "campaign_id");
  if (!hasPermission(actor, "ad:manage")) editFail(campaignId, "forbidden");
  if (!validId(campaignId)) fail("invalid_input");

  const name = value(formData, "name");
  const slot = value(formData, "slot");
  const mediaId = value(formData, "media_id");
  const altText = value(formData, "alt_text");
  const destinationUrl = value(formData, "destination_url");
  const startsAt = new Date(value(formData, "starts_at"));
  const endsAt = new Date(value(formData, "ends_at"));
  const active = formData.get("active") === "on";
  if (!name || !slots.includes(slot as (typeof slots)[number]) || !mediaId || !altText || altText.length > 500 || !/^https:\/\//i.test(destinationUrl) || Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime()) || endsAt <= startsAt) editFail(campaignId, "invalid_input");

  const supabase = await createClient();
  if (active) {
    const overlap = await supabase.from("ad_campaigns").select("id").eq("slot", slot).eq("active", true).neq("id", campaignId).lt("starts_at", endsAt.toISOString()).gt("ends_at", startsAt.toISOString()).limit(1);
    if (overlap.error || overlap.data?.length) editFail(campaignId, "overlap");
  }
  const { error } = await supabase.from("ad_campaigns").update({ name, slot, media_id: mediaId, alt_text: altText, destination_url: destinationUrl, starts_at: startsAt.toISOString(), ends_at: endsAt.toISOString(), active }).eq("id", campaignId);
  if (error) editFail(campaignId, "save_failed");
  revalidatePath("/");
  revalidatePath("/admin/ads");
  revalidatePath(`/admin/ads/${campaignId}/edit`);
  redirect("/admin/ads?updated=1");
}

export async function uploadAdCreative(formData: FormData): Promise<void> {
  const actor = await requireStaff();
  if (!hasPermission(actor, "ad:manage")) fail("forbidden");
  const altText = value(formData, "creative_alt_text");
  const file = formData.get("creative_file");
  if (!altText || altText.length > 500 || !(file instanceof File) || file.size === 0 || file.size > 5 * 1024 * 1024) fail("invalid_media");
  const extension = mediaTypes[file.type as keyof typeof mediaTypes];
  if (!extension) fail("invalid_media");
  const bytes = Buffer.from(await file.arrayBuffer());
  let dimensions: { width?: number; height?: number };
  try { dimensions = imageSize(bytes); } catch { fail("invalid_media"); }
  if (!dimensions.width || !dimensions.height) fail("invalid_media");
  const storagePath = `ads/${actor.id}/${randomUUID()}.${extension}`;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "article-media";
  const supabase = await createClient();
  const upload = await supabase.storage.from(bucket).upload(storagePath, bytes, { contentType: file.type, cacheControl: "31536000", upsert: false });
  if (upload.error) {
    console.error("Ad creative storage upload failed", { message: upload.error.message, bucket });
    fail("upload_failed");
  }
  const metadata = await supabase.from("article_media").insert({ storage_path: storagePath, mime_type: file.type, byte_size: file.size, width: dimensions.width, height: dimensions.height, alt_text: altText, created_by: actor.id }).select("id").single();
  if (metadata.error || !metadata.data) {
    console.error("Ad creative metadata insert failed", { code: metadata.error?.code, message: metadata.error?.message });
    await supabase.storage.from(bucket).remove([storagePath]);
    fail("upload_failed");
  }
  revalidatePath("/admin/ads");
  redirect("/admin/ads?uploaded=1");
}
