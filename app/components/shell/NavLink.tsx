"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Sets aria-current="page" on the active section. Style the active state with
// the aria-[current=page]: variant so server-rendered classes stay static.
export function NavLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link prefetch={false} href={href} aria-current={active ? "page" : undefined} className={className}>
      {children}
    </Link>
  );
}
