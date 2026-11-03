import Link from "next/link";
import { ArrowLeft, Megaphone, Upload } from "lucide-react";

import { createCampaign, toggleCampaign, uploadAdCreative } from "@/app/admin/ads/actions";
import { hasPermission } from "@/server/auth/permissions";
import { requireStaff } from "@/server/auth/session";
import { createClient } from "@/server/supabase/server";

const fieldLabel = "text-xs font-extrabold uppercase tracking-cm-caps text-cm-meta";
const fieldInput =
  "h-12 border-2 border-cm-rule bg-cm-white px-3 text-sm text-cm-black transition-colors duration-150 placeholder:text-cm-meta focus:border-cm-black focus:outline-none";
const btnPrimary =
  "inline-flex min-h-12 w-fit items-center gap-2 border-2 border-cm-black bg-cm-lime px-5 text-xs font-extrabold uppercase tracking-cm-caps text-cm-black transition-colors duration-150 hover:bg-cm-black hover:text-cm-lime";
const btnOutline =
  "inline-flex min-h-11 items-center justify-center border-2 border-cm-black px-3 text-xs font-extrabold uppercase tracking-cm-caps text-cm-black transition-colors duration-150 hover:bg-cm-black hover:text-cm-white";

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
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm font-bold text-cm-meta hover:text-cm-black">
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to newsroom
      </Link>

      <div className="mt-5 border-t-[6px] border-cm-black pt-3">
        <p className="text-cm-kicker font-extrabold uppercase tracking-cm-caps text-cm-meta">Commercial</p>
        <h1 className="font-serif text-cm-feature font-bold">Advertising campaigns</h1>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
        {/* Create campaign */}
        <div className="border-2 border-cm-rule bg-cm-white p-5">
          <div className="flex items-center gap-2">
            <Megaphone className="size-5 text-cm-meta" aria-hidden="true" />
            <h2 className="font-serif text-2xl font-bold">New campaign</h2>
          </div>
          <form action={createCampaign} className="mt-5 grid gap-4 border-t border-cm-rule pt-5 sm:grid-cols-2">
            <label className="grid gap-1.5">
              <span className={fieldLabel}>Campaign name</span>
              <input name="name" required className={fieldInput} />
            </label>
            <label className="grid gap-1.5">
              <span className={fieldLabel}>Slot</span>
              <select name="slot" className={`${fieldInput} bg-cm-white`}>
                <option value="leaderboard">Leaderboard</option>
                <option value="mpu">MPU</option>
                <option value="billboard">Billboard</option>
              </select>
            </label>
            <label className="grid gap-1.5 sm:col-span-2">
              <span className={fieldLabel}>Creative</span>
              <select name="media_id" required className={`${fieldInput} bg-cm-white`}>
                <option value="">Select uploaded media</option>
                {(media ?? []).map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.alt_text} ({item.width}×{item.height})
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1.5 sm:col-span-2">
              <span className={fieldLabel}>Alt text</span>
              <input name="alt_text" required maxLength={500} className={fieldInput} />
            </label>
            <label className="grid gap-1.5 sm:col-span-2">
              <span className={fieldLabel}>Destination URL</span>
              <input name="destination_url" type="url" pattern="https://.*" required placeholder="https://example.com" className={fieldInput} />
            </label>
            <label className="grid gap-1.5">
              <span className={fieldLabel}>Starts</span>
              <input name="starts_at" type="datetime-local" required className={fieldInput} />
            </label>
            <label className="grid gap-1.5">
              <span className={fieldLabel}>Ends</span>
              <input name="ends_at" type="datetime-local" required className={fieldInput} />
            </label>
            <button className={`${btnPrimary} sm:col-span-2`}>Create campaign</button>
          </form>
        </div>

        {/* Upload creative */}
        <div className="border-2 border-cm-rule bg-cm-paper p-5 lg:sticky lg:top-24">
          <div className="flex items-center gap-2">
            <Upload className="size-5 text-cm-meta" aria-hidden="true" />
            <h2 className="font-serif text-xl font-bold">Upload creative</h2>
          </div>
          <form action={uploadAdCreative} className="mt-5 grid gap-4 border-t border-cm-rule pt-5">
            <label className="grid gap-1.5">
              <span className={fieldLabel}>Creative file</span>
              <input
                name="creative_file"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                required
                className="border-2 border-cm-rule bg-cm-white p-2 text-sm transition-colors duration-150 file:mr-3 file:border-0 file:bg-cm-black file:px-3 file:py-2 file:text-xs file:font-extrabold file:uppercase file:tracking-cm-caps file:text-cm-white focus:border-cm-black focus:outline-none"
              />
            </label>
            <label className="grid gap-1.5">
              <span className={fieldLabel}>Creative alt text</span>
              <input name="creative_alt_text" required maxLength={500} className={`${fieldInput} bg-cm-white`} />
            </label>
            <button className={btnPrimary}>Upload creative</button>
          </form>
        </div>
      </div>

      <div className="mt-10 border-t border-cm-rule">
        <div className="flex flex-wrap items-center justify-between gap-3 py-3">
          <h2 className="text-cm-section font-extrabold uppercase">Campaigns</h2>
          <span className="text-sm text-cm-meta">{(campaigns ?? []).length} total</span>
        </div>
        <ul className="divide-y divide-cm-rule border-t border-cm-rule">
          {(campaigns ?? []).map((campaign) => (
            <li
              key={campaign.id}
              className="grid gap-3 px-2 py-5 transition-colors duration-150 hover:bg-cm-paper lg:grid-cols-[1fr_auto] lg:items-center"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-bold">{campaign.name}</p>
                  <span className="border border-cm-rule px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-cm-caps text-cm-meta">
                    {campaign.slot}
                  </span>
                  <span
                    className={`inline-flex min-h-6 items-center px-2 text-[11px] font-extrabold uppercase tracking-cm-caps ${campaign.active ? "border border-cm-black bg-cm-lime text-cm-black" : "border border-cm-rule bg-cm-paper text-cm-meta"
                      }`}
                  >
                    {campaign.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-cm-meta">
                  {new Date(campaign.starts_at).toLocaleString()} – {new Date(campaign.ends_at).toLocaleString()}
                </p>
                <a href={campaign.destination_url} rel="noopener noreferrer" className="text-sm font-bold underline">
                  {campaign.destination_url}
                </a>
              </div>
              <form action={toggleCampaign}>
                <input type="hidden" name="campaign_id" value={campaign.id} />
                <input type="hidden" name="active" value={String(campaign.active)} />
                <button className={btnOutline}>{campaign.active ? "Deactivate" : "Activate"}</button>
              </form>
            </li>
          ))}
          {(campaigns ?? []).length === 0 && <li className="py-4 text-sm text-cm-meta">No campaigns yet.</li>}
        </ul>
      </div>
    </section>
  );
}