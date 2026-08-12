import type { Metadata } from "next";
import { company, SITE_URL } from "@/lib/data/company";

type BuildMetadataArgs = {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  noIndex?: boolean;
};

export function buildMetadata({ title, description, path, ogImage, noIndex }: BuildMetadataArgs): Metadata {
  const url = `${SITE_URL}${path}`;
  const image = ogImage ?? company.ogImagePath;

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: company.name,
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: `${company.name} — ${title}` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
