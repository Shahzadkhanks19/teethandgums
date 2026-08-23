import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import connectDB from "@/lib/db";
import Appointment from "@/lib/models/Appointment";
import BlockedSlot from "@/lib/models/BlockedSlot";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

type AppointmentSlotResult = {
  timeSlot: string;
};

type BlockedSlotResult = {
  _id: unknown;
  date: string;
  timeSlot: string;
  type: "day" | "slot";
  reason: string;
};

export async function GET(req: NextRequest) {
  try {
    const date = req.nextUrl.searchParams.get("date")?.trim() || "";

    if (!DATE_PATTERN.test(date)) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid date in YYYY-MM-DD format is required",
        },
        {
          status: 400,
          headers: {
            "Cache-Control": "no-store",
          },
        },
      );
    }

    await connectDB();

    const [appointments, blockedSlots] = await Promise.all([
      Appointment.find({
        date,
        status: { $ne: "cancelled" },
      })
        .select({ _id: 0, timeSlot: 1 })
        .lean<AppointmentSlotResult[]>()
        .exec(),
      BlockedSlot.find({ date })
        .select({
          date: 1,
          timeSlot: 1,
          type: 1,
          reason: 1,
        })
        .sort({ type: 1, timeSlot: 1 })
        .lean<BlockedSlotResult[]>()
        .exec(),
    ]);

    const fullDayBlock = blockedSlots.find(
      (item) => item.type === "day",
    );

    const slotBlocks = blockedSlots.filter(
      (item) => item.type === "slot",
    );

    const bookedSlots = appointments.map(
      (item) => item.timeSlot,
    );

    const blockedSlotTimes = slotBlocks.map(
      (item) => item.timeSlot,
    );

    const blockedSlotReasons = Object.fromEntries(
      slotBlocks.map((item) => [
        item.timeSlot,
        item.reason || "This slot is blocked by clinic.",
      ]),
    );

    return NextResponse.json(
      {
        success: true,
        isFullDayBlocked: Boolean(fullDayBlock),
        fullDayReason: fullDayBlock?.reason || "",
        unavailableSlots: [
          ...new Set([
            ...bookedSlots,
            ...blockedSlotTimes,
          ]),
        ],
        bookedSlots,
        blockedSlotTimes,
        blockedSlotReasons,
        blockedSlots,
      },
      {
        headers: {
          "Cache-Control":
            "private, no-store, max-age=0, must-revalidate",
        },
      },
    );
  } catch (error) {
    console.error(
      "Get Unavailable Slots Error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch unavailable slots",
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
