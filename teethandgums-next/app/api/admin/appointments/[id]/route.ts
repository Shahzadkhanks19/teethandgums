import mongoose from "mongoose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { verifyAdminRequest } from "@/lib/auth";
import { verifyCsrfToken } from "@/lib/csrf";
import connectDB from "@/lib/db";
import logActivity from "@/lib/logActivity";
import Appointment from "@/lib/models/Appointment";
import emitSocketEvent from "@/lib/socketEmitter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(
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

    await connectDB();

    const appointment = await Appointment.findByIdAndDelete(id)
      .select({
        _id: 1,
        name: 1,
        date: 1,
        timeSlot: 1,
      })
      .lean()
      .exec();

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

    const deletedAppointment = {
      id: appointment._id,
      name: appointment.name,
      date: appointment.date,
      timeSlot: appointment.timeSlot,
    };

    const sideEffectResults = await Promise.allSettled([
      emitSocketEvent({
        eventName: "appointmentDeleted",
        payload: {
          appointment: deletedAppointment,
        },
      }),
      logActivity(
        "Appointment Deleted",
        `Patient: ${appointment.name}, Date: ${appointment.date}, Time: ${appointment.timeSlot}`,
        "appointment",
      ),
    ]);

    sideEffectResults.forEach((result) => {
      if (result.status === "rejected") {
        console.error(
          "Delete appointment side effect failed:",
          result.reason,
        );
      }
    });

    return NextResponse.json(
      {
        success: true,
        message: "Appointment deleted successfully",
      },
      {
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    console.error("Delete Appointment Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete appointment",
      },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
