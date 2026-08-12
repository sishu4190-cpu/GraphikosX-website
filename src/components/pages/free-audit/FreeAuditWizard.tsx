"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { WizardProgress } from "./WizardProgress";
import { StepBusiness } from "./steps/StepBusiness";
import { StepPresence } from "./steps/StepPresence";
import { StepSituation } from "./steps/StepSituation";
import { StepGoals } from "./steps/StepGoals";
import { StepContact } from "./steps/StepContact";
import { StepReview } from "./steps/StepReview";
import { FreeAuditSuccess } from "./FreeAuditSuccess";
import { initialFreeAuditForm, wizardStepLabels, type FreeAuditFormState } from "./types";
import { isValidEmail, isValidPhone, isValidUrl } from "@/lib/validation/rules";
import { submitLead } from "@/lib/leads/submit";
import { track } from "@/lib/analytics/track";
import type { SubmitResult, UtmParams } from "@/lib/leads/types";

const UTM_KEYS: (keyof UtmParams)[] = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

export function FreeAuditWizard() {
  // Prefill source/UTM/industry from the URL via lazy initializers (computed
  // once, during the first render) rather than an effect + setState. These
  // values only ever feed the submission payload and analytics calls — they
  // are never rendered into markup — so a client/server difference here
  // cannot cause a hydration mismatch.
  const readParams = () => (typeof window === "undefined" ? null : new URLSearchParams(window.location.search));

  const [form, setForm] = useState<FreeAuditFormState>(() => {
    const params = readParams();
    const industry = params?.get("industry");
    return industry ? { ...initialFreeAuditForm, industry } : initialFreeAuditForm;
  });
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>();
  const [fallback, setFallback] = useState<SubmitResult["fallback"]>();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [sourcePage] = useState<string>(() => readParams()?.get("source") || "free-audit-direct");
  const [utm] = useState<UtmParams>(() => {
    const params = readParams();
    if (!params) return {};
    const next: UtmParams = {};
    for (const key of UTM_KEYS) {
      const value = params.get(key);
      if (value) next[key] = value;
    }
    return next;
  });

  const hasTrackedStart = useRef(false);
  useEffect(() => {
    if (hasTrackedStart.current) return;
    hasTrackedStart.current = true;
    track("free_audit_started", { source: sourcePage });
  }, [sourcePage]);

  const update = <K extends keyof FreeAuditFormState>(key: K, value: FreeAuditFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const toggleArea = (id: string) => {
    setForm((prev) => ({
      ...prev,
      improvementAreas: prev.improvementAreas.includes(id)
        ? prev.improvementAreas.filter((a) => a !== id)
        : [...prev.improvementAreas, id],
    }));
    setErrors((prev) => ({ ...prev, improvementAreas: "" }));
  };

  const toggleGoal = (id: string) => {
    setForm((prev) => ({
      ...prev,
      goals: prev.goals.includes(id) ? prev.goals.filter((g) => g !== id) : [...prev.goals, id],
    }));
    setErrors((prev) => ({ ...prev, goals: "" }));
  };

  function validateStep(index: number): Record<string, string> {
    const next: Record<string, string> = {};

    if (index === 0) {
      if (!form.name.trim()) next.name = "Please enter your name.";
      if (!form.businessName.trim()) next.businessName = "Please enter your business name.";
      if (!form.industry) next.industry = "Please select an industry.";
    }

    if (index === 1) {
      if (!form.hasPresence) next.hasPresence = "Please select an option.";
      if (form.hasPresence === "yes") {
        if (form.websiteUrl && !isValidUrl(form.websiteUrl)) next.websiteUrl = "Enter a valid URL, or leave this blank.";
        if (form.instagramUrl && !isValidUrl(form.instagramUrl)) next.instagramUrl = "Enter a valid URL, or leave this blank.";
        if (form.googleBusinessUrl && !isValidUrl(form.googleBusinessUrl))
          next.googleBusinessUrl = "Enter a valid URL, or leave this blank.";
        if (form.linkedinUrl && !isValidUrl(form.linkedinUrl)) next.linkedinUrl = "Enter a valid URL, or leave this blank.";
      }
    }

    if (index === 2) {
      if (form.improvementAreas.length === 0) next.improvementAreas = "Select at least one area.";
      if (!form.biggestChallenge.trim()) next.biggestChallenge = "This helps us understand what to focus on.";
    }

    if (index === 3) {
      if (form.goals.length === 0) next.goals = "Select at least one goal.";
    }

    if (index === 4) {
      if (!form.whatsapp.trim() || !isValidPhone(form.whatsapp)) next.whatsapp = "Enter a valid WhatsApp or phone number.";
      if (form.email && !isValidEmail(form.email)) next.email = "Enter a valid email address, or leave it blank.";
    }

    return next;
  }

  const stepHeadingRef = useRef<HTMLHeadingElement>(null);

  const goToStep = (index: number) => {
    setStep(index);
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Move focus to the step heading whenever the step changes, so screen
  // reader users get an announcement of the new step instead of focus
  // silently staying on the (now-gone) previous "Continue"/"Back" button.
  useEffect(() => {
    stepHeadingRef.current?.focus();
  }, [step]);

  const handleNext = () => {
    const stepErrors = validateStep(step);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    track("free_audit_step_completed", { step: step + 1, stepName: wizardStepLabels[step] });
    goToStep(Math.min(step + 1, wizardStepLabels.length - 1));
  };

  const handleBack = () => goToStep(Math.max(step - 1, 0));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(undefined);
    setFallback(undefined);
    try {
      const result = await submitLead({
        type: "free-audit",
        name: form.name,
        businessName: form.businessName,
        whatsapp: form.whatsapp,
        email: form.email || undefined,
        preferredContact: form.preferredContact || undefined,
        industry: form.industry,
        sourcePage,
        utm,
        honeypot: form.honeypot,
        improvementAreas: form.improvementAreas,
        websiteUrl: form.hasPresence === "yes" ? form.websiteUrl || undefined : undefined,
        instagramUrl: form.hasPresence === "yes" ? form.instagramUrl || undefined : undefined,
        googleBusinessUrl: form.hasPresence === "yes" ? form.googleBusinessUrl || undefined : undefined,
        linkedinUrl: form.hasPresence === "yes" ? form.linkedinUrl || undefined : undefined,
        currentSituation: form.currentSituation || undefined,
        biggestChallenge: form.biggestChallenge || undefined,
        goals: form.goals,
        goalsDetail: form.goalsDetail || undefined,
      });

      if (result.ok) {
        track("free_audit_submitted", { industry: form.industry, source: sourcePage });
        setIsSubmitted(true);
      } else {
        setSubmitError(result.error ?? "Something went wrong. Please try again.");
        setFallback(result.fallback);
      }
    } catch {
      setSubmitError("Something went wrong submitting this. Please try again, or reach us directly on WhatsApp.");
      setFallback({ whatsappUrl: "https://wa.me/917984010393", mailtoUrl: "mailto:sales@graphikosx.in" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLastStep = step === wizardStepLabels.length - 1;

  const stepContent = useMemo(() => {
    switch (step) {
      case 0:
        return <StepBusiness form={form} errors={errors} update={update} />;
      case 1:
        return <StepPresence form={form} errors={errors} update={update} />;
      case 2:
        return <StepSituation form={form} errors={errors} update={update} toggleArea={toggleArea} />;
      case 3:
        return <StepGoals form={form} errors={errors} update={update} toggleGoal={toggleGoal} />;
      case 4:
        return <StepContact form={form} errors={errors} update={update} />;
      case 5:
        return <StepReview form={form} goToStep={goToStep} submitError={submitError} fallback={fallback} update={update} />;
      default:
        return null;
    }
  }, [step, form, errors, submitError, fallback]);

  if (isSubmitted) {
    return (
      <section className="bg-paper py-16 md:py-24">
        <Container className="max-w-2xl">
          <FreeAuditSuccess name={form.name} businessName={form.businessName} />
        </Container>
      </section>
    );
  }

  return (
    <section id="audit-form" className="bg-paper py-16 md:py-24">
      <Container className="max-w-2xl">
        <Reveal>
          <WizardProgress currentStep={step} />
          <h2 ref={stepHeadingRef} tabIndex={-1} className="sr-only outline-none">
            Free Audit form, step {step + 1} of {wizardStepLabels.length}: {wizardStepLabels[step]}
          </h2>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (isLastStep) {
                handleSubmit();
              } else {
                handleNext();
              }
            }}
          >
            {stepContent}

            <div className="mt-10 flex items-center justify-between gap-4">
              <Button variant="ghost" type="button" onClick={handleBack} disabled={step === 0 || isSubmitting} className={step === 0 ? "invisible" : ""}>
                Back
              </Button>
              {isLastStep ? (
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting…" : "Submit Free Audit Request"}
                </Button>
              ) : (
                <Button type="submit" variant="primary">
                  Continue
                </Button>
              )}
            </div>
          </form>
        </Reveal>
      </Container>
    </section>
  );
}
