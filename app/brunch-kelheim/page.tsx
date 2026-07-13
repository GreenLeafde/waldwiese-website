import { RichLanding, type LandingContent } from "@/components/rich-landing";
import { IMG } from "@/lib/images";
import raw from "@/lib/landing/brunch-kelheim.json";

const content = raw as unknown as LandingContent;

export const metadata = {
  title: content.metaTitle,
  description: content.metaDescription,
  alternates: { canonical: "/brunch-kelheim" },
};

export default function BrunchKelheimPage() {
  return (
    <RichLanding
      content={content}
      path="/brunch-kelheim"
      splitImage={{
        src: IMG.terrasseOlivenbaum.src,
        alt: IMG.terrasseOlivenbaum.alt,
        position: "center 50%",
      }}
    />
  );
}
