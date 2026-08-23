import mongoose from "mongoose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { verifyAdminRequest } from "@/lib/auth";
import { verifyCsrfToken } from "@/lib/csrf";
import connectDB from "@/lib/db";
import {
  patientAppointmentRescheduledEmail,
} from "@/lib/email/appointmentTemplates";
import logActivity from "@/lib/logActivity";
import Appointment from "@/lib/models/Appointment";
import BlockedSlot from "@/lib/models/BlockedSlot";
import { sanitizeInput } from "@/lib/sanitize";
import sendEmail from "@/lib/sendEmail";
import emitSocketEvent from "@/lib/socketEmitter";
import { notifyPatientAppointmentRescheduled } from "@/lib/whatsapp/notifications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const INDIA_TIME_ZONE_OFFSET = "+05:30";

type RescheduleBody = {
  date?: string;
  timeSlot?: string;
  rescheduleReason?: string;
};

type NormalizedRescheduleBody = {
  date: string;
  timeSlot: string;
  rescheduleReason: string;
};

function normalizeRescheduleBody(
  body: RescheduleBody,
): NormalizedRescheduleBody {
  return {
    date: body.date?.trim() || "",
    timeSlot:
      body.timeSlot?.trim().replace(/\s+/g, " ") || "",
    rescheduleReason:
      body.rescheduleReason?.trim() || "",
  };
}

function validateRescheduleBody(
  data: NormalizedRescheduleBody,
): string | null {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const timeSlotRegex =
    /^(0?[1-9]|1[0-2]):[0-5]\d\s(AM|PM)$/;

  if (!data.date || !data.timeSlot) {
    return "New date and time slot are required";
  }

  if (!dateRegex.test(data.date)) {
    return "Please select a valid appointment date";
  }

  if (!timeSlotRegex.test(data.timeSlot)) {
    return "Please select a valid time slot";
  }

  if (data.rescheduleReason.length > 500) {
    return "Reschedule reason should not be more than 500 characters";
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

  const isoValue = `${date}T${String(hours).padStart(
    2,
    "0",
  )}:${String(minutes).padStart(
    2,
    "0",
  )}:00${INDIA_TIME_ZONE_OFFSET}`;

  const parsedDate = new Date(isoValue);

  return Number.isNaN(parsedDate.getTime())
    ? null
    : parsedDate;
}

export async function PATCH(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    const decoded = verifyAdminRequest(req);

    if (!decoded) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authorized",
        },
        {
          status: 401,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    if (!verifyCsrfToken(req)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid CSRF token",
        },
        {
          status: 403,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    const { id } = await params;

    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid appointment id",
        },
        {
          status: 400,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    let rawBody: RescheduleBody;

    try {
      rawBody = sanitizeInput(
        await req.json(),
      ) as RescheduleBody;

      if (JSON.stringify(rawBody).length > 10_000) {
        return NextResponse.json(
          {
            success: false,
            message: "Request body is too large",
          },
          {
            status: 413,
            headers: { "Cache-Control": "no-store" },
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
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    const body = normalizeRescheduleBody(rawBody);
    const validationError =
      validateRescheduleBody(body);

    if (validationError) {
      return NextResponse.json(
        {
          success: false,
          message: validationError,
        },
        {
          status: 400,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    const slotDateTime = convertSlotToDateTime(
      body.date,
      body.timeSlot,
    );

    if (
      !slotDateTime ||
      slotDateTime.getTime() <= Date.now()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You cannot reschedule to a past slot",
        },
        {
          status: 400,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    await connectDB();

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return NextResponse.json(
        {
          success: false,
          message: "Appointment not found",
        },
        {
          status: 404,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    const oldDate = appointment.date;
    const oldTime = appointment.timeSlot;

    const [
      existingAppointment,
      fullDayBlocked,
      slotBlocked,
    ] = await Promise.all([
      Appointment.exists({
        _id: { $ne: id },
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

    if (existingAppointment) {
      return NextResponse.json(
        {
          success: false,
          message: "This slot is already booked",
        },
        {
          status: 409,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    if (fullDayBlocked) {
      return NextResponse.json(
        {
          success: false,
          message: "This date is blocked by clinic",
        },
        {
          status: 409,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    if (slotBlocked) {
      return NextResponse.json(
        {
          success: false,
          message: "This slot is blocked by clinic",
        },
        {
          status: 409,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    appointment.date = body.date;
    appointment.timeSlot = body.timeSlot;
    appointment.rescheduleReason =
      body.rescheduleReason;
    appointment.status = "rescheduled";

    /*
     * The appointment now has a new date and time.
     * Reset both reminder flags so the socket reminder service
     * can send fresh 24-hour and 1-hour reminders.
     */
    appointment.reminder24hSent = false;
    appointment.reminder1hSent = false;

    await appointment.save();

    const appointmentObject = appointment.toObject();

    const sideEffectResults = await Promise.allSettled([
      emitSocketEvent({
        eventName: "appointmentUpdated",
        payload: {
          appointment: appointmentObject,
        },
      }),
      sendEmail({
        to: appointment.email,
        subject:
          "Appointment Rescheduled - Teeth and Gums Care",
        html: patientAppointmentRescheduledEmail({
          name: appointment.name,
          email: appointment.email,
          phone: appointment.phone,
          service: appointment.service,
          doctor: appointment.doctor,
          date: appointment.date,
          timeSlot: appointment.timeSlot,
          reason: body.rescheduleReason,
        }),
      }),
      notifyPatientAppointmentRescheduled({
        id: appointment._id.toString(),
        name: appointment.name,
        email: appointment.email,
        phone: appointment.phone,
        service: appointment.service,
        doctor: appointment.doctor,
        date: appointment.date,
        timeSlot: appointment.timeSlot,
        reason: body.rescheduleReason,
      }),
      logActivity(
        "Appointment Rescheduled",
        `Patient: ${appointment.name}, Old: ${oldDate} ${oldTime}, New: ${appointment.date} ${appointment.timeSlot}`,
        "appointment",
      ),
    ]);

    sideEffectResults.forEach((result) => {
      if (result.status === "rejected") {
        console.error(
          "Appointment reschedule side effect failed:",
          result.reason,
        );
      }
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Appointment rescheduled successfully",
        appointment: appointmentObject,
      },
      {
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    console.error(
      "Reschedule Appointment Error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to reschedule appointment",
      },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}