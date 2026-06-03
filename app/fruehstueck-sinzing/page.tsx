import { RichLanding, type LandingContent } from "@/components/rich-landing";
import { IMG } from "@/lib/images";
import raw from "@/lib/landing/fruehstueck-sinzing.json";

const content = raw as unknown as LandingContent;

export const metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: "/fruehstueck-sinzing" },
};

export default function FruehstueckSinzingPage() {
  return (
    <RichLanding
      content={content}
      path="/fruehstueck-sinzing"
      splitImage={{ src: IMG.foodBreakfast.src, alt: IMG.foodBreakfast.alt }}
    />
  );
}
