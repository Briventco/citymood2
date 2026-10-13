import Link from "next/link";
import { Marker } from "./CategoryLabel";

// DESIGN_SPEC.md §4.7: 6px black top rule, 12px above the row, 14px marker,
// title in Sans 800 caps, "See all" on the right with a 44px tap area.
export function SectionHeader({
  id,
  title,
  shortTitle,
  href,
  className = "",
}: {
  id: string;
  title: string;
  /** Shorter title below 640px, e.g. "Business". */
  shortTitle?: string;
  href?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between gap-4 border-t-[6px] border-cm-black pt-3 ${className}`}>
      <h2 id={id} className="flex items-center gap-2.5 text-cm-section leading-tight font-extrabold uppercase tracking-[0.02em]">
        <Marker size="size-3.5" />
        {shortTitle ? (
          <>
            <span className="sm:hidden">{shortTitle}</span>
            <span className="hidden sm:inline">{title}</span>
          </>
        ) : (
          title
        )}
      </h2>
      {href && (
        <Link prefetch={false} href={href} className="inline-flex min-h-11 flex-none items-center text-[15px] font-bold hover:underline">
          See all<span className="sr-only"> {title}</span>
        </Link>
      )}
    </div>
  );
}
