import { site } from "@/config/site";
import type { Category } from "@/lib/content";
import { categoryHref } from "@/lib/urls";
import { NavLink } from "./NavLink";
import { SearchForm } from "./SearchForm";

const linkClass =
  "flex min-h-[52px] items-center border-b border-cm-rule-dark px-(--cm-gutter) text-lg font-bold text-cm-white aria-[current=page]:bg-cm-lime aria-[current=page]:text-cm-black";

// DESIGN_SPEC.md §4.3: search form, section links (52px), then About, Contact, Advertise.
export function MobileMenuPanel({ categories }: { categories: Category[] }) {
  const extra = [
    { label: "About", href: site.pages.about.href },
    { label: "Contact", href: site.pages.contact.href },
    { label: "Advertise", href: site.pages.advertise.href },
  ];
  return (
    <nav aria-label="Menu">
      <div className="px-(--cm-gutter) py-4">
        <SearchForm id="menu-search" />
      </div>
      <ul className="border-t border-cm-rule-dark">
        <li>
          <NavLink href="/" className={linkClass}>
            Home
          </NavLink>
        </li>
        {categories.map((c) => (
          <li key={c.slug}>
            <NavLink href={categoryHref(c.slug)} className={linkClass}>
              {c.name}
            </NavLink>
          </li>
        ))}
      </ul>
      <ul className="py-2">
        {extra.map((p) => (
          <li key={p.href}>
            <NavLink
              href={p.href}
              className="flex min-h-11 items-center px-(--cm-gutter) text-base font-bold text-cm-meta-dark aria-[current=page]:text-cm-lime"
            >
              {p.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
