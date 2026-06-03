import { RichLanding, type LandingContent } from "@/components/rich-landing";
import { IMG } from "@/lib/images";
import raw from "@/lib/landing/veranstaltungen.json";

const content = raw as unknown as LandingContent;

export const metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: "/veranstaltungen" },
};

export default function VeranstaltungenPage() {
  return (
    <RichLanding
      content={content}
      path="/veranstaltungen"
      splitImage={{
        src: IMG.wwEvent.src,
        alt: "Abend mit Gästen im Wald & Wiese",
      }}
    />
  );
}
