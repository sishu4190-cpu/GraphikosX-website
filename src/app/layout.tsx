import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/manrope";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "GraphikosX — AI-Driven Agency | Strategy, Branding & Tech",
    description:
      "GraphikosX is an AI-driven digital presence agency helping businesses across 10 industries build authority, visibility and trust.",
    path: "/",
  }),
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/brand/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // JSON-LD is deliberately NOT emitted here: every route (including the
  // homepage) provides its own single schema graph via pageSchemaGraph()/
  // homepageSchemaGraph() in its own page.tsx. A layout-level script would
  // render on every route in addition to each page's own script, silently
  // duplicating the Organization/Person/WebSite nodes on every non-home
  // page (see Phase 2F structured-data audit).
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col antialiased">
        <GoogleAnalytics />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
