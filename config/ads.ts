// Development-only fallback campaigns. Production campaigns are loaded from
// Supabase ad_campaigns; when no campaign is live, AdSlot shows the house ad.

export type AdSlotName = "leaderboard" | "mpu" | "billboard";

export type AdCampaign = {
  slot: AdSlotName;
  /** Image in /public. Wrong aspect ratios are letterboxed, never stretched. */
  image: { src: string; width: number; height: number };
  alt: string;
  href: string;
  /** ISO dates. The campaign shows from start (inclusive) to end (exclusive). */
  start: string;
  end: string;
};

export const adCampaigns: AdCampaign[] = [];
