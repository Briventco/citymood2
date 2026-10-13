"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

// A <details> disclosure for the mobile header (menu and search). Without JS it
// still opens and closes natively. With JS it adds aria-expanded, a switching
// label, Esc to close, a focus trap, focus return and an optional scroll lock,
// and only one header panel stays open at a time.

const OPEN_EVENT = "cm:header-disclosure-open";
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

type Props = {
  id: string;
  openLabel: string;
  closeLabel: string;
  /** Shown while closed / open. Swapped with CSS so it also works without JS. */
  icon: React.ReactNode;
  openIcon: React.ReactNode;
  panelClassName: string;
  /** "panel" focuses the panel itself; "first" focuses its first control. */
  initialFocus?: "panel" | "first";
  lockScroll?: boolean;
  children: React.ReactNode;
};

export function HeaderDisclosure({
  id,
  openLabel,
  closeLabel,
  icon,
  openIcon,
  panelClassName,
  initialFocus = "panel",
  lockScroll = false,
  children,
}: Props) {
  const [open, setOpen] = useState(false);
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const summaryRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const panelId = `${id}-panel`;

  // The <details> element owns the open state; its toggle event syncs React state.
  const close = useCallback((returnFocus: boolean) => {
    if (detailsRef.current) detailsRef.current.open = false;
    if (returnFocus) summaryRef.current?.focus();
  }, []);

  // Close after client-side navigation.
  useEffect(() => {
    close(false);
  }, [pathname, close]);

  // Close when another header panel opens.
  useEffect(() => {
    const onOtherOpen = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== id && detailsRef.current?.open) close(false);
    };
    window.addEventListener(OPEN_EVENT, onOtherOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOtherOpen);
  }, [id, close]);

  useEffect(() => {
    if (!open) return;
    window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: id }));

    const panel = panelRef.current;
    if (initialFocus === "first") panel?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    else panel?.focus();

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    if (lockScroll) root.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close(true);
        return;
      }
      if (e.key !== "Tab" || !panel || !summaryRef.current) return;
      const items = [summaryRef.current, ...panel.querySelectorAll<HTMLElement>(FOCUSABLE)];
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === panel)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (lockScroll) root.style.overflow = previousOverflow;
    };
  }, [open, id, initialFocus, lockScroll, close]);

  return (
    <details ref={detailsRef} className="group" onToggle={(e) => setOpen(e.currentTarget.open)}>
      <summary
        ref={summaryRef}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? closeLabel : openLabel}
        className="flex size-12 cursor-pointer list-none items-center justify-center [&::-webkit-details-marker]:hidden"
      >
        <span className="group-open:hidden">{icon}</span>
        <span className="hidden group-open:inline">{openIcon}</span>
      </summary>
      <div ref={panelRef} id={panelId} tabIndex={-1} className={panelClassName}>
        {children}
      </div>
    </details>
  );
}
