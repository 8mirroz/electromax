export type LeadMode = "live" | "mock" | "disabled";

export interface LeadPayload {
  objectType: string;
  areaSquareMeters: number;
  complexityCoef: number;
  estimatedPrice: number;
  contactPhone: string;
  leadNote?: string;
  turnstileToken?: string;
  projectTraySummary?: unknown;
}

export type LeadApiErrorCode =
  | "validation_error"
  | "captcha_failed"
  | "upstream_error"
  | "internal_error"
  | "rate_limited"
  | "lead_disabled";

export interface LeadApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  code?: LeadApiErrorCode;
  mode?: LeadMode;
  delivery?: {
    telegram?: {
      configured: boolean;
      attempted: boolean;
      ok: boolean;
      error?: string;
    };
    email?: {
      configured: boolean;
      attempted: boolean;
      ok: boolean;
      error?: string;
    };
    attemptedChannels?: string[];
    deliveredChannels?: string[];
  };
}

export function getLeadMode(): LeadMode {
  const mode = process.env.NEXT_PUBLIC_LEADS_MODE;
  if (mode === "mock" || mode === "disabled") return mode;
  return "live";
}

export function isLeadDemoMode() {
  return getLeadMode() === "mock";
}

export function normalizePhoneDigits(phone: string) {
  return phone.replace(/\D/g, "");
}

export function isValidRuPhone(phone: string) {
  const digits = normalizePhoneDigits(phone);
  if (digits.length !== 11) return false;
  return digits.startsWith("7") || digits.startsWith("8");
}
