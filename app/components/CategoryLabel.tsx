import Link from "next/link";
import type { Category } from "@/lib/content";
import { categoryHref } from "@/lib/urls";

// DESIGN_SPEC.md §4.6. On light: 12px lime square with a 1px black outline, then
// black caps. On black: no square, lime text (lime is only ever text on black).
export function CategoryLabel({
  category,
  onDark = false,
  className = "",
}: {
  category: Category;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={categoryHref(category.slug)}
      className={`inline-flex items-center gap-2 py-0.5 text-cm-kicker font-extrabold uppercase tracking-cm-caps hover:underline ${
        onDark ? "text-cm-lime" : "text-cm-black"
      } ${className}`}
    >
      {!onDark && <Marker size="size-3" />}
      {category.name}
    </Link>
  );
}

/** The lime square marker with a 1px black outline. Decorative. */
export function Marker({ size }: { size: "size-3" | "size-3.5" }) {
  return <span aria-hidden="true" className={`inline-block flex-none bg-cm-lime outline outline-1 outline-cm-black ${size}`} />;
}
