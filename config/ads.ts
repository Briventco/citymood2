// Direct-sold ad campaigns, one entry per booking.
// There is no CMS yet, so changing a creative needs a redeploy (OPEN_QUESTIONS #9).
// When no campaign is live for a slot, AdSlot shows the "Advertise with CityMood" house ad.

export type StaticAdCampaign = AdCampaign & {
  /** ISO dates. The campaign shows from start (inclusive) to end (exclusive). */
  start: string;
  end: string;
};

export const adCampaigns: StaticAdCampaign[] = [];
