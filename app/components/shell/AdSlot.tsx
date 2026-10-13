import Image from "next/image";
import Link from "next/link";
import { adCampaigns, type AdSlotName } from "@/config/ads";
import { site } from "@/config/site";
import { Logo } from "./Logo";

// DESIGN_SPEC.md §4.5. Fixed box per breakpoint so slots never shift layout:
//   leaderboard 320×50 / 728×90 (≥640) / 970×90 (≥1024)
//   mpu         300×250 everywhere
//   billboard   300×250 / 728×90 (≥640) / 970×250 (≥1024)
// Boxes shrink with the viewport below their width (e.g. 320px screens); creatives letterbox.
const BOX: Record<AdSlotName, string> = {
  leaderboard: "max-w-[320px] h-[50px] sm:max-w-[728px] sm:h-[90px] lg:max-w-[970px]",
  mpu: "max-w-[300px] h-[250px]",
  billboard: "max-w-[300px] h-[250px] sm:max-w-[728px] sm:h-[90px] lg:max-w-[970px] lg:h-[250px]",
};

const SIZES: Record<AdSlotName, string> = {
  leaderboard: "(min-width: 1024px) 970px, (min-width: 640px) 728px, 320px",
  mpu: "300px",
  billboard: "(min-width: 1024px) 970px, (min-width: 640px) 728px, 300px",
};

// House ad layout per slot: the logo needs 64px of height, so it is left out of 50px-tall boxes.
const HOUSE: Record<AdSlotName, { layout: string; logo: string }> = {
  leaderboard: { layout: "flex-row gap-5", logo: "hidden sm:block" },
  mpu: { layout: "flex-col gap-3", logo: "block" },
  billboard: { layout: "flex-col gap-3 sm:flex-row sm:gap-5 lg:flex-col lg:gap-4", logo: "block" },
};

type Props = {
  slot: AdSlotName;
  now: Date;
  /** Leaderboard and billboard sit on a full-width paper band. */
  band?: boolean;
  className?: string;
};

export function AdSlot({ slot, now, band = slot !== "mpu", className = "" }: Props) {
  const t = now.getTime();
  const campaign = adCampaigns.find(
    (c) => c.slot === slot && Date.parse(c.start) <= t && t < Date.parse(c.end),
  );
  const house = HOUSE[slot];

  return (
    <aside
      aria-label="Advertisement"
      className={`${band ? "bg-cm-paper px-(--cm-gutter) pt-3.5 pb-[18px]" : ""} ${className}`}
    >
      <p className="mb-1.5 text-center text-cm-label font-bold uppercase tracking-[0.14em] text-cm-meta">
        Advertisement
      </p>
      <div className={`relative mx-auto w-full overflow-hidden ${BOX[slot]}`}>
        {campaign ? (
          // Same tab, per spec. rel marks the link as paid.
          <a href={campaign.href} rel="sponsored noopener" className="block size-full bg-cm-white">
            <Image
              src={campaign.image.src}
              alt={campaign.alt}
              fill
              sizes={SIZES[slot]}
              className="object-contain"
            />
          </a>
        ) : (
          <Link
            href={site.pages.advertise.href}
            className={`cm-on-dark flex size-full items-center justify-center bg-cm-black px-4 text-center text-cm-white ${house.layout}`}
          >
            <Logo height={64} alt="" className={`h-16 ${house.logo}`} />
            <span className="text-lg leading-tight font-bold">
              Advertise with CityMood
              <span className="mt-1 block text-sm font-normal text-cm-meta-dark underline">
                Book this space
              </span>
            </span>
          </Link>
        )}
      </div>
    </aside>
  );
}
