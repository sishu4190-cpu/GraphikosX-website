export interface FreeAuditFormState {
  name: string;
  businessName: string;
  industry: string;
  hasPresence: "yes" | "no" | "";
  websiteUrl: string;
  instagramUrl: string;
  googleBusinessUrl: string;
  linkedinUrl: string;
  currentSituation: string;
  biggestChallenge: string;
  improvementAreas: string[];
  goals: string[];
  goalsDetail: string;
  whatsapp: string;
  email: string;
  preferredContact: "whatsapp" | "phone" | "email" | "";
  honeypot: string;
}

export const initialFreeAuditForm: FreeAuditFormState = {
  name: "",
  businessName: "",
  industry: "",
  hasPresence: "",
  websiteUrl: "",
  instagramUrl: "",
  googleBusinessUrl: "",
  linkedinUrl: "",
  currentSituation: "",
  biggestChallenge: "",
  improvementAreas: [],
  goals: [],
  goalsDetail: "",
  whatsapp: "",
  email: "",
  preferredContact: "",
  honeypot: "",
};

export const wizardStepLabels = [
  "Your Business",
  "Digital Presence",
  "Where Things Stand",
  "Your Goals",
  "How to Reach You",
  "Review & Submit",
] as const;
