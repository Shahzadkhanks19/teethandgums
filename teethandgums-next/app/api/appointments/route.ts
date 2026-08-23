import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import createNotification from "@/lib/createNotification";
import connectDB from "@/lib/db";
import {
  adminNewAppointmentEmail,
  patientAppointmentReceivedEmail,
} from "@/lib/email/appointmentTemplates";
import Appointment, { type AppointmentDocument } from "@/lib/models/Appointment";
import BlockedSlot from "@/lib/models/BlockedSlot";
import {
  getRateLimitHeaders,
  rateLimit,
  type RateLimitResult,
} from "@/lib/rateLimit";
import { sanitizeInput } from "@/lib/sanitize";
import sendEmail from "@/lib/sendEmail";
import emitSocketEvent from "@/lib/socketEmitter";
import {
  notifyAdminNewAppointment,
  notifyPatientAppointmentReceived,
} from "@/lib/whatsapp/notifications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_REQUEST_BODY_BYTES = 100_000;
const INDIA_TIME_ZONE_OFFSET = "+05:30";

type AppointmentBody = {
  name?: string;
  phone?: string;
  email?: string;
  service?: string;
  date?: string;
  timeSlot?: string;
  doctor?: string;
  message?: string;
};

type NormalizedAppointmentBody = {
  name: string;
  phone: string;
  email: string;
  service: string;
  date: string;
  timeSlot: string;
  doctor: string;
  message: string;
};

function normalizeAppointmentBody(
  body: AppointmentBody,
): NormalizedAppointmentBody {
  return {
    name: body.name?.trim().replace(/\s+/g, " ") || "",
    phone: body.phone?.trim().replace(/\D/g, "") || "",
    email: body.email?.trim().toLowerCase() || "",
    service: body.service?.trim().replace(/\s+/g, " ") || "",
    date: body.date?.trim() || "",
    timeSlot: body.timeSlot?.trim().replace(/\s+/g, " ") || "",
    doctor: body.doctor?.trim().replace(/\s+/g, " ") || "",
    message: body.message?.trim() || "",
  };
}

function validateAppointmentData(
  data: NormalizedAppointmentBody,
): string | null {
  const indianPhoneRegex = /^[6-9]\d{9}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const timeSlotRegex = /^(0?[1-9]|1[0-2]):[0-5]\d\s(AM|PM)$/;

  if (
    !data.name ||
    !data.phone ||
    !data.email ||
    !data.service ||
    !data.date ||
    !data.timeSlot ||
    !data.doctor
  ) {
    return "Please fill all required fields";
  }

  if (data.name.length < 2 || data.name.length > 100) {
    return "Name must be between 2 and 100 characters";
  }

  if (!indianPhoneRegex.test(data.phone)) {
    return "Please enter a valid 10-digit Indian WhatsApp number";
  }

  if (!emailRegex.test(data.email) || data.email.length > 254) {
    return "Please enter a valid email address";
  }

  if (data.service.length > 160) {
    return "Selected service is invalid";
  }

  if (data.doctor.length > 120) {
    return "Selected doctor is invalid";
  }

  if (!dateRegex.test(data.date)) {
    return "Please select a valid appointment date";
  }

  if (!timeSlotRegex.test(data.timeSlot)) {
    return "Please select a valid time slot";
  }

  if (data.message.length > 500) {
    return "Message should not be more than 500 characters";
  }

  return null;
}

function convertSlotToDateTime(
  date: string,
  slot: string,
): Date | null {
  const slotMatch = slot.match(
    /^(0?[1-9]|1[0-2]):([0-5]\d)\s(AM|PM)$/,
  );

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !slotMatch) {
    return null;
  }

  let hours = Number(slotMatch[1]);
  const minutes = Number(slotMatch[2]);
  const modifier = slotMatch[3];

  if (modifier === "PM" && hours !== 12) {
    hours += 12;
  }

  if (modifier === "AM" && hours === 12) {
    hours = 0;
  }

  const isoValue = `${date}T${String(hours).padStart(2, "0")}:${String(
    minutes,
  ).padStart(2, "0")}:00${INDIA_TIME_ZONE_OFFSET}`;

  const parsedDate = new Date(isoValue);

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

function rateLimitResponse(
  message: string,
  limit: RateLimitResult,
) {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    {
      status: 429,
      headers: {
        ...getRateLimitHeaders(limit),
        "Cache-Control": "no-store",
      },
    },
  );
}

function jsonSizeTooLarge(body: unknown): boolean {
  return JSON.stringify(body).length > MAX_REQUEST_BODY_BYTES;
}

