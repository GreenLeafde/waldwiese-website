"use client";

import { useEffect } from "react";
import type { Tone } from "./day-section";

/**
 * Setzt den Ton der ganzen Seite (Header, Logo) für Unterseiten, die
 * durchgehend dunkel sind (Abend, Events, Gutscheine). Eine Seite rendert
 * `<PageTone tone="dunkel" />` einmal; beim Verlassen springt es auf hell.
 */
export function PageTone({ tone }: { tone: Tone }) {
  useEffect(() => {
    document.documentElement.dataset.tone = tone;
    return () => {
      document.documentElement.dataset.tone = "hell";
    };
  }, [tone]);
  return null;
}
