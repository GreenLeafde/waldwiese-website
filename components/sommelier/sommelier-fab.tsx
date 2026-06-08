"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useConsent } from "@/components/consent-provider";
import { SommelierQuiz } from "./sommelier-quiz";

/**
 * Schwebender „Frühstücks-Sommelier"-Button (statt Menüpunkt). Öffnet ein
 * Panel mit dem Quiz. Auf der eigenen Sommelier-Seite und während das
 * Consent-Banner offen ist, blendet er sich aus.
 */
export function SommelierFab() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { isOpen: consentOpen } = useConsent();

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

  return (
    <>
      {!open && !consentOpen && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Frühstücks-Sommelier öffnen"
          className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 rounded-full bg-waldgruen hover:bg-tonwarm text-mehlcreme pl-4 pr-5 py-3 shadow-lg shadow-waldgruen/25 transition-colors"
        >
          <LeafIcon />
          <span className="font-medium text-sm">Was passt zu dir?</span>
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6">
          <div
            aria-hidden
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-waldgruen-dark/50 backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Frühstücks-Sommelier"
            className="relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-mehlcreme p-3.5 sm:p-4 shadow-2xl"
          >
            <div className="flex items-center justify-between px-2 pb-3">
              <span className="eyebrow no-line text-tonwarm">
                Frühstücks-Sommelier
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Schließen"
                autoFocus
                className="grid h-9 w-9 place-items-center rounded-full text-waldgruen/60 hover:bg-waldgruen/10 hover:text-waldgruen transition-colors"
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
