import type { Category } from "@/lib/content";
import { categoryHref } from "@/lib/urls";
import { NavLink } from "./NavLink";

const linkClass =
  "block whitespace-nowrap px-3 py-[13px] text-cm-nav font-bold text-cm-black aria-[current=page]:bg-cm-lime lg:px-4 lg:py-3.5";

// DESIGN_SPEC.md §4.2. Below 1024px: a horizontally scrolling strip with short
// labels (scrollbar hidden; links stay reachable by Tab). From 1024px: full names.
export function SectionNav({ categories }: { categories: Category[] }) {
  return (
    <nav aria-label="Sections" className="border-b-2 border-cm-black bg-cm-white">
      <ul className="mx-auto flex max-w-cm overflow-x-auto [scrollbar-width:none] lg:flex-wrap lg:overflow-visible lg:px-(--cm-gutter) [&::-webkit-scrollbar]:hidden">
        <li className="flex-none">
          <NavLink href="/" className={linkClass}>
            Home
          </NavLink>
        </li>
        {categories.map((c) => (
          <li key={c.slug} className="flex-none">
            <NavLink href={categoryHref(c.slug)} className={linkClass}>
              <span className="lg:hidden">{c.shortName}</span>
              <span className="hidden lg:inline">{c.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
