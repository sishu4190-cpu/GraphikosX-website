/**
 * Shared, server-trusted validation. Client-side validation mirrors these
 * rules for instant feedback, but nothing here assumes the client played
 * fair -- every field is re-checked when the submission actually arrives.
 */

export function sanitizeText(value: unknown, maxLength = 500): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/<[^>]*>/g, "")
    .split("")
    .filter((ch) => {
      const code = ch.charCodeAt(0);
      return !(code < 32 && code !== 9 && code !== 10 && code !== 13);
    })
    .join("")
    .trim()
    .slice(0, maxLength);
}

export function isValidEmail(value: string): boolean {
  if (!value) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isValidPhone(value: string): boolean {
  const cleaned = value.replace(/[\s\-()]/g, "");
  return /^\+?[0-9]{7,15}$/.test(cleaned);
}

export function isValidUrl(value: string): boolean {
  if (!value) return true;
  try {
    const url = new URL(value.startsWith("http") ? value : `https://${value}`);
    return Boolean(url.hostname && url.hostname.includes("."));
  } catch {
    return false;
  }
}

export function normalizePhone(value: string): string {
  const digits = value.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits;
  if (digits.length === 10) return `+91${digits}`;
  return `+${digits}`;
}

export const FIELD_ERRORS = {
  required: (label: string) => `${label} is required.`,
  email: "Enter a valid email address.",
  phone: "Enter a valid WhatsApp or phone number.",
  url: "Enter a valid URL, or leave this field blank.",
  tooLong: (label: string) => `${label} is too long.`,
};
