import { RichLanding, type LandingContent } from "@/components/rich-landing";
import { IMG } from "@/lib/images";
import raw from "@/lib/landing/hundefreundliches-restaurant-regensburg.json";

const content = raw as unknown as LandingContent;

export const metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: "/hundefreundliches-restaurant-regensburg" },
};

export default function HundefreundlichesRestaurantPage() {
  return (
    <RichLanding
      content={content}
      path="/hundefreundliches-restaurant-regensburg"
      splitImage={{
        src: IMG.hundTerrasse.src,
        alt: IMG.hundTerrasse.alt,
        position: "center 40%",
      }}
    />
  );
}
