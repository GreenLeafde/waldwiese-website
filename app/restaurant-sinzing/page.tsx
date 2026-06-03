import { RichLanding, type LandingContent } from "@/components/rich-landing";
import { IMG } from "@/lib/images";
import raw from "@/lib/landing/restaurant-sinzing.json";

const content = raw as unknown as LandingContent;

export const metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: "/restaurant-sinzing" },
};

export default function RestaurantSinzingPage() {
  return (
    <RichLanding
      content={content}
      path="/restaurant-sinzing"
      splitImage={{ src: IMG.gebaeudeLuft.src, alt: IMG.gebaeudeLuft.alt }}
    />
  );
}
