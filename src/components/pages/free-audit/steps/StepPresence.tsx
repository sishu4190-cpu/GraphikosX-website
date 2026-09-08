import { RadioPills, TextField } from "@/components/ui/form/fields";
import type { FreeAuditFormState } from "../types";

export function StepPresence({
  form,
  errors,
  update,
}: {
  form: FreeAuditFormState;
  errors: Record<string, string>;
  update: <K extends keyof FreeAuditFormState>(key: K, value: FreeAuditFormState[K]) => void;
}) {
  return (
    <div className="space-y-6">
      <RadioPills
        label="Do you already have a website or active social profiles?"
        value={form.hasPresence}
        onChange={(v) => update("hasPresence", v as FreeAuditFormState["hasPresence"])}
        options={[
          { value: "yes", label: "Yes, I have something live" },
          { value: "no", label: "Not yet, starting from scratch" },
        ]}
        required
      />
      {errors.hasPresence && (
        <p role="alert" className="text-xs font-medium text-red-600">
          {errors.hasPresence}
        </p>
      )}

      {form.hasPresence === "yes" && (
        <div className="space-y-6 rounded-2xl border border-ink/10 bg-grey-100/60 p-5">
          <p className="text-sm text-grey-700">
            Share whatever you have. Any of these can be left blank.
          </p>
          <TextField
            label="Website URL"
            name="websiteUrl"
            value={form.websiteUrl}
            onChange={(v) => update("websiteUrl", v)}
            placeholder="yourbusiness.com"
            error={errors.websiteUrl}
          />
          <TextField
            label="Instagram URL"
            name="instagramUrl"
            value={form.instagramUrl}
            onChange={(v) => update("instagramUrl", v)}
            placeholder="instagram.com/yourbusiness"
            error={errors.instagramUrl}
          />
          <TextField
            label="Google Business Profile URL"
            name="googleBusinessUrl"
            value={form.googleBusinessUrl}
            onChange={(v) => update("googleBusinessUrl", v)}
            placeholder="g.page/yourbusiness"
            error={errors.googleBusinessUrl}
          />
          <TextField
            label="LinkedIn URL"
            name="linkedinUrl"
            value={form.linkedinUrl}
            onChange={(v) => update("linkedinUrl", v)}
            placeholder="linkedin.com/company/yourbusiness"
            error={errors.linkedinUrl}
          />
        </div>
      )}

      {form.hasPresence === "no" && (
        <p className="rounded-2xl border border-ink/10 bg-grey-100/60 p-5 text-sm text-grey-700">
          No problem. We&rsquo;ll factor that in. Skip ahead to the next step.
        </p>
      )}
    </div>
  );
}
