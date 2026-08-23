import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { verifyAdminRequest } from "@/lib/auth";
import { verifyCsrfToken } from "@/lib/csrf";
import connectDB from "@/lib/db";
import logActivity from "@/lib/logActivity";
import BlockedSlot, {
  type BlockedSlotType,
} from "@/lib/models/BlockedSlot";
import { sanitizeInput } from "@/lib/sanitize";
import emitSocketEvent from "@/lib/socketEmitter";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_SIZE = 10_000;
const INDIA_TIME_ZONE_OFFSET = "+05:30";

type BlockAvailabilityBody = {
  date?: string;
  timeSlot?: string;
  type?: string;
  reason?: string;
};

type NormalizedBlockAvailabilityBody = {
  date: string;
  timeSlot: string;
  type: string;
  reason: string;
};

function noStoreHeaders() {
  return {
    "Cache-Control": "no-store",
  };
}

function normalizeBlockBody(
  body: BlockAvailabilityBody,
): NormalizedBlockAvailabilityBody {
  return {
    date: body.date?.trim() || "",
    timeSlot:
      body.timeSlot?.trim().replace(/\s+/g, " ") || "",
    type: body.type?.trim().toLowerCase() || "",
    reason: body.reason?.trim() || "",
  };
}

function validateBlockBody(
  body: NormalizedBlockAvailabilityBody,
): string | null {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const timeSlotRegex =
    /^(0?[1-9]|1[0-2]):[0-5]\d\s(AM|PM)$/;

  if (!body.date) {
    return "Date is required";
  }

  if (!dateRegex.test(body.date)) {
    return "Please select a valid date";
  }

  if (!["day", "slot"].includes(body.type)) {
    return "Invalid block type";
  }

  if (body.type === "slot" && !body.timeSlot) {
    return "Time slot is required";
  }

  if (
    body.type === "slot" &&
    !timeSlotRegex.test(body.timeSlot)
  ) {
    return "Please select a valid time slot";
  }

  if (body.reason.length > 500) {
    return "Reason should not be more than 500 characters";
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

function getTodayInIndia(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export async function GET(req: NextRequest) {
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
          headers: noStoreHeaders(),
        },
      );
    }

    await connectDB();

    const blockedSlots = await BlockedSlot.find()
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return NextResponse.json(
      {
        success: true,
        blockedSlots,
      },
      {
        headers: noStoreHeaders(),
      },
    );
  } catch (error) {
    console.error("Get Blocked Slots Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch blocked slots",
      },
      {
        status: 500,
        headers: noStoreHeaders(),
      },
    );
  }
}

export async function POST(req: NextRequest) {
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
          headers: noStoreHeaders(),
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
          headers: noStoreHeaders(),
        },
      );
    }

    let rawBody: BlockAvailabilityBody;

    try {
      rawBody = sanitizeInput(
        await req.json(),
      ) as BlockAvailabilityBody;

      if (JSON.stringify(rawBody).length > MAX_BODY_SIZE) {
        return NextResponse.json(
          {
            success: false,
            message: "Request body is too large",
          },
          {
            status: 413,
            headers: noStoreHeaders(),
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
          headers: noStoreHeaders(),
        },
      );
    }

    const body = normalizeBlockBody(rawBody);
    const validationError = validateBlockBody(body);

    if (validationError) {
      return NextResponse.json(
        {
          success: false,
          message: validationError,
        },
        {
          status: 400,
          headers: noStoreHeaders(),
        },
      );
    }

    const today = getTodayInIndia();

    if (body.date < today) {
      return NextResponse.json(
        {
          success: false,
          message: "You cannot block a past date",
        },
        {
          status: 400,
          headers: noStoreHeaders(),
        },
      );
    }

    if (body.type === "slot") {
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
              "You cannot block a past time slot",
          },
          {
            status: 400,
            headers: noStoreHeaders(),
          },
        );
      }
    }

    await connectDB();

    const type = body.type as BlockedSlotType;
    const timeSlot =
      type === "slot" ? body.timeSlot : "";

    const existingBlock = await BlockedSlot.exists({
      date: body.date,
      type,
      timeSlot,
    });

    if (existingBlock) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This availability is already blocked",
        },
        {
          status: 409,
          headers: noStoreHeaders(),
        },
      );
    }

    const blockedSlot = await BlockedSlot.create({
      date: body.date,
      timeSlot,
      type,
      reason: body.reason,
    });

    const blockedSlotObject = blockedSlot.toObject();

    const sideEffectResults = await Promise.allSettled([
      logActivity(
        "Availability Blocked",
        type === "day"
          ? `Entire day blocked: ${body.date}`
          : `Blocked slot ${timeSlot} on ${body.date}`,
        "availability",
      ),
      emitSocketEvent({
        eventName: "availabilityUpdated",
        payload: {
          blockedSlot: blockedSlotObject,
        },
      }),
    ]);

    sideEffectResults.forEach((result) => {
      if (result.status === "rejected") {
        console.error(
          "Block availability side effect failed:",
          result.reason,
        );
      }
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Availability blocked successfully",
        blockedSlot: blockedSlotObject,
      },
      {
        status: 201,
        headers: noStoreHeaders(),
      },
    );
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This availability is already blocked",
        },
        {
          status: 409,
          headers: noStoreHeaders(),
        },
      );
    }

    console.error("Block Availability Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to block availability",
      },
      {
        status: 500,
        headers: noStoreHeaders(),
      },
    );
  }
}
