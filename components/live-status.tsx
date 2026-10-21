"use client";

import { useEffect, useState } from "react";
import { openingStatus, type OpeningStatus } from "@/lib/opening";

/**
 * Grüner/gelber Punkt + „Jetzt geöffnet · Brunch bis 14 Uhr“. Rechnet im
 * Browser (Berlin-Zeit) und aktualisiert sich jede Minute. Beim Server-Render
 * steht noch nichts da, damit Server und Browser nicht verschiedene Uhrzeiten
 * zeigen (Hydration).
 */
export function LiveStatus({ className = "" }: { className?: string }) {
  const [status, setStatus] = useState<OpeningStatus | null>(null);

  useEffect(() => {
    const tick = () => setStatus(openingStatus());
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  if (!status) return <span className={className} aria-hidden />;

  return (
    <span className={`inline-flex items-center gap-2 font-semibold ${className}`}>
      <span
        aria-hidden
        className={`h-2 w-2 rounded-full ${
          status.open ? "bg-[#4fae6c]" : "bg-[#d8a64a]"
        }`}
      />
      {status.text}
    </span>
  );
}
