import { RichLanding, type LandingContent } from "@/components/rich-landing";
import { IMG } from "@/lib/images";
import raw from "@/lib/landing/brunch-regensburg.json";

const content = raw as unknown as LandingContent;

export const metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: "/brunch-regensburg" },
};

export default function BrunchRegensburgPage() {
  return (
    <RichLanding
      content={content}
      path="/brunch-regensburg"
      splitImage={{
        src: IMG.fruehstueckFoto.src,
        alt: IMG.fruehstueckFoto.alt,
        position: "center 60%",
      }}
    />
  );
}
