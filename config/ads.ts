// Direct-sold ad campaigns, one entry per booking.
// There is no CMS yet, so changing a creative needs a redeploy (OPEN_QUESTIONS #9).
// When no campaign is live for a slot, AdSlot shows the "Advertise with CityMood" house ad.

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
