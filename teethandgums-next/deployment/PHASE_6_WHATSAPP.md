# Phase 6 — Official Meta WhatsApp Cloud API

This integration mirrors the existing appointment/contact emails to WhatsApp using Meta Cloud API directly. No Twilio, WATI, Interakt, AiSensy or other monthly provider is required.

## Environment variables — Next.js and socket server

Use the same values in both applications:

```env
NEXT_PUBLIC_CLIENT_URL=https://www.shahazadtestsite.co.in
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_BUSINESS_ACCOUNT_ID=
WHATSAPP_ADMIN_NUMBER=919876543210
WHATSAPP_GRAPH_API_VERSION=v23.0
WHATSAPP_TEMPLATE_LANGUAGE=en
APPOINTMENT_TICKET_SECRET=replace-with-a-long-random-secret

WHATSAPP_TEMPLATE_APPOINTMENT_RECEIVED=tgc_appointment_received
WHATSAPP_TEMPLATE_ADMIN_NEW_APPOINTMENT=tgc_admin_new_appointment
WHATSAPP_TEMPLATE_APPOINTMENT_CONFIRMED=tgc_appointment_confirmed
WHATSAPP_TEMPLATE_APPOINTMENT_CANCELLED=tgc_appointment_cancelled
WHATSAPP_TEMPLATE_APPOINTMENT_RESCHEDULED=tgc_appointment_rescheduled
WHATSAPP_TEMPLATE_ADMIN_NEW_CONTACT=tgc_admin_new_contact
WHATSAPP_TEMPLATE_CONTACT_REPLY=tgc_contact_reply
WHATSAPP_TEMPLATE_REMINDER_24H=tgc_appointment_reminder_24h
WHATSAPP_TEMPLATE_REMINDER_1H=tgc_appointment_reminder_1h
```

Use the same `APPOINTMENT_TICKET_SECRET` in both processes. `WHATSAPP_ADMIN_NUMBER` must include country code without `+`.

## Meta templates to create and approve

Create Utility templates using these exact body variable orders:

1. `tgc_appointment_received`
   `name, appointment_id, service, doctor, date, time, ticket_url`
2. `tgc_admin_new_appointment`
   `patient_name, phone, email, service, doctor, date, time, patient_message, ticket_url`
3. `tgc_appointment_confirmed`
   `name, appointment_id, service, doctor, date, time, ticket_url`
4. `tgc_appointment_cancelled`
   `name, appointment_id, service, date, time, cancellation_reason, ticket_url`
5. `tgc_appointment_rescheduled`
   `name, appointment_id, service, doctor, new_date, new_time, reason, ticket_url`
6. `tgc_admin_new_contact`
   `name, phone, email, message`
7. `tgc_contact_reply`
   `name, original_message, clinic_reply`
8. `tgc_appointment_reminder_24h`
   `name, appointment_id, service, doctor, date, time, ticket_url`
9. `tgc_appointment_reminder_1h`
   `name, appointment_id, service, doctor, date, time, ticket_url`

The parameter order in Meta must match the order above exactly.

## Existing emails mirrored to WhatsApp

- Patient: appointment request received
- Admin: new appointment
- Patient: appointment confirmed
- Patient: appointment cancelled
- Patient: appointment rescheduled
- Patient: 24-hour reminder
- Patient: 1-hour reminder
- Admin: new contact message
- Patient: admin reply to contact message

Authentication emails and SMTP test emails are intentionally not sent on WhatsApp because they are not patient/admin appointment or enquiry communications.

## Appointment ticket

Every appointment WhatsApp template includes a signed ticket URL. It opens a private, no-index printable appointment ticket. The patient or admin can use Print / Save as PDF. The URL reflects the latest status from MongoDB.

## Number validation

Meta does not offer an official API to check whether an arbitrary number is registered on WhatsApp before form submission. The forms therefore request a valid Indian WhatsApp number and the backend validates the mobile format. Actual delivery status is logged by Meta API response.

## Delivery logging

All WhatsApp attempts are stored in the `notificationdeliveries` MongoDB collection with sent, failed or skipped status and Meta message ID when available.
