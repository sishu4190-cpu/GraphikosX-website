import { TextField, RadioPills } from "@/components/ui/form/fields";
import type { FreeAuditFormState } from "../types";

export function StepContact({
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
        label="WhatsApp or phone number"
        name="whatsapp"
        value={form.whatsapp}
        onChange={(v) => update("whatsapp", v)}
        required
        type="tel"
        autoComplete="tel"
        placeholder="+91 98765 43210"
        error={errors.whatsapp}
        hint="We'll use this to send your audit and follow up."
      />
      <TextField
        label="Email address"
        name="email"
        value={form.email}
        onChange={(v) => update("email", v)}
        type="email"
        autoComplete="email"
        placeholder="you@business.com"
        error={errors.email}
      />
      <RadioPills
        label="Preferred way to be contacted"
        value={form.preferredContact}
        onChange={(v) => update("preferredContact", v as FreeAuditFormState["preferredContact"])}
        options={[
          { value: "whatsapp", label: "WhatsApp" },
          { value: "phone", label: "Phone call" },
          { value: "email", label: "Email" },
        ]}
      />
    </div>
  );
}
