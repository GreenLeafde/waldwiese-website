"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./logo";
import { CONTACT, NAV, NAV_FULL, RESERVATION_URL } from "@/lib/site";

/**
 * Sticky-Header mit zwei Verhaltensweisen:
 *  - Auf der Startseite (`/`): erst nach Scrollen über die Intro sichtbar.
 *    Einmal sichtbar → bleibt sichtbar (kein Re-Hide beim Hochscrollen).
 *  - Auf allen anderen Routen: von Anfang an sichtbar.
 *
 * Mobile-Menü ist ein Vollbild-Overlay statt Dropdown — bei kleinen
 * Viewports angenehmer zu lesen und tippen.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [revealed, setRevealed] = useState(!isHome);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setRevealed(true);
      return;
    }
    setRevealed(false);
    const onScroll = () => {
      const threshold = window.innerHeight * 0.85;
      if (window.scrollY > threshold) {
        setRevealed(true);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  // Body-Scroll sperren, wenn das Mobile-Menü offen ist
  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 h-[64px] bg-white/95 backdrop-blur-md border-b border-stone-200 transition-transform duration-500 ${
          revealed ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="mx-auto max-w-7xl px-5 md:px-8 h-full flex items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center gap-6">
          <div className="lg:justify-self-start">
            <Logo />
          </div>

          <nav
            aria-label="Hauptnavigation"
            className="hidden lg:flex items-center gap-9 text-[0.78rem] tracking-[0.18em] uppercase text-ink/80 justify-self-center"
          >
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-tonwarm transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <a
            href={RESERVATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center text-[0.78rem] tracking-[0.18em] uppercase text-tonwarm hover:text-tonwarm-dark border-b border-tonwarm/40 hover:border-tonwarm pb-0.5 transition-colors justify-self-end"
          >
            Reservieren
          </a>

          <button
            type="button"
            aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden inline-flex flex-col gap-1.5 p-2 -mr-2 text-ink relative z-50"
          >
            <span
              className={`block h-[2px] w-6 bg-current transition-transform ${
                mobileOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-[2px] w-6 bg-current transition-opacity ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-[2px] w-6 bg-current transition-transform ${
                mobileOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </header>

      {/* Mobile-Menü: Vollbild-Overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-50 bg-waldgruen text-mehlcreme transition-opacity duration-300 ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      >
        {/* Schließen-Button oben rechts */}
        <button
          type="button"
          aria-label="Menü schließen"
          onClick={() => setMobileOpen(false)}
          className="absolute top-3 right-4 z-10 inline-flex items-center justify-center w-12 h-12 text-mehlcreme hover:text-tonwarm transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="w-7 h-7"
            aria-hidden
          >
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        </button>

        <div className="h-full flex flex-col overflow-y-auto">
          {/* Spacer für Header-Höhe */}
          <div className="h-[64px] flex-shrink-0" />

          <nav
            aria-label="Hauptnavigation mobil"
            className="flex-1 flex flex-col justify-center px-7"
          >
            <ul className="space-y-1">
              {NAV_FULL.map((item, i) => (
                <li
                  key={item.href}
                  className={`overflow-hidden ${
                    mobileOpen ? "anim-fade-up" : "opacity-0"
                  }`}
                  style={{
                    animationDelay: mobileOpen ? `${100 + i * 60}ms` : "0ms",
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block font-display text-4xl md:text-5xl py-2 text-mehlcreme hover:text-tonwarm transition-colors leading-tight"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-10 pt-8 border-t border-mehlcreme/15 space-y-4 text-sm">
              <a
                href={RESERVATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center gap-2 bg-tonwarm hover:bg-tonwarm-dark text-white px-7 py-3.5 rounded-full font-medium transition-colors"
              >
                Reservieren <span aria-hidden>→</span>
              </a>

              <div className="space-y-1.5 text-mehlcreme/75 pt-2">
                <p>
                  <a
                    href={`tel:${CONTACT.phoneRaw}`}
                    className="hover:text-tonwarm"
                  >
                    {CONTACT.phone}
                  </a>
                </p>
                <p>
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="hover:text-tonwarm break-all"
                  >
                    {CONTACT.email}
                  </a>
                </p>
                <p>
                  <a
                    href={CONTACT.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-tonwarm"
                  >
                    {CONTACT.instagramHandle}
                  </a>
                </p>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
