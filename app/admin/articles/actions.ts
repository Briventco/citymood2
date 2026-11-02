"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "node:crypto";
import { imageSize } from "image-size";

import { canEditArticle, hasPermission } from "@/server/auth/permissions";
import { requireStaff } from "@/server/auth/session";
import { createClient } from "@/server/supabase/server";

function value(formData: FormData, name: string): string {
  const item = formData.get(name);
  return typeof item === "string" ? item.trim() : "";
}

function validSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

function validId(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

const allowedMedia = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
} as const;
const maxMediaBytes = 5 * 1024 * 1024;

export async function createDraft(formData: FormData): Promise<void> {
  const actor = await requireStaff();
  if (!hasPermission(actor, "article:create")) redirect("/admin?error=forbidden");

  const title = value(formData, "title");
  const slug = value(formData, "slug");
  const standfirst = value(formData, "standfirst");
  const body = value(formData, "body");
  const categoryId = value(formData, "category_id");

  if (!title || title.length > 300 || !validSlug(slug) || !body) {
    redirect("/admin/articles/new?error=invalid_input");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .insert({
      title,
      slug,
      standfirst,
      body,
      author_id: actor.id,
      category_id: categoryId || null,
      status: "draft",
    })
    .select("id")
    .single();

  if (error || !data) redirect("/admin/articles/new?error=save_failed");
  revalidatePath("/admin");
  redirect("/admin?created=1");
}

export async function publishArticle(formData: FormData): Promise<void> {
  const actor = await requireStaff();
  if (!hasPermission(actor, "article:publish")) redirect("/admin?error=forbidden");

  const articleId = value(formData, "article_id");
  if (!articleId) redirect("/admin?error=invalid_input");

  const supabase = await createClient();
  const { error } = await supabase
    .from("articles")
    .update({ status: "published", published_at: new Date().toISOString(), scheduled_for: null, unpublished_at: null })
    .eq("id", articleId);

  if (error) redirect("/admin?error=publish_failed");
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?published=1");
}

async function articleForWorkflow(articleId: string) {
  const supabase = await createClient();
  const result = await supabase.from("articles").select("id,author_id,status").eq("id", articleId).maybeSingle();
  if (result.error || !result.data) redirect("/admin?error=not_found");
  return { supabase, article: result.data };
}

export async function submitArticle(formData: FormData): Promise<void> {
  const actor = await requireStaff();
  if (!hasPermission(actor, "article:submit")) redirect("/admin?error=forbidden");
  const articleId = value(formData, "article_id");
  if (!validId(articleId)) redirect("/admin?error=invalid_input");
  const { supabase, article } = await articleForWorkflow(articleId);
  if (!canEditArticle(actor, article)) redirect("/admin?error=forbidden");
  const { error } = await supabase.from("articles").update({ status: "in_review", scheduled_for: null }).eq("id", article.id);
  if (error) redirect("/admin?error=workflow_failed");
  revalidatePath("/admin");
  redirect("/admin?submitted=1");
}

export async function scheduleArticle(formData: FormData): Promise<void> {
  const actor = await requireStaff();
  if (!hasPermission(actor, "article:publish")) redirect("/admin?error=forbidden");
  const articleId = value(formData, "article_id");
  const scheduleAt = value(formData, "scheduled_for");
  if (!validId(articleId)) redirect("/admin?error=invalid_input");
  const scheduledFor = new Date(scheduleAt);
  if (!scheduleAt || Number.isNaN(scheduledFor.getTime()) || scheduledFor.getTime() <= Date.now()) {
    redirect(`/admin/articles/${articleId}/edit?error=invalid_schedule`);
  }
  const { supabase, article } = await articleForWorkflow(articleId);
  const { error } = await supabase.from("articles").update({ status: "scheduled", scheduled_for: scheduledFor.toISOString(), published_at: null }).eq("id", article.id);
  if (error) redirect(`/admin/articles/${articleId}/edit?error=workflow_failed`);
  revalidatePath("/admin");
  redirect("/admin?scheduled=1");
}

export async function unpublishArticle(formData: FormData): Promise<void> {
  const actor = await requireStaff();
  if (!hasPermission(actor, "article:unpublish")) redirect("/admin?error=forbidden");
  const articleId = value(formData, "article_id");
  if (!validId(articleId)) redirect("/admin?error=invalid_input");
  const { supabase, article } = await articleForWorkflow(articleId);
  const { error } = await supabase.from("articles").update({ status: "unpublished", unpublished_at: new Date().toISOString() }).eq("id", article.id);
  if (error) redirect("/admin?error=workflow_failed");
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?unpublished=1");
}

export async function archiveArticle(formData: FormData): Promise<void> {
  const actor = await requireStaff();
  if (!hasPermission(actor, "article:unpublish")) redirect("/admin?error=forbidden");
  const articleId = value(formData, "article_id");
  if (!validId(articleId)) redirect("/admin?error=invalid_input");
  const { supabase, article } = await articleForWorkflow(articleId);
  const { error } = await supabase.from("articles").update({ status: "archived", scheduled_for: null }).eq("id", article.id);
  if (error) redirect("/admin?error=workflow_failed");
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?archived=1");
}

export async function updateArticleFlags(formData: FormData): Promise<void> {
  const actor = await requireStaff();
  if (!hasPermission(actor, "article:feature")) redirect("/admin?error=forbidden");
  const articleId = value(formData, "article_id");
  if (!validId(articleId)) redirect("/admin?error=invalid_input");
  const { supabase, article } = await articleForWorkflow(articleId);
  const { error } = await supabase.from("articles").update({
    featured: formData.get("featured") === "on",
    feature_people: formData.get("feature_people") === "on",
  }).eq("id", article.id);
  if (error) redirect(`/admin/articles/${articleId}/edit?error=workflow_failed`);
  revalidatePath("/");
  revalidatePath(`/admin/articles/${articleId}/edit`);
  redirect(`/admin/articles/${articleId}/edit?flags_updated=1`);
}

export async function updateArticle(formData: FormData): Promise<void> {
  const actor = await requireStaff();
  const articleId = value(formData, "article_id");
  if (!validId(articleId)) redirect("/admin?error=invalid_input");

  const title = value(formData, "title");
  const slug = value(formData, "slug");
  const standfirst = value(formData, "standfirst");
  const body = value(formData, "body");
  const categoryId = value(formData, "category_id");
  const tagIds = formData.getAll("tag_ids").filter((item): item is string => typeof item === "string" && validId(item));
  if (!title || title.length > 300 || !validSlug(slug) || !body) {
    redirect(`/admin/articles/${articleId}/edit?error=invalid_input`);
  }

  const supabase = await createClient();
  const { data: article, error: articleError } = await supabase
    .from("articles")
    .select("id,author_id,title,standfirst,body,category_id")
    .eq("id", articleId)
    .maybeSingle();

  if (articleError || !article) redirect("/admin?error=not_found");
  if (!canEditArticle(actor, { id: article.id, authorId: article.author_id })) {
    redirect("/admin?error=forbidden");
  }

  const { error } = await supabase.rpc("update_article_with_tags", {
    p_article_id: article.id,
    p_title: title,
    p_slug: slug,
    p_standfirst: standfirst,
    p_body: body,
    p_category_id: categoryId || null,
    p_tag_ids: [...new Set(tagIds)],
  });
  if (error) redirect(`/admin/articles/${articleId}/edit?error=save_failed`);

  revalidatePath("/admin");
  revalidatePath(`/admin/articles/${articleId}/edit`);
  revalidatePath(`/article/${slug}`);
  redirect("/admin?updated=1");
}

export async function restoreArticleRevision(formData: FormData): Promise<void> {
  await requireStaff();
  const revisionId = value(formData, "revision_id");
  const articleId = value(formData, "article_id");
  if (!validId(revisionId) || !validId(articleId)) redirect("/admin?error=invalid_input");
  const supabase = await createClient();
  const { error } = await supabase.rpc("restore_article_revision", { p_revision_id: revisionId });
  if (error) redirect(`/admin/articles/${articleId}/edit?error=restore_failed`);
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/admin/articles/${articleId}/edit`);
  redirect(`/admin/articles/${articleId}/edit?restored=1`);
}

export async function uploadArticleMedia(formData: FormData): Promise<void> {
  const actor = await requireStaff();
  const articleId = value(formData, "article_id");
  const altText = value(formData, "alt_text");
  const caption = value(formData, "caption");
  const credit = value(formData, "credit");
  const file = formData.get("file");

  if (!validId(articleId) || !altText || altText.length > 500 || !(file instanceof File) || file.size === 0) {
    redirect(`/admin/articles/${articleId}/edit?error=invalid_media`);
  }

  const extension = allowedMedia[file.type as keyof typeof allowedMedia];
  if (!extension || file.size > maxMediaBytes) {
    redirect(`/admin/articles/${articleId}/edit?error=invalid_media`);
  }

  const supabase = await createClient();
  const { data: article, error: articleError } = await supabase
    .from("articles")
    .select("id,author_id")
    .eq("id", articleId)
    .maybeSingle();
  if (articleError || !article) redirect("/admin?error=not_found");
  if (!canEditArticle(actor, { id: article.id, authorId: article.author_id }) && !hasPermission(actor, "media:upload")) {
    redirect("/admin?error=forbidden");
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  let dimensions: { width?: number; height?: number };
  try {
    dimensions = imageSize(bytes);
  } catch {
    redirect(`/admin/articles/${articleId}/edit?error=invalid_media`);
  }
  if (!dimensions.width || !dimensions.height) {
    redirect(`/admin/articles/${articleId}/edit?error=invalid_media`);
  }

  const storagePath = `${articleId}/${randomUUID()}.${extension}`;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "article-media";
  const { error: uploadError } = await supabase.storage.from(bucket).upload(storagePath, bytes, {
    contentType: file.type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (uploadError) redirect(`/admin/articles/${articleId}/edit?error=upload_failed`);

  const { error: metadataError } = await supabase.from("article_media").insert({
    article_id: articleId,
    storage_path: storagePath,
    mime_type: file.type,
    byte_size: file.size,
    width: dimensions.width,
    height: dimensions.height,
    alt_text: altText,
    caption: caption || null,
    credit: credit || null,
    created_by: actor.id,
  });
  if (metadataError) {
    await supabase.storage.from(bucket).remove([storagePath]);
    redirect(`/admin/articles/${articleId}/edit?error=upload_failed`);
  }

  revalidatePath(`/admin/articles/${articleId}/edit`);
  redirect(`/admin/articles/${articleId}/edit?uploaded=1`);
}
