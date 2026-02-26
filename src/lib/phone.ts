/**
 * Format phone number to +7 (XXX) XXX-XX-XX format
 */
export function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (!digits) return "";

  // Handle 7 or 8 at the start
  if (digits.startsWith("7") || digits.startsWith("8")) {
    const d = digits.startsWith("7") ? digits : "7" + digits.slice(1);
    const match = d.match(/^7(\d{3})(\d{3})(\d{2})(\d{2})$/);
    if (match) {
      return `+7 (${match[1]}) ${match[2]}-${match[3]}-${match[4]}`;
    }
    if (d.length > 1) {
      return `+7 (${d.slice(1, 4)}`;
    }
    return "+7";
  }

  // No country code yet
  const match = digits.match(/^(\d{3})(\d{3})(\d{2})(\d{2})$/);
  if (match) {
    return `+7 (${match[1]}) ${match[2]}-${match[3]}-${match[4]}`;
  }
  if (digits.length > 3) {
    return `+7 (${digits.slice(0, 3)}`;
  }
  if (digits.length > 0) {
    return `+7 (${digits}`;
  }
  return "";
}

/**
 * Validate Russian phone number
 */
export function isValidRuPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  if (digits.length !== 11) return false;
  return digits.startsWith("7") || digits.startsWith("8");
}
