import Link from "next/link";
import { notFound } from "next/navigation";

import { updateCampaign } from "@/app/admin/ads/actions";
import { hasPermission } from "@/server/auth/permissions";
import { requireStaff } from "@/server/auth/session";
import { createClient } from "@/server/supabase/server";

type EditCampaignPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ error?: string }>;
};

const feedback: Record<string, string> = {
  invalid_input: "Check the campaign fields and try again.",
  overlap: "An active campaign already occupies that slot during the selected dates.",
  save_failed: "The campaign could not be updated. Check the server log for the safe database error.",
  forbidden: "Your account does not have permission to manage advertising.",
};

export default async function EditCampaignPage({ params, searchParams }: EditCampaignPageProps) {
  const actor = await requireStaff();
  if (!hasPermission(actor, "ad:manage")) return <p role="alert">You do not have permission to manage advertising.</p>;
  const { id } = await params;
  const query = await searchParams;
  const supabase = await createClient();
  const [campaignResult, mediaResult] = await Promise.all([
    supabase.from("ad_campaigns").select("id,name,slot,media_id,alt_text,destination_url,starts_at,ends_at,active").eq("id", id).maybeSingle(),
    supabase.from("article_media").select("id,alt_text,width,height,created_at").order("created_at", { ascending: false }).limit(100),
  ]);
  if (campaignResult.error || !campaignResult.data) notFound();
  const campaign = campaignResult.data;
  const message = query?.error ? feedback[query.error] ?? "The advertising request could not be completed." : null;

  return (
    <section>
      <Link href="/admin/ads" className="text-sm font-bold underline">← Back to advertising</Link>
      <div className="mt-5 border-t-[6px] border-cm-black pt-3"><p className="text-cm-kicker font-extrabold uppercase tracking-cm-caps">Commercial</p><h1 className="font-serif text-cm-feature font-bold">Edit campaign</h1></div>
      {message && <p role="alert" className="mt-5 border-l-4 border-cm-black bg-cm-paper px-4 py-3">{message}</p>}
      <form action={updateCampaign} className="mt-8 grid gap-4 border-y border-cm-rule py-5 lg:grid-cols-2">
        <input type="hidden" name="campaign_id" value={campaign.id} />
        <label className="grid gap-2 font-bold">Campaign name<input name="name" required defaultValue={campaign.name} className="h-11 border border-cm-black px-3" /></label>
        <label className="grid gap-2 font-bold">Slot<select name="slot" defaultValue={campaign.slot} className="h-11 border border-cm-black bg-cm-white px-3"><option value="leaderboard">Leaderboard</option><option value="mpu">MPU</option><option value="billboard">Billboard</option></select></label>
        <label className="grid gap-2 font-bold">Creative<select name="media_id" required defaultValue={campaign.media_id ?? ""} className="h-11 border border-cm-black bg-cm-white px-3"><option value="">Select uploaded media</option>{(mediaResult.data ?? []).map((item) => <option key={item.id} value={item.id}>{item.alt_text} ({item.width}×{item.height})</option>)}</select></label>
        <label className="grid gap-2 font-bold">Alt text<input name="alt_text" required maxLength={500} defaultValue={campaign.alt_text} className="h-11 border border-cm-black px-3" /></label>
        <label className="grid gap-2 font-bold">Destination URL<input name="destination_url" type="url" pattern="https://.*" required defaultValue={campaign.destination_url} className="h-11 border border-cm-black px-3" /></label>
        <div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2 font-bold">Starts<input name="starts_at" type="datetime-local" required defaultValue={campaign.starts_at.slice(0, 16)} className="h-11 border border-cm-black px-3" /></label><label className="grid gap-2 font-bold">Ends<input name="ends_at" type="datetime-local" required defaultValue={campaign.ends_at.slice(0, 16)} className="h-11 border border-cm-black px-3" /></label></div>
        <label className="flex min-h-11 items-center gap-3 font-bold"><input name="active" type="checkbox" defaultChecked={campaign.active} className="h-5 w-5" /> Active campaign</label>
        <div className="flex flex-wrap gap-3"><button className="min-h-11 bg-cm-black px-4 font-bold text-cm-white">Save campaign</button><Link href="/admin/ads" className="min-h-11 border-2 border-cm-black px-4 py-2 font-bold">Cancel</Link></div>
      </form>
    </section>
  );
}
