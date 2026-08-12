import { TextAreaField, ChoiceGrid } from "@/components/ui/form/fields";
import { improvementAreas } from "@/lib/data/free-audit-options";
import type { FreeAuditFormState } from "../types";

export function StepSituation({
  form,
  errors,
  update,
  toggleArea,
}: {
  form: FreeAuditFormState;
  errors: Record<string, string>;
  update: <K extends keyof FreeAuditFormState>(key: K, value: FreeAuditFormState[K]) => void;
  toggleArea: (id: string) => void;
}) {
  return (
    <div className="space-y-6">
      <ChoiceGrid
        label="Which areas feel like they need the most work?"
        options={improvementAreas}
        selected={form.improvementAreas}
        onToggle={toggleArea}
        required
        error={errors.improvementAreas}
        hint="Select all that apply."
      />
      <TextAreaField
        label="What's your biggest challenge right now?"
        name="biggestChallenge"
        value={form.biggestChallenge}
        onChange={(v) => update("biggestChallenge", v)}
        placeholder="e.g. We get inquiries but they rarely convert into paying clients."
        maxLength={1000}
        error={errors.biggestChallenge}
      />
      <TextAreaField
        label="Anything else about your current situation?"
        name="currentSituation"
        value={form.currentSituation}
        onChange={(v) => update("currentSituation", v)}
        placeholder="e.g. We've tried running ads before but didn't see results."
        maxLength={1000}
      />
    </div>
  );
}
