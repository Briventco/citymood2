import { site } from "@/config/site";
import { lagosYear } from "@/lib/format";
import { Logo } from "./Logo";

const headingClass = "mb-2.5 text-[13px] font-extrabold uppercase tracking-[0.14em] text-cm-lime";
// 44px tap height on mobile; tighter rows from 1024px.
const linkClass = "flex min-h-11 items-center text-[15px] text-cm-white lg:min-h-0 lg:py-[7px]";

// DESIGN_SPEC.md §4.12. Contact details and social URLs live in config/site.ts.
export function SiteFooter({ now }: { now: Date }) {
  const { contact, pages, social } = site;
  const companyLinks = [pages.about, pages.contact, pages.advertise, pages.corrections, pages.privacy, pages.terms];

  return (
    <footer className="cm-on-dark border-t-8 border-cm-lime bg-cm-black text-cm-white">
      <div className="mx-auto grid max-w-cm grid-cols-2 gap-x-6 gap-y-8 px-(--cm-gutter) pt-9 pb-7 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:gap-x-12">
        <div className="col-span-2 lg:col-span-1">
          {/* The PNG has a black margin; pull it left so the mark lines up with the text. */}
          <Logo height={120} className="-ml-2.5 h-[120px]" />
          <p className="mt-2 max-w-[340px] text-[15px] leading-relaxed text-cm-meta-dark">{site.description}</p>
        </div>

        <div className="col-span-2 text-[15px] leading-relaxed sm:col-span-1">
          <h2 className={headingClass}>Contact</h2>
          <address className="not-italic">
            <p className="mb-2">{contact.address}</p>
            <p className="mb-2">Newsroom: {contact.phone}</p>
            <p className="mb-2">{contact.newsroomEmail}</p>
            <p>Corrections: {contact.correctionsEmail}</p>
          </address>
        </div>

        <nav aria-label="CityMood">
          <h2 className={headingClass}>CityMood</h2>
          <ul>
            {companyLinks.map((p) => (
              <li key={p.href}>
                <a href={p.href} className={linkClass}>
                  {p.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Follow CityMood">
          <h2 className={headingClass}>Follow</h2>
          <ul>
            {social.map((s) => (
              <li key={s.network}>
                <a href={s.url} className={linkClass}>
                  {s.network}
                  <span className="hidden sm:inline">&nbsp;· {s.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="mx-auto max-w-cm px-(--cm-gutter)">
        <p className="border-t border-cm-rule-dark pt-4 pb-7 text-[13px] text-cm-meta-dark">
          © {lagosYear(now)} {site.publisher}
        </p>
      </div>
    </footer>
  );
}
