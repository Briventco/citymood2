import { getBreaking } from "@/lib/content";
import { articleHref } from "@/lib/urls";
import { TickerRotator } from "./TickerRotator";

// DESIGN_SPEC.md §4.4. Articles tagged "breaking", newest first, max 5, expiring
// after site.breakingMaxAgeHours. Renders nothing when there are none.
export async function BreakingTicker({ now }: { now: Date }) {
  const items = await getBreaking(now);
  if (items.length === 0) return null;
  return <TickerRotator items={items.map((a) => ({ id: a.id, title: a.title, href: articleHref(a) }))} />;
}
