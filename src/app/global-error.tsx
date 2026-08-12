"use client";

import { useEffect } from "react";

/**
 * Last-resort error boundary — only triggers if the root layout itself
 * throws (header/footer/providers), which is why it must render its own
 * <html>/<body> rather than relying on layout.tsx. Kept intentionally
 * minimal (no Tailwind/Container/Button dependency) since we can't assume
 * anything above this point rendered successfully. Never shows the raw
 * error message or stack trace to the visitor.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[GraphikosX] Unhandled root layout error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "2rem",
          color: "#000",
          background: "#fff",
        }}
      >
        <div style={{ maxWidth: 480 }}>
          <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "#1D4ED8" }}>
            GraphikosX
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginTop: 12 }}>Something went wrong.</h1>
          <p style={{ marginTop: 12, color: "#3a3d45", lineHeight: 1.6 }}>
            Please try again in a moment. If this keeps happening, email us at{" "}
            <a href="mailto:sales@graphikosx.in" style={{ color: "#1D4ED8" }}>
              sales@graphikosx.in
            </a>
            .
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: 24,
              padding: "12px 24px",
              borderRadius: 999,
              background: "#000",
              color: "#fff",
              border: "none",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
