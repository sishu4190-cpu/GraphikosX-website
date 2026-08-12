"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { freeAuditHref } from "@/lib/freeAuditUrl";
import { track, type AnalyticsEvent } from "@/lib/analytics/track";

/**
 * The "Get a Free Audit" button used on service and industry pages. A thin
 * client wrapper so the click can be tracked (service_cta_clicked /
 * industry_cta_clicked) while the pages that render it stay Server
 * Components — only serializable props (strings) cross that boundary.
 */
export function TrackedFreeAuditButton({
  source,
  industry,
  event,
  variant = "primary",
  className,
  children,
}: {
  source: string;
  industry?: string;
  event: AnalyticsEvent;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  children: ReactNode;
}) {
  return (
    <Button
      href={freeAuditHref({ source, industry })}
      variant={variant}
      className={className}
      onClick={() => track(event, { source, industry })}
    >
      {children}
    </Button>
  );
}
