import { createAppointmentTicketUrl } from "@/lib/appointmentTicket";
import { sendWhatsAppTemplate } from "./client";

type AppointmentData = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  service: string;
  doctor: string;
  date: string;
  timeSlot: string;
  message?: string;
  reason?: string;
};

type ContactData = { id: string; name: string; phone: string; email: string; message: string; replyMessage?: string };

const envTemplate = (key: string, fallback: string) => process.env[key] || fallback;
const adminNumber = () => process.env.WHATSAPP_ADMIN_NUMBER || "";

export function notifyPatientAppointmentReceived(data: AppointmentData) {
  return sendWhatsAppTemplate({ to: data.phone, event: "appointment_received", recipientType: "patient", referenceType: "appointment", referenceId: data.id, templateName: envTemplate("WHATSAPP_TEMPLATE_APPOINTMENT_RECEIVED", "tgc_appointment_received"), parameters: [data.name, data.id, data.service, data.doctor, data.date, data.timeSlot, createAppointmentTicketUrl(data.id)] });
}
export function notifyAdminNewAppointment(data: AppointmentData) {
  return sendWhatsAppTemplate({ to: adminNumber(), event: "admin_new_appointment", recipientType: "admin", referenceType: "appointment", referenceId: data.id, templateName: envTemplate("WHATSAPP_TEMPLATE_ADMIN_NEW_APPOINTMENT", "tgc_admin_new_appointment"), parameters: [data.name, data.phone, data.email || "-", data.service, data.doctor, data.date, data.timeSlot, data.message || "No message", createAppointmentTicketUrl(data.id)] });
}
export function notifyPatientAppointmentConfirmed(data: AppointmentData) {
  return sendWhatsAppTemplate({ to: data.phone, event: "appointment_confirmed", recipientType: "patient", referenceType: "appointment", referenceId: data.id, templateName: envTemplate("WHATSAPP_TEMPLATE_APPOINTMENT_CONFIRMED", "tgc_appointment_confirmed"), parameters: [data.name, data.id, data.service, data.doctor, data.date, data.timeSlot, createAppointmentTicketUrl(data.id)] });
}
export function notifyPatientAppointmentCancelled(data: AppointmentData) {
  return sendWhatsAppTemplate({ to: data.phone, event: "appointment_cancelled", recipientType: "patient", referenceType: "appointment", referenceId: data.id, templateName: envTemplate("WHATSAPP_TEMPLATE_APPOINTMENT_CANCELLED", "tgc_appointment_cancelled"), parameters: [data.name, data.id, data.service, data.date, data.timeSlot, data.reason || "No reason provided", createAppointmentTicketUrl(data.id)] });
}
export function notifyPatientAppointmentRescheduled(data: AppointmentData) {
  return sendWhatsAppTemplate({ to: data.phone, event: "appointment_rescheduled", recipientType: "patient", referenceType: "appointment", referenceId: data.id, templateName: envTemplate("WHATSAPP_TEMPLATE_APPOINTMENT_RESCHEDULED", "tgc_appointment_rescheduled"), parameters: [data.name, data.id, data.service, data.doctor, data.date, data.timeSlot, data.reason || "No reason provided", createAppointmentTicketUrl(data.id)] });
}
export function notifyAdminNewContact(data: ContactData) {
  return sendWhatsAppTemplate({ to: adminNumber(), event: "admin_new_contact", recipientType: "admin", referenceType: "contact", referenceId: data.id, templateName: envTemplate("WHATSAPP_TEMPLATE_ADMIN_NEW_CONTACT", "tgc_admin_new_contact"), parameters: [data.name, data.phone, data.email, data.message] });
}
export function notifyPatientContactReply(data: ContactData) {
  return sendWhatsAppTemplate({ to: data.phone, event: "contact_reply", recipientType: "patient", referenceType: "contact", referenceId: data.id, templateName: envTemplate("WHATSAPP_TEMPLATE_CONTACT_REPLY", "tgc_contact_reply"), parameters: [data.name, data.message, data.replyMessage || "-"] });
}
