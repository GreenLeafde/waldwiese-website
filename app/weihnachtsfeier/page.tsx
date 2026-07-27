import { RichLanding, type LandingContent } from "@/components/rich-landing";
import { IMG } from "@/lib/images";
import raw from "@/lib/landing/weihnachtsfeier.json";

const content = raw as unknown as LandingContent;

export const metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: "/weihnachtsfeier" },
};

export default function WeihnachtsfeierPage() {
  return (
    <RichLanding
      content={content}
      path="/weihnachtsfeier"
      splitImage={{
        src: IMG.gebaeudeAbend.src,
        alt: IMG.gebaeudeAbend.alt,
        position: "center 55%",
      }}
    />
  );
}
