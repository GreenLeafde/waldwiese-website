import { RichLanding, type LandingContent } from "@/components/rich-landing";
import { IMG } from "@/lib/images";
import raw from "@/lib/landing/fruehstueck-regensburg.json";

const content = raw as unknown as LandingContent;

export const metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: "/fruehstueck-regensburg" },
};

export default function FruehstueckRegensburgPage() {
  return (
    <RichLanding
      content={content}
      path="/fruehstueck-regensburg"
      splitImage={{
        src: IMG.fruehstueckFoto.src,
        alt: IMG.fruehstueckFoto.alt,
        position: "center 60%",
      }}
    />
  );
}
