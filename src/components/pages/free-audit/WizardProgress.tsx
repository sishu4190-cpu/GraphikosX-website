import clsx from "clsx";
import { wizardStepLabels } from "./types";

export function WizardProgress({ currentStep }: { currentStep: number }) {
  const total = wizardStepLabels.length;
  return (
    <div className="mb-10">
      <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.15em] text-grey-500">
        <span>
          Step {currentStep + 1} of {total}
        </span>
        <span className="hidden text-ink sm:inline">{wizardStepLabels[currentStep]}</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={currentStep + 1}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Free audit form progress: step ${currentStep + 1} of ${total}`}
        className="flex gap-1.5"
      >
        {wizardStepLabels.map((label, i) => (
          <span
            key={label}
            aria-hidden
            className={clsx("h-1.5 flex-1 rounded-full transition-colors duration-300", i <= currentStep ? "bg-accent" : "bg-ink/10")}
          />
        ))}
      </div>
      <p className="mt-3 text-sm font-medium text-ink sm:hidden">{wizardStepLabels[currentStep]}</p>
    </div>
  );
}
