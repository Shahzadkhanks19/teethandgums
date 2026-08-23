import crypto from "node:crypto";

const SITE_URL = (process.env.NEXT_PUBLIC_CLIENT_URL || "http://localhost:3000").replace(/\/$/, "");

function secret(): string {
  return process.env.APPOINTMENT_TICKET_SECRET || process.env.JWT_SECRET || "development-ticket-secret-change-me";
}

export function createAppointmentTicketToken(id: string): string {
  return crypto.createHmac("sha256", secret()).update(id).digest("hex");
}

export function verifyAppointmentTicketToken(id: string, token: string): boolean {
  const expected = createAppointmentTicketToken(id);
  if (!/^[a-f0-9]{64}$/i.test(token || "")) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(token));
}

export function createAppointmentTicketUrl(id: string): string {
  return `${SITE_URL}/api/appointments/${encodeURIComponent(id)}/ticket?token=${createAppointmentTicketToken(id)}`;
}
