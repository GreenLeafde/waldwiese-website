"use client";

import { useEffect, useState } from "react";
import { activeNotice, type Notice } from "@/lib/notices";

const STORAGE_KEY = "ww_notice_closed";

/**
 * Karte oben rechts unter dem Header für einen aktuellen Hinweis (lib/notices.ts). Erscheint nur
 * im gültigen Zeitraum und lässt sich schließen; das merkt sich der Browser pro
 * Hinweis. Ohne gespeicherte Daten (privates Fenster) erscheint sie einfach wieder.
 */
export function NoticeCard() {
  const [notice, setNotice] = useState<Notice | null>(null);

  useEffect(() => {
    const n = activeNotice();
    if (!n) return;
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === n.id) return;
    } catch {
      /* Speicher gesperrt: Karte trotzdem zeigen */
    }
    setNotice(n);
  }, []);

  if (!notice) return null;

  const close = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, notice.id);
    } catch {
      /* egal */
    }
    setNotice(null);
  };

  return (
    <div
      role="status"
      className="fixed left-4 right-4 top-[104px] z-30 ml-auto max-w-sm rounded-[18px] bg-tanne p-5 pr-12 text-creme shadow-[0_18px_40px_rgba(2,41,20,0.35)] lg:top-[116px]"
    >
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-akzent">Kurz zur Info</p>
      <p className="mt-1.5 font-display text-xl font-light leading-snug">{notice.title}</p>
      <p className="mt-2 text-sm leading-relaxed text-creme/80">{notice.text}</p>
      <button
        type="button"
        onClick={close}
        aria-label="Hinweis schließen"
        className="absolute right-2 top-2 inline-flex h-10 w-10 items-center justify-center text-creme/70 hover:text-creme"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5" aria-hidden>
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="18" y1="6" x2="6" y2="18" />
        </svg>
      </button>
    </div>
  );
}
