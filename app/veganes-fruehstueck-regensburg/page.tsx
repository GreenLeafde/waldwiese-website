import { RichLanding, type LandingContent } from "@/components/rich-landing";
import { IMG } from "@/lib/images";
import raw from "@/lib/landing/veganes-fruehstueck-regensburg.json";

const content = raw as unknown as LandingContent;

export const metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: "/veganes-fruehstueck-regensburg" },
};

export default function VeganesFruehstueckRegensburgPage() {
  return (
    <RichLanding
      content={content}
      path="/veganes-fruehstueck-regensburg"
      splitImage={{ src: IMG.foodBowl.src, alt: IMG.foodBowl.alt }}
    />
  );
}
