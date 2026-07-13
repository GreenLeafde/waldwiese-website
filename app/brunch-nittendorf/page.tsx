import { RichLanding, type LandingContent } from "@/components/rich-landing";
import { IMG } from "@/lib/images";
import raw from "@/lib/landing/brunch-nittendorf.json";

const content = raw as unknown as LandingContent;

export const metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: "/brunch-nittendorf" },
};

export default function BrunchNittendorfPage() {
  return (
    <RichLanding
      content={content}
      path="/brunch-nittendorf"
      splitImage={{
        src: IMG.terrasseTische.src,
        alt: IMG.terrasseTische.alt,
        position: "center 50%",
      }}
    />
  );
}
