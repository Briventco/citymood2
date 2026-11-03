"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
    LayoutDashboard,
    FilePlus2,
    FolderTree,
    Users,
    Megaphone,
    ScrollText,
    Menu,
    X,
    LogOut,
    Search,
    ChevronUp,
    ChevronRight,
    ExternalLink,
} from "lucide-react";

type IconKey = "dashboard" | "new-article" | "taxonomy" | "users" | "ads" | "audit";

type NavItem = {
    href: string;
    label: string;
    icon: IconKey;
    exact?: boolean;
};

const ICONS: Record<IconKey, typeof LayoutDashboard> = {
    dashboard: LayoutDashboard,
    "new-article": FilePlus2,
    taxonomy: FolderTree,
    users: Users,
    ads: Megaphone,
    audit: ScrollText,
};

export function AdminShell({
    children,
    displayName,
    email,
    roleLabel,
    navItems,
    signOutAction,
}: {
    children: ReactNode;
    displayName: string;
    email: string | null;
    roleLabel: string;
    navItems: NavItem[];
    signOutAction: () => Promise<void>;
}) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    const initial = (displayName || "C").trim().charAt(0).toUpperCase();

    const isActive = (item: NavItem) =>
        item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);

    const activeLabel = navItems.find((item) => isActive(item))?.label ?? "Newsroom";
    const auditHref = navItems.find((item) => item.icon === "audit")?.href;

    useEffect(() => {
        function onPointerDown(event: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) setProfileOpen(false);
        }
        document.addEventListener("mousedown", onPointerDown);
        return () => document.removeEventListener("mousedown", onPointerDown);
    }, []);

    const NavList = () => (
        <nav aria-label="Newsroom" className="mt-2 flex flex-col gap-0.5 px-3">
            <p className="px-3 pb-2 pt-3 text-[11px] font-extrabold uppercase tracking-cm-caps text-cm-meta-dark/70">
                Workspace
            </p>
            {navItems.map((item) => {
                const Icon = ICONS[item.icon];
                const active = isActive(item);
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={`flex min-h-11 items-center gap-3 px-3 text-sm font-bold transition-colors duration-150 ${active
                            ? "bg-cm-lime text-cm-black"
                            : "text-cm-meta-dark hover:bg-cm-rule-dark hover:text-cm-white"
                            }`}
                    >
                        <Icon className="size-[18px] shrink-0" aria-hidden="true" strokeWidth={2.25} />
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );

    const BrandBlock = () => (
        <div className="flex items-center gap-2 border-b border-cm-rule-dark px-5 py-5">
            <span className="flex size-8 shrink-0 items-center justify-center bg-cm-lime font-serif text-base font-bold text-cm-black">
                C
            </span>
            <div>
                <p className="text-[11px] font-extrabold uppercase tracking-cm-caps text-cm-lime">CityMood</p>
                <p className="font-serif text-lg font-bold leading-tight text-cm-white">Newsroom</p>
            </div>
        </div>
    );

    const ProfileBlock = () => (
        <div ref={profileRef} className="relative mt-auto border-t border-cm-rule-dark p-3">
            {profileOpen && (
                <div className="absolute inset-x-3 bottom-full mb-2 border-2 border-cm-lime bg-cm-black">
                    <p className="border-b border-cm-rule-dark px-3 py-2 text-[11px] font-extrabold uppercase tracking-cm-caps text-cm-meta-dark">
                        {roleLabel}
                    </p>
                    {auditHref && (
                        <Link
                            href={auditHref}
                            onClick={() => {
                                setProfileOpen(false);
                                setOpen(false);
                            }}
                            className="flex min-h-11 items-center gap-2 px-3 text-sm font-bold text-cm-white transition-colors duration-150 hover:bg-cm-rule-dark"
                        >
                            <ScrollText className="size-4" aria-hidden="true" />
                            Audit log
                        </Link>
                    )}
                    <form action={signOutAction}>
                        <button
                            type="submit"
                            className="flex min-h-11 w-full items-center gap-2 px-3 text-sm font-bold text-cm-white transition-colors duration-150 hover:bg-cm-lime hover:text-cm-black"
                        >
                            <LogOut className="size-4" aria-hidden="true" />
                            Sign out
                        </button>
                    </form>
                </div>
            )}

            <button
                type="button"
                onClick={() => setProfileOpen((value) => !value)}
                aria-expanded={profileOpen}
                className="flex w-full items-center gap-3 px-2 py-2 text-left transition-colors duration-150 hover:bg-cm-rule-dark"
            >
                <span className="flex size-9 shrink-0 items-center justify-center border-2 border-cm-lime font-serif text-base font-bold text-cm-lime">
                    {initial}
                </span>
                <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-cm-white">{displayName}</span>
                    <span className="block truncate text-[11px] uppercase tracking-wide text-cm-meta-dark">{email ?? roleLabel}</span>
                </span>
                <ChevronUp
                    className={`size-4 shrink-0 text-cm-meta-dark transition-transform duration-150 ${profileOpen ? "" : "rotate-180"}`}
                    aria-hidden="true"
                />
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-cm-paper">
            {/* Mobile top bar */}
            <div className="flex items-center justify-between gap-4 border-b-8 border-cm-lime bg-cm-black px-(--cm-gutter) py-3 lg:hidden">
                <div className="flex items-center gap-2">
                    <span className="flex size-8 shrink-0 items-center justify-center bg-cm-lime font-serif text-base font-bold text-cm-black">
                        C
                    </span>
                    <p className="font-serif text-lg font-bold text-cm-white">Newsroom</p>
                </div>
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    aria-label="Open navigation"
                    aria-expanded={open}
                    className="flex min-h-11 min-w-11 items-center justify-center border border-cm-rule-dark text-cm-white"
                >
                    <Menu className="size-5" aria-hidden="true" />
                </button>
            </div>

            {/* Mobile drawer */}
            {open && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <button
                        type="button"
                        aria-label="Close navigation"
                        onClick={() => setOpen(false)}
                        className="absolute inset-0 bg-cm-black/60"
                    />
                    <div className="relative flex h-full w-[280px] max-w-[82vw] flex-col border-r-2 border-cm-lime bg-cm-black">
                        <div className="flex items-center justify-between border-b border-cm-rule-dark px-5 py-5">
                            <div className="flex items-center gap-2">
                                <span className="flex size-8 shrink-0 items-center justify-center bg-cm-lime font-serif text-base font-bold text-cm-black">
                                    C
                                </span>
                                <p className="font-serif text-lg font-bold text-cm-white">Newsroom</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                aria-label="Close navigation"
                                className="flex min-h-11 min-w-11 items-center justify-center border border-cm-rule-dark text-cm-white"
                            >
                                <X className="size-5" aria-hidden="true" />
                            </button>
                        </div>
                        <NavList />
                        <ProfileBlock />
                    </div>
                </div>
            )}

            {/* Desktop sidebar */}
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-cm-black lg:flex">
                <BrandBlock />
                <NavList />
                <ProfileBlock />
            </aside>

            {/* Content */}
            <div className="lg:pl-64">
                {/* Desktop top bar */}
                <div className="sticky top-0 z-20 hidden items-center justify-between gap-6 border-b-2 border-cm-black bg-cm-white/95 px-10 py-4 backdrop-blur lg:flex">
                    <div className="flex min-w-0 items-center gap-1.5 text-sm">
                        <Link href="/admin" className="font-bold text-cm-meta transition-colors duration-150 hover:text-cm-black">
                            Newsroom
                        </Link>
                        <ChevronRight className="size-3.5 shrink-0 text-cm-rule" aria-hidden="true" />
                        <span className="truncate font-bold text-cm-black">{activeLabel}</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <label className="relative flex items-center">
                            <Search className="pointer-events-none absolute left-3 size-4 text-cm-meta" aria-hidden="true" />
                            <span className="sr-only">Search</span>
                            <input
                                type="search"
                                placeholder="Search the newsroom…"
                                className="h-10 w-72 border-2 border-cm-rule bg-cm-paper pl-9 pr-3 text-sm text-cm-black transition-colors duration-150 placeholder:text-cm-meta focus:border-cm-black focus:bg-cm-white focus:outline-none"
                            />
                        </label>

                        <span className="h-7 w-px shrink-0 bg-cm-rule" aria-hidden="true" />

                        <Link
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex min-h-10 shrink-0 items-center gap-1.5 whitespace-nowrap px-1 text-xs font-extrabold uppercase tracking-cm-caps text-cm-meta transition-colors duration-150 hover:text-cm-black"
                        >
                            View site
                            <ExternalLink className="size-3.5" aria-hidden="true" />
                        </Link>
                    </div>
                </div>

                <main className="min-w-0 bg-cm-white px-5 py-6 lg:px-10 lg:py-8">{children}</main>
            </div>
        </div>
    );
}