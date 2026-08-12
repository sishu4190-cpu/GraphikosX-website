import { TextField, SelectField } from "@/components/ui/form/fields";
import { industries } from "@/lib/data/industries";
import type { FreeAuditFormState } from "../types";

const industryOptions = [
  ...industries.map((i) => ({ value: i.slug, label: i.name })),
  { value: "other", label: "Other / not listed" },
];

export function StepBusiness({
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
      <TextField
        label="Your name"
        name="name"
        value={form.name}
        onChange={(v) => update("name", v)}
        required
        autoComplete="name"
        placeholder="Your full name"
        maxLength={100}
        error={errors.name}
      />
      <TextField
        label="Business name"
        name="businessName"
        value={form.businessName}
        onChange={(v) => update("businessName", v)}
        required
        autoComplete="organization"
        placeholder="Your business or brand name"
        maxLength={120}
        error={errors.businessName}
      />
      <SelectField
        label="Which industry best describes your business?"
        name="industry"
        value={form.industry}
        onChange={(v) => update("industry", v)}
        options={industryOptions}
        required
        error={errors.industry}
      />
    </div>
  );
}
