"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "./logo";
import { LiveStatus } from "./live-status";
import { ReserveButton } from "./reserve-chooser";
import { CONTACT, NAV_GROUPS, NAV_MAIN } from "@/lib/site";

/**
 * Header (Redesign 10/2026) in zwei Ebenen:
 *  - Infoleiste: Live-Status, Telefon, Adresse, Instagram
 *  - Hauptbar: Logo, fünf Navigationspunkte, Gutscheine, Reservieren
 *
 * Der Ton folgt der Seite: html[data-tone="hell"] = Tanne auf Morgenlicht,
 * html[data-tone="dunkel"] = Creme auf Tanne (siehe globals.css, PageTone,
 * ScrollDay). Reservieren öffnet die Vorauswahl Brunch/Abendessen.
 * Mobile-Menü als Vollbild-Overlay mit den fünf Punkten groß und der
 * restlichen Sitemap darunter.
 */
export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileOpen]);

  const close = () => setMobileOpen(false);

  return (
    <>
      <header className="site-header fixed inset-x-0 top-0 z-40">
        {/* Infoleiste */}
        <div className="site-header-top text-[0.76rem]">
          <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-4 px-5 md:px-8">
            <LiveStatus />
            <div className="flex items-center gap-5">
              <a href={`tel:${CONTACT.phoneRaw}`} className="hidden sm:inline hover:underline underline-offset-4">
                {CONTACT.phone}
              </a>
              <span className="hidden md:inline opacity-80">
                {CONTACT.street}, {CONTACT.city}
              </span>
              <a
                href={CONTACT.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline underline-offset-4"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        {/* Hauptbar */}
        <div className="site-header-bar border-b">
          <div className="mx-auto flex h-14 max-w-7xl items-center gap-8 px-5 md:px-8 lg:h-16">
            <Logo height={26} />

            <nav aria-label="Hauptnavigation" className="hidden flex-1 justify-center lg:flex">
              <ul className="flex items-center gap-7 text-[0.95rem]">
                {NAV_MAIN.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="opacity-85 transition-opacity hover:opacity-100">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="ml-auto hidden items-center gap-5 md:flex">
              <Link href="/gutscheine" className="text-[0.9rem] font-semibold hover:underline underline-offset-4">
                Gutscheine
              </Link>
              <ReserveButton
                location="header"
                className="inline-flex h-10 items-center rounded-full bg-akzent px-5 text-[0.9rem] font-semibold text-white transition-colors hover:bg-akzent-hover"
              >
                Reservieren
              </ReserveButton>
            </div>

            <button
              type="button"
              aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              className="relative z-50 -mr-2 ml-auto inline-flex flex-col gap-1.5 p-2 md:ml-0 lg:hidden"
            >
              <span className={`block h-[1.5px] w-6 bg-current transition-transform ${mobileOpen ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`block h-[1.5px] w-6 bg-current transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`block h-[1.5px] w-6 bg-current transition-transform ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile-Menü: Vollbild-Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-tanne text-creme transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!mobileOpen}
      >
        <button
          type="button"
          aria-label="Menü schließen"
          onClick={close}
          className="absolute right-4 top-3 z-10 inline-flex h-12 w-12 items-center justify-center text-creme"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7" aria-hidden>
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        </button>

        <div className="flex h-full flex-col overflow-y-auto">
          <div className="h-[92px] shrink-0" />
          <nav aria-label="Hauptnavigation mobil" className="flex flex-1 flex-col px-7 pb-10">
            <ul className="space-y-3">
              {NAV_MAIN.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    className="block font-display text-[2rem] font-light leading-tight"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/gutscheine" onClick={close} className="block font-display text-[2rem] font-light leading-tight">
                  Gutscheine
                </Link>
              </li>
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <ReserveButton
                location="menu"
                className="inline-flex h-12 items-center rounded-full bg-akzent px-7 font-semibold text-white"
              >
                Reservieren
              </ReserveButton>
              <a
                href={`tel:${CONTACT.phoneRaw}`}
                className="inline-flex h-12 items-center rounded-full px-6 font-semibold shadow-[inset_0_0_0_1.5px_currentColor]"
              >
                Anrufen
              </a>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-creme/15 pt-8 text-sm">
              {NAV_GROUPS.filter((g) => g.items).map((group) => (
                <div key={group.href}>
                  <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-akzent">
                    {group.label}
                  </p>
                  <ul className="space-y-1.5">
                    {group.items!.map((item) => (
                      <li key={item.href}>
                        <Link href={item.href} onClick={close} className="text-creme/80">
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div>
                <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-akzent">Kontakt</p>
                <ul className="space-y-1.5 text-creme/80">
                  <li><Link href="/kontakt" onClick={close}>Kontakt &amp; Anfahrt</Link></li>
                  <li><a href={`mailto:${CONTACT.email}`} className="break-all">{CONTACT.email}</a></li>
                  <li><a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer">{CONTACT.instagramHandle}</a></li>
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
