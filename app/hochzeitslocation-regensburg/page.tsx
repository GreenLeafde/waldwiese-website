import { RichLanding, type LandingContent } from "@/components/rich-landing";
import { IMG } from "@/lib/images";
import raw from "@/lib/landing/hochzeitslocation-regensburg.json";

const content = raw as unknown as LandingContent;

export const metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: "/hochzeitslocation-regensburg" },
};

export default function HochzeitslocationRegensburgPage() {
  return (
    <RichLanding
      content={content}
      path="/hochzeitslocation-regensburg"
      splitImage={{
        src: IMG.wwFood3.src,
        alt: "Festlich gedeckter Gastraum mit grünen Stühlen im Wald & Wiese",
      }}
    />
  );
}
