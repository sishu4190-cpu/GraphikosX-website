"use client";

import { useState, type FormEvent } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TextField, TextAreaField, RadioPills, Honeypot } from "@/components/ui/form/fields";
import { SubmitFallback } from "@/components/ui/form/SubmitFallback";
import { isValidEmail, isValidPhone } from "@/lib/validation/rules";
import { submitLead } from "@/lib/leads/submit";
import { track } from "@/lib/analytics/track";
import type { SubmitResult, UtmParams } from "@/lib/leads/types";

interface ContactFormState {
  name: string;
  businessName: string;
  whatsapp: string;
  email: string;
  subject: string;
  message: string;
  preferredContact: "whatsapp" | "phone" | "email" | "";
  honeypot: string;
}

const initialState: ContactFormState = {
  name: "",
  businessName: "",
  whatsapp: "",
  email: "",
  subject: "",
  message: "",
  preferredContact: "",
  honeypot: "",
};

const UTM_KEYS: (keyof UtmParams)[] = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];

export function ContactForm() {
  const readParams = () => (typeof window === "undefined" ? null : new URLSearchParams(window.location.search));

  const [form, setForm] = useState<ContactFormState>(initialState);
  const [sourcePage] = useState<string>(() => readParams()?.get("source") || "contact");
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | undefined>();
  const [fallback, setFallback] = useState<SubmitResult["fallback"]>();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const update = <K extends keyof ContactFormState>(key: K, value: ContactFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validate = (): Record<string, string> => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!form.businessName.trim()) next.businessName = "Please enter your business or organisation name.";
    if (!form.whatsapp.trim() || !isValidPhone(form.whatsapp)) next.whatsapp = "Enter a valid WhatsApp or phone number.";
    if (form.email && !isValidEmail(form.email)) next.email = "Enter a valid email address, or leave it blank.";
    if (!form.subject.trim()) next.subject = "Let us know what this is about.";
    return next;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(undefined);
    setFallback(undefined);
    try {
      const result = await submitLead({
        type: "contact",
        name: form.name,
        businessName: form.businessName,
        whatsapp: form.whatsapp,
        email: form.email || undefined,
        preferredContact: form.preferredContact || undefined,
        message: form.message || undefined,
        subject: form.subject,
        sourcePage,
        utm,
        honeypot: form.honeypot,
      });

      if (result.ok) {
        track("contact_form_submitted", { subject: form.subject });
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

  if (isSubmitted) {
    return (
      <section className="relative overflow-hidden bg-paper py-16 md:py-24">
        <CursorAtmosphere tone="light" />
        <Container className="relative max-w-2xl">
          <div className="gx-card rounded-2xl border border-ink/10 bg-grey-100/60 p-0 text-center">
            <div className="gx-card-content p-8 sm:p-12">
              <span aria-hidden className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-paper">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
                  <path d="M4 12.5l5 5L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">Message sent — thank you.</h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-grey-700">
                We&rsquo;ve received your message and will get back to you soon.
              </p>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-paper py-16 md:py-24">
      <CursorAtmosphere tone="light" />
      <Container className="relative max-w-2xl">
        <Reveal>
          <SectionHeader eyebrow="Send a message" title="Or tell us a bit about what you need" />
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <TextField label="Your name" name="name" value={form.name} onChange={(v) => update("name", v)} required autoComplete="name" maxLength={100} error={errors.name} />
            <TextField
              label="Business / organisation name"
              name="businessName"
              value={form.businessName}
              onChange={(v) => update("businessName", v)}
              required
              autoComplete="organization"
              maxLength={120}
              error={errors.businessName}
            />
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
            />
            <TextField label="Email address" name="email" value={form.email} onChange={(v) => update("email", v)} type="email" autoComplete="email" error={errors.email} />
            <TextField
              label="What's this about?"
              name="subject"
              value={form.subject}
              onChange={(v) => update("subject", v)}
              required
              placeholder="e.g. New project enquiry, partnership, press"
              maxLength={150}
              error={errors.subject}
            />
            <TextAreaField
              label="Message"
              name="message"
              value={form.message}
              onChange={(v) => update("message", v)}
              placeholder="Tell us a bit more — the more context, the better we can help."
              maxLength={1000}
            />
            <RadioPills
              label="Preferred way to be contacted"
              value={form.preferredContact}
              onChange={(v) => update("preferredContact", v as ContactFormState["preferredContact"])}
              options={[
                { value: "whatsapp", label: "WhatsApp" },
                { value: "phone", label: "Phone call" },
                { value: "email", label: "Email" },
              ]}
            />

            <Honeypot value={form.honeypot} onChange={(v) => update("honeypot", v)} />

            {submitError && (
              <div className="space-y-3">
                <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {submitError}
                </p>
                {fallback && <SubmitFallback fallback={fallback} source="contact-form" />}
              </div>
            )}

            <p className="text-xs text-grey-500">
              By submitting, you agree to be contacted about your enquiry. See our{" "}
              <a href="/privacy" className="underline hover:text-accent">
                Privacy Policy
              </a>
              .
            </p>

            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Sending…" : "Send Message"}
            </Button>
          </form>
        </Reveal>
      </Container>
    </section>
  );
}
