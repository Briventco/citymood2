import Link from "next/link";

import { createCampaign, toggleCampaign, uploadAdCreative } from "@/app/admin/ads/actions";
import { hasPermission } from "@/server/auth/permissions";
import { requireStaff } from "@/server/auth/session";
import { createClient } from "@/server/supabase/server";

export default async function AdsPage() {
  const actor = await requireStaff();
  if (!hasPermission(actor, "ad:manage")) return <p role="alert">You do not have permission to manage advertising.</p>;
  const supabase = await createClient();
  const [{ data: campaigns }, { data: media }] = await Promise.all([
    supabase.from("ad_campaigns").select("id,name,slot,alt_text,destination_url,starts_at,ends_at,active,media:article_media(storage_path,width,height)").order("starts_at", { ascending: false }),
    supabase.from("article_media").select("id,alt_text,width,height,created_at").order("created_at", { ascending: false }).limit(100),
  ]);
  return (
    <section>
      <Link href="/admin" className="text-sm font-bold underline">← Back to newsroom</Link>
      <div className="mt-5 border-t-[6px] border-cm-black pt-3"><p className="text-cm-kicker font-extrabold uppercase tracking-cm-caps">Commercial</p><h1 className="font-serif text-cm-feature font-bold">Advertising campaigns</h1></div>
      <form action={createCampaign} className="mt-8 grid gap-4 border-y border-cm-rule py-5 lg:grid-cols-2">
        <label className="grid gap-2 font-bold">Campaign name<input name="name" required className="h-11 border border-cm-black px-3" /></label>
        <label className="grid gap-2 font-bold">Slot<select name="slot" className="h-11 border border-cm-black bg-cm-white px-3"><option value="leaderboard">Leaderboard</option><option value="mpu">MPU</option><option value="billboard">Billboard</option></select></label>
        <label className="grid gap-2 font-bold">Creative<select name="media_id" required className="h-11 border border-cm-black bg-cm-white px-3"><option value="">Select uploaded media</option>{(media ?? []).map((item) => <option key={item.id} value={item.id}>{item.alt_text} ({item.width}×{item.height})</option>)}</select></label>
        <label className="grid gap-2 font-bold">Alt text<input name="alt_text" required maxLength={500} className="h-11 border border-cm-black px-3" /></label>
        <label className="grid gap-2 font-bold">Destination URL<input name="destination_url" type="url" pattern="https://.*" required placeholder="https://example.com" className="h-11 border border-cm-black px-3" /></label>
        <div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2 font-bold">Starts<input name="starts_at" type="datetime-local" required className="h-11 border border-cm-black px-3" /></label><label className="grid gap-2 font-bold">Ends<input name="ends_at" type="datetime-local" required className="h-11 border border-cm-black px-3" /></label></div>
        <button className="min-h-11 w-fit bg-cm-black px-4 font-bold text-cm-white">Create campaign</button>
      </form>
      <form action={uploadAdCreative} className="mt-8 grid gap-3 border-b border-cm-rule pb-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <label className="grid gap-2 font-bold">Creative file<input name="creative_file" type="file" accept="image/jpeg,image/png,image/webp,image/avif" required className="min-h-11 border border-cm-black p-2" /></label>
        <label className="grid gap-2 font-bold">Creative alt text<input name="creative_alt_text" required maxLength={500} className="h-11 border border-cm-black px-3" /></label>
        <button className="min-h-11 bg-cm-black px-4 font-bold text-cm-white">Upload creative</button>
      </form>
      <ul className="mt-8 divide-y divide-cm-rule border-t border-cm-rule">{(campaigns ?? []).map((campaign) => <li key={campaign.id} className="grid gap-3 py-5 lg:grid-cols-[1fr_auto] lg:items-center"><div><p className="font-bold">{campaign.name} · {campaign.slot}</p><p className="text-sm text-cm-meta">{campaign.active ? "Active" : "Inactive"} · {new Date(campaign.starts_at).toLocaleString()} – {new Date(campaign.ends_at).toLocaleString()}</p><a href={campaign.destination_url} rel="noopener noreferrer" className="text-sm underline">{campaign.destination_url}</a></div><form action={toggleCampaign}><input type="hidden" name="campaign_id" value={campaign.id} /><input type="hidden" name="active" value={String(campaign.active)} /><button className="min-h-11 border-2 border-cm-black px-3 text-sm font-bold">{campaign.active ? "Deactivate" : "Activate"}</button></form></li>)}</ul>
    </section>
  );
}
