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
  | "internal_error";

export interface LeadApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  code?: LeadApiErrorCode;
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

export function normalizePhoneDigits(phone: string) {
  return phone.replace(/\D/g, "");
}

export function isValidRuPhone(phone: string) {
  const digits = normalizePhoneDigits(phone);
  if (digits.length !== 11) return false;
  return digits.startsWith("7") || digits.startsWith("8");
}
