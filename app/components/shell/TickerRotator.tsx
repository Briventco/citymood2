"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

type Item = { id: string; title: string; href: string };

// One headline at a time, never animated, so there is nothing to pause
// (WCAG 2.2.2) and nothing moves with prefers-reduced-motion. Headlines wrap
// instead of being cut off. "Next" steps through the rest. No aria-live.
export function TickerRotator({ items }: { items: Item[] }) {
  const [index, setIndex] = useState(0);
  const item = items[index];
  const count = items.length;

  return (
    <section aria-label="Breaking news" className="cm-on-dark bg-cm-black text-cm-white">
      <div className="mx-auto flex min-h-[52px] max-w-cm items-center gap-3 px-(--cm-gutter) py-1 lg:gap-[18px]">
        <span className="flex-none bg-cm-lime px-2.5 py-1.5 text-cm-kicker font-extrabold uppercase tracking-[0.12em] text-cm-black">
          Breaking
        </span>
        <p className="flex min-w-0 flex-1 items-baseline gap-2.5 py-1 text-[15px] leading-snug font-bold lg:text-base">
          <span aria-hidden="true" className="inline-block size-2 flex-none -translate-y-0.5 bg-cm-lime" />
          <Link prefetch={false} href={item.href} className="text-cm-white">
            {item.title}
          </Link>
        </p>
        {count > 1 && (
          <>
            <span className="hidden flex-none text-sm text-cm-meta-dark sm:inline">
              {index + 1} of {count}
            </span>
            <button
              type="button"
              onClick={() => setIndex((index + 1) % count)}
              aria-label={`Next breaking headline (${((index + 1) % count) + 1} of ${count})`}
              className="flex size-11 flex-none cursor-pointer items-center justify-center border border-cm-meta text-cm-white"
            >
              <ChevronRight aria-hidden="true" size={20} strokeWidth={2.4} />
            </button>
          </>
        )}
      </div>
    </section>
  );
}
