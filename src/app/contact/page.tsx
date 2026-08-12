import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, pageSchemaGraph, webPageSchema } from "@/lib/schema";
import { ContactHero } from "@/components/pages/contact/ContactHero";
import { ContactChannels } from "@/components/pages/contact/ContactChannels";
import { ContactForm } from "@/components/pages/contact/ContactForm";

const PATH = "/contact";
const TITLE = "Contact GraphikosX — The AI-Driven Agency";
const DESCRIPTION =
  "Reach GraphikosX directly on WhatsApp, phone or email, or send a short message about your project. We're a remote-first team and reply as soon as we can.";

export const metadata: Metadata = buildMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

export default function ContactPage() {
  const schema = pageSchemaGraph([
    webPageSchema({ id: "contact", type: "ContactPage", name: TITLE, description: DESCRIPTION, path: PATH }),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Contact", path: PATH },
    ]),
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ContactHero />
      <ContactChannels />
      <ContactForm />
    </>
  );
}
