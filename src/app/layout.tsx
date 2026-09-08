import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { FloatingWhatsApp } from "@/components/ui/FloatingWhatsApp";
import { FirstVisitPopup } from "@/components/ui/FirstVisitPopup";
import { SmoothScrollProvider } from "@/components/motion/SmoothScrollProvider";
import { CursorState } from "@/components/motion/CursorState";
import { PageTransition } from "@/components/motion/PageTransition";
import { buildMetadata } from "@/lib/seo";

/**
 * Font-swap CLS fix (found in the Tier 1 exit checklist's Lighthouse run —
 * see CHANGELOG.md). Previously these were loaded via a plain CSS
 * `@font-face` import (`@fontsource-variable/inter` / `.../manrope`), which
 * gives the browser no idea how much space the real font will need — it
 * paints with a fallback font first, then reflows every heading/paragraph
 * when Inter/Manrope finish downloading and swap in. That reflow was the
 * single layout shift Lighthouse was flagging (0.218 on the homepage, most
 * of the CLS score there).
 *
 * `next/font/local` fixes this without changing anything about how the
 * fonts look: it measures the real font's metrics at build time and
 * generates a matching fallback (`ascent-override`/`descent-override`/
 * `size-adjust` on a synthetic @font-face) so the space reserved for text
 * is already correct on first paint, before the real font has even
 * finished loading — so when the swap happens, nothing visibly moves. The
 * swap itself still happens (`display: "swap"`, same as before); only the
 * layout-shifting side effect of it is gone.
 *
 * Pointed at the exact same two font FILES the site already used (copied
 * from `@fontsource-variable/{inter,manrope}`'s `files/` output into
 * `src/fonts/`, latin subset only — the only subset this site has ever
 * actually requested, per the network trace in the same Lighthouse run) —
 * this is a loading-mechanism change, not a font change. `weight` is each
 * family's full variable axis range (Inter 100–900, Manrope 200–800, from
 * their own @font-face declarations), so every weight the site already
 * uses via Tailwind's font-weight classes keeps working.
 */
const inter = localFont({
  src: "../fonts/inter-variable-latin.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

const manrope = localFont({
  src: "../fonts/manrope-variable-latin.woff2",
  variable: "--font-manrope",
  weight: "200 800",
  display: "swap",
});

export const metadata: Metadata = {
  ...buildMetadata({
    title: "GraphikosX: AI-Driven Agency | Strategy, Branding & Tech",
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
    <html lang="en" className={`h-full ${inter.variable} ${manrope.variable}`}>
      <body className="flex min-h-full flex-col antialiased">
        <GoogleAnalytics />
        {/* Phase 3, item 2: mounted once, sitewide — see CursorState.tsx.
            Outside SmoothScrollProvider since it tracks the pointer, not
            scroll; a fixed-position element, so placement in the tree
            doesn't matter for layout. */}
        <CursorState />
        <SmoothScrollProvider>
          <Header />
          {/* Phase 4: only the routed page content transitions between
              navigations — Header/Footer/FloatingWhatsApp stay outside
              PageTransition entirely so they never flicker or re-animate
              on route change. See PageTransition.tsx for the full rationale. */}
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <FloatingWhatsApp />
          <FirstVisitPopup />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
