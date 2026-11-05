import type { Metadata } from "next";
import Link from "next/link";

import { site } from "@/config/site";

export const metadata: Metadata = {
  title: `Advertise with ${site.name}`,
  description: "Reach readers across Badagry and surrounding communities with CityMood advertising.",
};

export default function AdvertisePage() {
  return (
    <section className="mx-auto w-full max-w-cm px-(--cm-gutter) py-12 lg:py-16">
      <div className="max-w-3xl border-t-[6px] border-cm-black pt-3">
        <p className="text-cm-kicker font-extrabold uppercase tracking-cm-caps">Commercial</p>
        <h1 className="font-serif text-cm-feature font-bold">Book space with CityMood</h1>
        <p className="mt-5 max-w-2xl text-cm-standfirst text-cm-ink">
          Put your message in front of readers across Badagry and surrounding communities. Contact our team for current placements, availability, and rates.
        </p>
        <div className="mt-8 grid gap-4 border-y border-cm-rule py-6 sm:grid-cols-2">
          <div>
            <p className="text-cm-kicker font-extrabold uppercase tracking-cm-caps text-cm-meta">Email</p>
            <a className="mt-2 block font-bold underline" href={`mailto:${site.contact.newsroomEmail}`}>{site.contact.newsroomEmail}</a>
          </div>
          <div>
            <p className="text-cm-kicker font-extrabold uppercase tracking-cm-caps text-cm-meta">Phone</p>
            <a className="mt-2 block font-bold underline" href={`tel:${site.contact.phone.replace(/\s+/g, "")}`}>{site.contact.phone}</a>
          </div>
        </div>
        <Link href="/" className="mt-8 inline-flex min-h-11 items-center bg-cm-black px-4 font-bold text-cm-white">Back to CityMood</Link>
      </div>
    </section>
  );
}
