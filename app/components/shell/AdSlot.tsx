import Image from "next/image";
import Link from "next/link";
import { site } from "@/config/site";
import { getAdCampaign, type AdSlotName } from "@/lib/content";
import type { AdCreative } from "@/lib/content/types";
import { Logo } from "./Logo";

// DESIGN_SPEC.md §4.5. Fixed box per breakpoint so slots never shift layout:
//   leaderboard 320×50 / 728×90 (≥640) / 970×90 (≥1024)
//   mpu         300×250 everywhere
//   billboard   300×250 / 728×90 (≥640) / 970×250 (≥1024)
// Boxes shrink with the viewport below their width (e.g. 640px for a 728 box); creatives letterbox.
// The band uses 16px padding (not the 24px gutter) so 728×90 fits at 768px.
// Campaigns come from the newsroom (/admin/ads): the mobile creative shows below
// 640px, the desktop one from 640px; with only one, it is used everywhere.
type SlotKind = "leaderboard" | "mpu" | "billboard";
const kindOf = (slot: AdSlotName): SlotKind => (slot === "mpu_1" || slot === "mpu_2" ? "mpu" : slot);

const BOX: Record<SlotKind, string> = {
  leaderboard: "max-w-[320px] h-[50px] sm:max-w-[728px] sm:h-[90px] lg:max-w-[970px]",
  mpu: "max-w-[300px] h-[250px]",
  billboard: "max-w-[300px] h-[250px] sm:max-w-[728px] sm:h-[90px] lg:max-w-[970px] lg:h-[250px]",
};

const SIZES: Record<SlotKind, string> = {
  leaderboard: "(min-width: 1024px) 970px, (min-width: 640px) 728px, 320px",
  mpu: "300px",
  billboard: "(min-width: 1024px) 970px, (min-width: 640px) 728px, 300px",
};

// House ad layout per slot: the logo needs 64px of height, so it is left out of 50px-tall boxes.
const HOUSE: Record<SlotKind, { layout: string; logo: string }> = {
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

function Creative({ creative, alt, sizes, className = "" }: { creative: AdCreative; alt: string; sizes: string; className?: string }) {
  return <Image src={creative.src} alt={alt} fill sizes={sizes} className={`object-contain ${className}`} />;
}

export async function AdSlot({ slot, now, band, className = "" }: Props) {
  const kind = kindOf(slot);
  const campaign = await getAdCampaign(slot, now);
  const desktop = campaign?.desktop ?? campaign?.mobile ?? null;
  const mobile = campaign?.mobile ?? campaign?.desktop ?? null;
  const house = HOUSE[kind];
  const onBand = band ?? kind !== "mpu";

  return (
    <aside
      aria-label="Advertisement"
      className={`${onBand ? "bg-cm-paper px-4 pt-3.5 pb-[18px]" : ""} ${className}`}
    >
      <p className="mb-1.5 text-center text-cm-label font-bold uppercase tracking-[0.14em] text-cm-meta">
        Advertisement
      </p>
      <div className={`relative mx-auto w-full overflow-hidden ${BOX[kind]}`}>
        {campaign && desktop && mobile ? (
          // Same tab, per spec. rel marks the link as paid.
          <a href={campaign.href} rel="sponsored noopener" className="block size-full bg-cm-white">
            {desktop === mobile ? (
              <Creative creative={desktop} alt={campaign.alt} sizes={SIZES[kind]} />
            ) : (
              <>
                <Creative creative={mobile} alt={campaign.alt} sizes={SIZES[kind]} className="sm:hidden" />
                <Creative creative={desktop} alt={campaign.alt} sizes={SIZES[kind]} className="hidden sm:block" />
              </>
            )}
          </a>
        ) : (
          <Link prefetch={false}
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
