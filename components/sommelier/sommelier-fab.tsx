"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SommelierQuiz } from "./sommelier-quiz";
import { STICKY_CTA_PATHS } from "@/lib/season";

/**
 * Schwebender „Frühstücks-Sommelier"-Button (statt Menüpunkt). Öffnet ein
 * Panel mit dem Quiz. Auf der eigenen Sommelier-Seite und während das
 * Consent-Banner offen ist, blendet er sich aus.
 */
export function SommelierFab() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  // Auf der eigenen Seite steht das Quiz schon inline.
  if (pathname === "/fruehstuecks-sommelier") return null;
  // Auf Seiten mit fester Kaufleiste würde er (mobil) den Kaufknopf verdecken.
  if (STICKY_CTA_PATHS.some((p) => pathname?.startsWith(p))) return null;

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Was passt zu dir? Frühstücks-Sommelier öffnen"
          className="fixed bottom-[84px] md:bottom-5 right-4 md:right-5 z-40 inline-flex h-12 w-12 items-center justify-center gap-2.5 rounded-full bg-tanne text-creme shadow-[0_10px_30px_-12px_rgba(1,28,13,.6)] ring-1 ring-creme/15 transition-colors hover:bg-abend md:h-auto md:w-auto md:pl-4 md:pr-5 md:py-3"
        >
          <LeafIcon />
          <span className="hidden font-medium text-sm md:inline">Was passt zu dir?</span>
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6">
          <div
            aria-hidden
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-nacht/60"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Frühstücks-Sommelier"
            className="relative max-h-[92vh] w-full overflow-y-auto rounded-t-[20px] bg-morgen p-5 shadow-2xl sm:max-w-lg sm:rounded-[20px] sm:p-7"
          >
            <div className="flex items-center justify-between px-2 pb-3">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-akzent">
                Was passt zu dir?
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Schließen"
                autoFocus
                className="grid h-9 w-9 place-items-center rounded-full text-tanne/60 transition-colors hover:bg-tanne/10 hover:text-tanne"
              >
                <span aria-hidden className="text-lg leading-none">
                  ✕
                </span>
              </button>
            </div>
            <SommelierQuiz onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}

function LeafIcon() {
  return (
    <svg
      aria-hidden
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 20A7 7 0 0 1 4 13c0-3.5 2.5-7 9-9 .5 6.5-1.5 10-5 12" />
      <path d="M5 21c4-2 7-5 9-9" />
    </svg>
  );
}
