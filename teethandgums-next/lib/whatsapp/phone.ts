export function normalizeIndianWhatsAppNumber(value: string): string | null {
  const digits = String(value || "").replace(/\D/g, "");
  const local = digits.startsWith("91") && digits.length === 12 ? digits.slice(2) : digits;
  return /^[6-9]\d{9}$/.test(local) ? `91${local}` : null;
}
