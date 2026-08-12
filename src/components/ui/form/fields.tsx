"use client";

import { ChangeEvent, ReactNode } from "react";
import clsx from "clsx";

// Phase 2H: purely decorative focus-state polish (border + soft blue glow,
// slightly richer than the previous ring alone) — validation, aria wiring,
// autocomplete and submit behavior below are all untouched, since usability
// and lead delivery matter more than the animation here.
const inputBase =
  "w-full rounded-xl border border-ink/15 bg-paper px-4 py-3 text-base text-ink placeholder:text-grey-500 transition-[border-color,box-shadow] duration-200 focus:border-accent focus:outline-none focus:shadow-[0_0_0_4px_rgba(29,78,216,0.1)]";

export function FieldShell({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold text-ink">
        {label}
        {required && <span className="ml-1 text-accent">*</span>}
        {!required && <span className="ml-2 text-xs font-normal text-grey-500">Optional</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-2 text-xs text-grey-500">{hint}</p>}
      {error && (
        <p role="alert" className="mt-2 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export function TextField({
  label,
  name,
  value,
  onChange,
  error,
  required,
  hint,
  type = "text",
  placeholder,
  maxLength,
  autoComplete,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  hint?: string;
  type?: string;
  placeholder?: string;
  maxLength?: number;
  autoComplete?: string;
}) {
  return (
    <FieldShell label={label} htmlFor={name} error={error} required={required} hint={hint}>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        autoComplete={autoComplete}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        className={clsx(inputBase, error && "border-red-400 focus:border-red-500 focus:shadow-[0_0_0_4px_rgba(220,38,38,0.12)]")}
      />
    </FieldShell>
  );
}

export function TextAreaField({
  label,
  name,
  value,
  onChange,
  error,
  required,
  hint,
  placeholder,
  maxLength,
  rows = 4,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  hint?: string;
  placeholder?: string;
  maxLength?: number;
  rows?: number;
}) {
  return (
    <FieldShell label={label} htmlFor={name} error={error} required={required} hint={hint}>
      <textarea
        id={name}
        name={name}
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={rows}
        required={required}
        aria-invalid={Boolean(error)}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
        className={clsx(inputBase, "resize-none", error && "border-red-400 focus:border-red-500 focus:shadow-[0_0_0_4px_rgba(220,38,38,0.12)]")}
      />
    </FieldShell>
  );
}

export function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required,
  placeholder = "Select one",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  error?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <FieldShell label={label} htmlFor={name} error={error} required={required}>
      <select
        id={name}
        name={name}
        value={value}
        required={required}
        aria-invalid={Boolean(error)}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
        className={clsx(inputBase, "appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22%238b90a0%22><path d=%22M5.5 7.5l4.5 5 4.5-5%22 stroke=%22%238b90a0%22 stroke-width=%221.5%22 fill=%22none%22/></svg>')] bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-10", error && "border-red-400")}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function ChoiceGrid({
  label,
  options,
  selected,
  onToggle,
  error,
  hint,
  required,
  columns = 2,
}: {
  label: string;
  options: { id: string; label: string }[];
  selected: string[];
  onToggle: (id: string) => void;
  error?: string;
  hint?: string;
  required?: boolean;
  columns?: 1 | 2;
}) {
  return (
    <div>
      <p className="mb-2 block text-sm font-semibold text-ink">
        {label}
        {required && <span className="ml-1 text-accent">*</span>}
        {!required && <span className="ml-2 text-xs font-normal text-grey-500">Optional</span>}
      </p>
      <div className={clsx("grid gap-3", columns === 2 ? "sm:grid-cols-2" : "grid-cols-1")}>
        {options.map((opt) => {
          const isActive = selected.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              role="checkbox"
              aria-checked={isActive}
              onClick={() => onToggle(opt.id)}
              className={clsx(
                "flex items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors duration-200",
                isActive ? "border-accent bg-accent/5 text-ink" : "border-ink/15 text-grey-700 hover:border-ink/30"
              )}
            >
              <span
                aria-hidden
                className={clsx(
                  "mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border",
                  isActive ? "border-accent bg-accent text-paper" : "border-ink/25"
                )}
              >
                {isActive && (
                  <svg viewBox="0 0 12 10" className="h-2.5 w-2.5" fill="none">
                    <path d="M1 5l3.5 3.5L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              {opt.label}
            </button>
          );
        })}
      </div>
      {hint && !error && <p className="mt-2 text-xs text-grey-500">{hint}</p>}
      {error && (
        <p role="alert" className="mt-2 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export function RadioPills({
  label,
  options,
  value,
  onChange,
  required,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <p className="mb-2 block text-sm font-semibold text-ink">
        {label}
        {required && <span className="ml-1 text-accent">*</span>}
      </p>
      <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isActive = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => onChange(opt.value)}
              className={clsx(
                "rounded-full border px-5 py-2.5 text-sm font-medium transition-colors duration-200",
                isActive ? "border-ink bg-ink text-paper" : "border-ink/15 text-grey-700 hover:border-ink/30"
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Hidden honeypot field — a real visitor never sees or fills this. */
export function Honeypot({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden">
      <label htmlFor="company-website-confirm">Leave this field blank</label>
      <input
        id="company-website-confirm"
        name="company-website-confirm"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
