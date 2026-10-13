import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { site } from "@/config/site";
import type { Category } from "@/lib/content";
import { formatMastheadDate } from "@/lib/format";
import { HeaderDisclosure } from "./HeaderDisclosure";
import { Logo } from "./Logo";
import { MobileMenuPanel } from "./MobileMenuPanel";
import { SearchForm } from "./SearchForm";

// DESIGN_SPEC.md §4.1. Mobile bar below 1024px: menu, centred logo, search.
// Desktop from 1024px: logo, tagline block, search form.
export function SiteHeader({ categories, now }: { categories: Category[]; now: Date }) {
  return (
    <header className="cm-on-dark relative z-40 bg-cm-black text-cm-white">
      <div className="mx-auto flex max-w-cm items-center justify-between px-2 py-1.5 lg:justify-start lg:gap-7 lg:px-(--cm-gutter) lg:py-2">
        <div className="lg:hidden">
          <HeaderDisclosure
            id="mobile-menu"
            openLabel="Open menu"
            closeLabel="Close menu"
            icon={<Menu aria-hidden="true" size={26} strokeWidth={2.2} />}
            openIcon={<X aria-hidden="true" size={28} strokeWidth={2.6} className="text-cm-lime" />}
            panelClassName="absolute inset-x-0 top-full max-h-[calc(100dvh-84px)] overflow-y-auto border-t border-cm-rule-dark bg-cm-black"
            lockScroll
          >
            <MobileMenuPanel categories={categories} />
          </HeaderDisclosure>
        </div>

        <Link href="/" aria-label="CityMood home" className="flex-none">
          <Logo height={104} eager className="h-[72px] lg:h-[104px]" />
        </Link>

        <div className="hidden min-w-0 flex-1 lg:block">
          <p className="text-[17px] font-light uppercase italic tracking-cm-tagline">{site.tagline}</p>
          <p className="mt-1.5 text-sm text-cm-meta-dark">
            {formatMastheadDate(now)} · {site.place}
          </p>
        </div>

        <SearchForm id="header-search" className="hidden w-[340px] flex-none lg:flex" />

        <div className="lg:hidden">
          <HeaderDisclosure
            id="mobile-search"
            openLabel="Search"
            closeLabel="Close search"
            icon={<Search aria-hidden="true" size={24} strokeWidth={2.2} />}
            openIcon={<X aria-hidden="true" size={28} strokeWidth={2.6} className="text-cm-lime" />}
            panelClassName="absolute inset-x-0 top-full border-t border-cm-rule-dark bg-cm-black px-(--cm-gutter) py-4"
            initialFocus="first"
          >
            <SearchForm id="mobile-search-input" />
          </HeaderDisclosure>
        </div>
      </div>
    </header>
  );
}