function formatAppointmentDate(date: string): string {
  const parsedDate = new Date(`${date}T00:00:00${INDIA_TIME_ZONE_OFFSET}`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

async function getBookingConflict(
  body: NormalizedAppointmentBody,
): Promise<string | null> {
  const [duplicateUserAppointment, bookedSlot, blockedDay, blockedSlot] =
    await Promise.all([
      Appointment.exists({
        $or: [{ email: body.email }, { phone: body.phone }],
        date: body.date,
        timeSlot: body.timeSlot,
        status: { $ne: "cancelled" },
      }),
      Appointment.exists({
        date: body.date,
        timeSlot: body.timeSlot,
        status: { $ne: "cancelled" },
      }),
      BlockedSlot.exists({
        date: body.date,
        type: "day",
      }),
      BlockedSlot.exists({
        date: body.date,
        timeSlot: body.timeSlot,
        type: "slot",
      }),
    ]);

  if (duplicateUserAppointment) {
    return "You already have an appointment booked for this date and time.";
  }

  if (bookedSlot) {
    return "This slot is already booked. Please choose another time slot.";
  }

  if (blockedDay) {
    return "Appointments are closed for this date.";
  }

  if (blockedSlot) {
    return "This slot is blocked by clinic. Please choose another time slot.";
  }

  return null;
}

async function runAppointmentSideEffects(
  appointment: AppointmentDocument,
) {
  const appointmentEmailData = {
    name: appointment.name,
    email: appointment.email,
    phone: appointment.phone,
    service: appointment.service,
    doctor: appointment.doctor,
    date: appointment.date,
    timeSlot: appointment.timeSlot,
    message: appointment.message,
  };

  const whatsappData = {
    id: appointment._id.toString(),
    ...appointmentEmailData,
  };

  const notification = await createNotification({
    title: "New Appointment",
    message: `${appointment.name} booked ${appointment.service} with ${
      appointment.doctor
    } on ${formatAppointmentDate(appointment.date)} at ${
      appointment.timeSlot
    }.`,
    type: "appointment",
    referenceType: "appointment",
    referenceId: appointment._id.toString(),
    priority: "important",
  });

  const tasks: Promise<unknown>[] = [
    sendEmail({
      to: appointment.email,
      subject:
        "Appointment Request Received - Teeth and Gums Care",
      html: patientAppointmentReceivedEmail(
        appointmentEmailData,
      ),
    }),
    notifyPatientAppointmentReceived(whatsappData),
    emitSocketEvent({
      eventName: "newAppointment",
      payload: {
        appointment: appointment.toObject(),
        notification,
      },
    }),
  ];

  if (process.env.EMAIL_USER) {
    tasks.push(
      sendEmail({
        to: process.env.EMAIL_USER,
        subject:
          "New Appointment Request - Teeth and Gums Care",
        html: adminNewAppointmentEmail(
          appointmentEmailData,
        ),
      }),
      notifyAdminNewAppointment(whatsappData),
    );
  }

  const results = await Promise.allSettled(tasks);

  results.forEach((result) => {
    if (result.status === "rejected") {
      console.error(
        "Appointment side effect failed:",
        result.reason,
      );
    }
  });

  return notification;
}

export async function POST(req: NextRequest) {
  try {
    const ipLimit = rateLimit(req, {
      keyPrefix: "appointment:ip",
      windowMs: 15 * 60 * 1000,
      maxRequests: 20,
    });

    if (!ipLimit.success) {
      return rateLimitResponse(
        "Too many appointment requests. Please try again after 15 minutes.",
        ipLimit,
      );
    }

    let rawBody: AppointmentBody;

    try {
      rawBody = sanitizeInput(
        await req.json(),
      ) as AppointmentBody;

      if (jsonSizeTooLarge(rawBody)) {
        return NextResponse.json(
          {
            success: false,
            message: "Request body is too large",
          },
          {
            status: 413,
            headers: {
              "Cache-Control": "no-store",
            },
          },
        );
      }
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body",
        },
        {
          status: 400,
          headers: {
            "Cache-Control": "no-store",
          },
        },
      );
    }

    const body = normalizeAppointmentBody(rawBody);

    const validationError = validateAppointmentData(body);

    if (validationError) {
      return NextResponse.json(
        {
          success: false,
          message: validationError,
        },
        {
          status: 400,
          headers: {
            "Cache-Control": "no-store",
          },
        },
      );
    }

    const [emailLimit, phoneLimit] = [
      rateLimit(req, {
        keyPrefix: "appointment:email",
        identifier: body.email,
        windowMs: 60 * 60 * 1000,
        maxRequests: 5,
      }),
      rateLimit(req, {
        keyPrefix: "appointment:phone",
        identifier: body.phone,
        windowMs: 60 * 60 * 1000,
        maxRequests: 5,
      }),
    ];

    if (!emailLimit.success) {
      return rateLimitResponse(
        "Too many appointment requests from this email. Please try again later.",
        emailLimit,
      );
    }

    if (!phoneLimit.success) {
      return rateLimitResponse(
        "Too many appointment requests from this phone number. Please try again later.",
        phoneLimit,
      );
    }

    await connectDB();

    const appointmentDateTime = convertSlotToDateTime(
      body.date,
      body.timeSlot,
    );

    if (
      !appointmentDateTime ||
      appointmentDateTime.getTime() <= Date.now()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You cannot book an appointment for a past date or time.",
        },
        {
          status: 400,
          headers: {
            "Cache-Control": "no-store",
          },
        },
      );
    }

    const conflictError = await getBookingConflict(body);

    if (conflictError) {
      return NextResponse.json(
        {
          success: false,
          message: conflictError,
        },
        {
          status: 409,
          headers: {
            "Cache-Control": "no-store",
          },
        },
      );
    }

    const appointment = await Appointment.create(body);

    await runAppointmentSideEffects(appointment);

    return NextResponse.json(
      {
        success: true,
        message: "Appointment booked successfully",
        appointment: appointment.toObject(),
      },
      {
        status: 201,
        headers: {
          "Cache-Control": "no-store",
          ...getRateLimitHeaders(ipLimit),
        },
      },
    );
  } catch (error) {
    console.error("Appointment API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to book appointment",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}
