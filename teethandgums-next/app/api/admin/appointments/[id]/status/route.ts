import mongoose from "mongoose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { verifyAdminRequest } from "@/lib/auth";
import { verifyCsrfToken } from "@/lib/csrf";
import connectDB from "@/lib/db";
import {
  patientAppointmentCancelledEmail,
  patientAppointmentConfirmedEmail,
} from "@/lib/email/appointmentTemplates";
import logActivity from "@/lib/logActivity";
import Appointment, {
  type AppointmentStatus,
} from "@/lib/models/Appointment";
import { sanitizeInput } from "@/lib/sanitize";
import sendEmail from "@/lib/sendEmail";
import emitSocketEvent from "@/lib/socketEmitter";
import {
  notifyPatientAppointmentCancelled,
  notifyPatientAppointmentConfirmed,
} from "@/lib/whatsapp/notifications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedStatuses = new Set<AppointmentStatus>([
  "pending",
  "confirmed",
  "rescheduled",
  "cancelled",
]);

type UpdateAppointmentStatusBody = {
  status?: string;
  cancelReason?: string;
};

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

    let body: UpdateAppointmentStatusBody;

    try {
      body = sanitizeInput(
        await req.json(),
      ) as UpdateAppointmentStatusBody;

      if (JSON.stringify(body).length > 10_000) {
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

    const status =
      body.status?.trim().toLowerCase() as
        | AppointmentStatus
        | undefined;

    const cancelReason = body.cancelReason?.trim() || "";

    if (!status) {
      return NextResponse.json(
        {
          success: false,
          message: "Status is required",
        },
        {
          status: 400,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    if (!allowedStatuses.has(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid appointment status",
        },
        {
          status: 400,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }

    if (
      status === "cancelled" &&
      cancelReason.length > 500
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Cancel reason should not be more than 500 characters",
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

    appointment.status = status;

    if (status === "cancelled") {
      appointment.cancelReason = cancelReason;
    }

    await appointment.save();

    const appointmentObject = appointment.toObject();

    const appointmentEmailData = {
      name: appointment.name,
      email: appointment.email,
      phone: appointment.phone,
      service: appointment.service,
      doctor: appointment.doctor,
      date: appointment.date,
      timeSlot: appointment.timeSlot,
      reason: cancelReason,
    };

    const whatsappData = {
      id: appointment._id.toString(),
      ...appointmentEmailData,
    };

    const sideEffects: Promise<unknown>[] = [
      emitSocketEvent({
        eventName: "appointmentUpdated",
        payload: {
          appointment: appointmentObject,
        },
      }),
      logActivity(
        "Appointment Status Updated",
        `Patient: ${appointment.name}, Status: ${status}`,
        "appointment",
      ),
    ];

    if (status === "confirmed") {
      sideEffects.push(
        sendEmail({
          to: appointment.email,
          subject:
            "Appointment Confirmed - Teeth and Gums Care",
          html: patientAppointmentConfirmedEmail(
            appointmentEmailData,
          ),
        }),
        notifyPatientAppointmentConfirmed(whatsappData),
      );
    }

    if (status === "cancelled") {
      sideEffects.push(
        sendEmail({
          to: appointment.email,
          subject:
            "Appointment Cancelled - Teeth and Gums Care",
          html: patientAppointmentCancelledEmail(
            appointmentEmailData,
          ),
        }),
        notifyPatientAppointmentCancelled(whatsappData),
      );
    }

    const sideEffectResults = await Promise.allSettled(
      sideEffects,
    );

    sideEffectResults.forEach((result) => {
      if (result.status === "rejected") {
        console.error(
          "Appointment status side effect failed:",
          result.reason,
        );
      }
    });

    return NextResponse.json(
      {
        success: true,
        message: `Appointment ${status} successfully`,
        appointment: appointmentObject,
      },
      {
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    console.error(
      "Update Appointment Status Error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update appointment",
      },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
