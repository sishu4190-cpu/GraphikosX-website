import { ChoiceGrid, TextAreaField } from "@/components/ui/form/fields";
import { auditGoals } from "@/lib/data/free-audit-options";
import type { FreeAuditFormState } from "../types";

export function StepGoals({
  form,
  errors,
  update,
  toggleGoal,
}: {
  form: FreeAuditFormState;
  errors: Record<string, string>;
  update: <K extends keyof FreeAuditFormState>(key: K, value: FreeAuditFormState[K]) => void;
  toggleGoal: (id: string) => void;
}) {
  return (
    <div className="space-y-6">
      <ChoiceGrid
        label="What are you hoping to achieve?"
        options={auditGoals}
        selected={form.goals}
        onToggle={toggleGoal}
        required
        error={errors.goals}
        hint="Select all that apply."
      />
      <TextAreaField
        label="Anything specific you'd add?"
        name="goalsDetail"
        value={form.goalsDetail}
        onChange={(v) => update("goalsDetail", v)}
        placeholder="Optional: add any detail that helps us understand your priorities."
        maxLength={1000}
      />
    </div>
  );
}
