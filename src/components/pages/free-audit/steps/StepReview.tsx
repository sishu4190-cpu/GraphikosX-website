import { industries } from "@/lib/data/industries";
import { improvementAreas, auditGoals } from "@/lib/data/free-audit-options";
import { Honeypot } from "@/components/ui/form/fields";
import { SubmitFallback } from "@/components/ui/form/SubmitFallback";
import type { SubmitResult } from "@/lib/leads/types";
import type { FreeAuditFormState } from "../types";

function ReviewRow({ label, value, onEdit }: { label: string; value: string; onEdit: () => void }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-4 border-b border-ink/8 py-3 last:border-b-0">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-grey-500">{label}</p>
        <p className="mt-1 text-sm text-ink">{value}</p>
      </div>
      <button type="button" onClick={onEdit} className="flex-shrink-0 text-xs font-semibold text-accent hover:underline">
        Edit
      </button>
    </div>
  );
}

export function StepReview({
  form,
  goToStep,
  submitError,
  fallback,
  update,
}: {
  form: FreeAuditFormState;
  goToStep: (step: number) => void;
  submitError?: string;
  fallback?: SubmitResult["fallback"];
  update: <K extends keyof FreeAuditFormState>(key: K, value: FreeAuditFormState[K]) => void;
}) {
  const industryName = industries.find((i) => i.slug === form.industry)?.name ?? (form.industry === "other" ? "Other" : "");
  const areaLabels = form.improvementAreas.map((id) => improvementAreas.find((a) => a.id === id)?.label ?? id).join(", ");
  const goalLabels = form.goals.map((id) => auditGoals.find((g) => g.id === id)?.label ?? id).join(", ");
  const presenceLinks = [form.websiteUrl, form.instagramUrl, form.googleBusinessUrl, form.linkedinUrl].filter(Boolean).join(", ");

  return (
    <div className="space-y-6">
      <p className="text-sm text-grey-700">Review your answers before submitting. You can edit any section.</p>

      <div className="rounded-2xl border border-ink/10 bg-grey-100/60 px-5">
        <ReviewRow label="Name" value={form.name} onEdit={() => goToStep(0)} />
        <ReviewRow label="Business" value={form.businessName} onEdit={() => goToStep(0)} />
        <ReviewRow label="Industry" value={industryName} onEdit={() => goToStep(0)} />
        <ReviewRow
          label="Digital presence"
          value={form.hasPresence === "yes" ? presenceLinks || "Has presence, no links shared" : "Starting from scratch"}
          onEdit={() => goToStep(1)}
        />
        <ReviewRow label="Focus areas" value={areaLabels} onEdit={() => goToStep(2)} />
        <ReviewRow label="Biggest challenge" value={form.biggestChallenge} onEdit={() => goToStep(2)} />
        <ReviewRow label="Goals" value={goalLabels} onEdit={() => goToStep(3)} />
        <ReviewRow label="WhatsApp / phone" value={form.whatsapp} onEdit={() => goToStep(4)} />
        <ReviewRow label="Email" value={form.email} onEdit={() => goToStep(4)} />
        <ReviewRow
          label="Preferred contact"
          value={form.preferredContact ? form.preferredContact.charAt(0).toUpperCase() + form.preferredContact.slice(1) : ""}
          onEdit={() => goToStep(4)}
        />
      </div>

      {/* Honeypot lives inside the form but stays invisible and unused by real visitors. */}
      <Honeypot value={form.honeypot} onChange={(v) => update("honeypot", v)} />

      {submitError && (
        <div className="space-y-3">
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {submitError}
          </p>
          {fallback && <SubmitFallback fallback={fallback} source="free-audit-form" />}
        </div>
      )}

      <p className="text-xs text-grey-500">
        By submitting, you agree to be contacted about your Free Audit. We don&rsquo;t share your details with anyone else. See our{" "}
        <a href="/privacy" className="underline hover:text-accent">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
