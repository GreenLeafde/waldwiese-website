import { RichLanding, type LandingContent } from "@/components/rich-landing";
import { IMG } from "@/lib/images";
import raw from "@/lib/landing/feiern.json";

const content = raw as unknown as LandingContent;

export const metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: "/feiern" },
};

/**
 * Eigene Feiern (Geburtstag, Taufe, Firmenfeier, Hochzeit) — also uns als
 * Location buchen. Öffentliche Termine mit Ticketverkauf liegen getrennt
 * davon unter /veranstaltungen.
 */
export default function FeiernPage() {
  return (
    <RichLanding
      content={content}
      path="/feiern"
      splitImage={{
        src: IMG.wwFood3.src,
        alt: "Festlich gedeckter Gastraum mit grünen Stühlen im Wald & Wiese",
      }}
    />
  );
}
