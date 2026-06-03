import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { RichLanding } from "@/components/rich-landing";
import { ORTE, ORT_MAP } from "@/lib/landing/orte";

type Props = { params: Promise<{ ort: string }> };

export function generateStaticParams() {
  return ORTE.map((o) => ({ ort: o.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ort } = await params;
  const entry = ORT_MAP[ort];
  if (!entry) return {};
  return {
    title: entry.content.metaTitle,
    description: entry.content.metaDescription,
    alternates: { canonical: `/restaurant/${ort}` },
  };
}

export default async function OrtPage({ params }: Props) {
  const { ort } = await params;
  const entry = ORT_MAP[ort];
  if (!entry) notFound();
  return (
    <RichLanding
      content={entry.content}
      path={`/restaurant/${ort}`}
      splitImage={entry.image}
    />
  );
}
