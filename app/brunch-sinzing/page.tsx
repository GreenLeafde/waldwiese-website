import { RichLanding, type LandingContent } from "@/components/rich-landing";
import { IMG } from "@/lib/images";
import raw from "@/lib/landing/brunch-sinzing.json";

const content = raw as unknown as LandingContent;

export const metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: "/brunch-sinzing" },
};

export default function BrunchSinzingPage() {
  return (
    <RichLanding
      content={content}
      path="/brunch-sinzing"
      splitImage={{
        src: IMG.fruehstueckFoto.src,
        alt: IMG.fruehstueckFoto.alt,
        position: "center 60%",
      }}
    />
  );
}
