"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "./logo";
import { CONTACT, NAV, NAV_FULL, RESERVATION_URL } from "@/lib/site";

/** WhatsApp-Deeplink aus der Nummer (nur Ziffern). */
const WHATSAPP_URL = `https://wa.me/${CONTACT.whatsapp.replace(/\D/g, "")}`;

function PhoneIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.7 21 3 13.3 3 3.9c0-.6.5-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.3 1l-2.2 2.3z" />
    </svg>
  );
}

function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.6 15l-1 3.7 3.8-1A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-2.5.7.7-2.4-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1-.7-.3-1.5-.7-2.1-1.5-.2-.3.2-.4.5-.9.1-.2 0-.3 0-.5l-.8-1.7c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3.9 2.4c.1.2 1.7 2.6 4.1 3.5 1.5.6 2 .6 2.8.5.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.5-.3z" />
    </svg>
  );
}

function InstagramIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * Header in zwei Ebenen:
 *  - Oben: schmale Waldgrün-Kontaktleiste (Telefon, WhatsApp, Instagram) —
 *    auf Desktop & Handy direkt erreichbar.
 *  - Darunter: Hauptbar mit Logo, Navigation und Reservieren-Button.
 * Immer sichtbar (kein Verstecken), damit Kontakt jederzeit griffbereit ist.
 * Mobile-Menü als Vollbild-Overlay.
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

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40">
        {/* Kontaktleiste */}
        <div className="bg-waldgruen-dark text-mehlcreme/85">
          <div className="mx-auto max-w-7xl px-5 md:px-8 h-9 flex items-center justify-between gap-4 text-[0.72rem] md:text-[0.76rem]">
            <div className="flex items-center gap-4 md:gap-6">
              <a
                href={`tel:${CONTACT.phoneRaw}`}
                className="inline-flex items-center gap-1.5 hover:text-tonwarm transition-colors"
              >
                <PhoneIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{CONTACT.phone}</span>
                <span className="sm:hidden">Anrufen</span>
              </a>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-tonwarm transition-colors"
              >
                <WhatsAppIcon className="w-3.5 h-3.5" />
                WhatsApp
              </a>
            </div>
            <div className="flex items-center gap-5">
              <span className="hidden md:inline text-mehlcreme/55 tracking-wide">
                Sinzing · bei Regensburg
              </span>
              <a
                href={CONTACT.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex items-center gap-1.5 hover:text-tonwarm transition-colors"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Instagram</span>
              </a>
            </div>
          </div>
        </div>

        {/* Hauptbar */}
        <div className="bg-mehlcreme/95 backdrop-blur-md border-b border-waldgruen/10">
          <div className="mx-auto max-w-7xl px-5 md:px-8 h-14 flex items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center gap-6">
            <div className="lg:justify-self-start">
              <Logo />
            </div>

            <nav
              aria-label="Hauptnavigation"
              className="hidden lg:flex items-center gap-9 text-[0.78rem] tracking-[0.18em] uppercase text-waldgruen/80 justify-self-center"
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
              className="hidden md:inline-flex items-center gap-2 bg-tonwarm hover:bg-tonwarm-dark text-white text-[0.72rem] tracking-[0.16em] uppercase px-5 py-2.5 rounded-full transition-colors justify-self-end"
            >
              Reservieren
            </a>

            <button
              type="button"
              aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden inline-flex flex-col gap-1.5 p-2 -mr-2 text-waldgruen relative z-50"
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
          <div className="h-[92px] flex-shrink-0" />

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
              <div className="flex flex-wrap gap-3">
                <a
                  href={RESERVATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center gap-2 bg-tonwarm hover:bg-tonwarm-dark text-white px-7 py-3.5 rounded-full font-medium transition-colors"
                >
                  Reservieren <span aria-hidden>→</span>
                </a>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center gap-2 border border-mehlcreme/40 hover:border-tonwarm hover:text-tonwarm px-6 py-3.5 rounded-full font-medium transition-colors"
                >
                  <WhatsAppIcon className="w-4 h-4" /> WhatsApp
                </a>
              </div>

              <div className="space-y-1.5 text-mehlcreme/75 pt-2">
                <p>
                  <a href={`tel:${CONTACT.phoneRaw}`} className="hover:text-tonwarm">
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
