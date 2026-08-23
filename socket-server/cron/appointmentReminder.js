const cron = require("node-cron");

const Appointment = require("../models/Appointment");
const ActivityLog = require("../models/ActivityLog");
const { sendEmail } = require("../services/emailService");
const { sendAppointmentReminderWhatsApp } = require("../services/whatsappService");
const { emitToAdmins } = require("../socket/socket");
const {
  appointmentReminderEmail,
} = require("../templates/appointmentReminderTemplate");
const { logInfo, logError } = require("../utils/logger");

const INDIA_TIME_ZONE = "Asia/Kolkata";
const INDIA_OFFSET = "+05:30";

const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;

const REMINDER_24H_TARGET_MS = 24 * HOUR_MS;
const REMINDER_1H_TARGET_MS = HOUR_MS;

/**
 * The cron runs every minute. A two-minute window prevents missed reminders
 * when a run starts a few seconds late while still keeping delivery very close
 * to the intended 24-hour and 1-hour marks.
 */
const REMINDER_WINDOW_MS = 2 * MINUTE_MS;

let reminderJobRunning = false;

function normalizeTimeSlot(value = "") {
  return String(value)
    .trim()
    .replace(/\s+/g, " ")
    .toUpperCase();
}

function parseAppointmentDateTime(date, timeSlot) {
  const normalizedDate = String(date || "").trim();
  const normalizedSlot = normalizeTimeSlot(timeSlot);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(normalizedDate)) {
    return null;
  }

  const slotMatch = normalizedSlot.match(
    /^(0?[1-9]|1[0-2]):([0-5]\d)\s(AM|PM)$/,
  );

  if (!slotMatch) {
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

  const isoDateTime = `${normalizedDate}T${String(hours).padStart(
    2,
    "0",
  )}:${String(minutes).padStart(2, "0")}:00${INDIA_OFFSET}`;

  const parsedDate = new Date(isoDateTime);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
}

function isReminderDue(diffMs, targetMs) {
  return (
    diffMs <= targetMs &&
    diffMs > targetMs - REMINDER_WINDOW_MS
  );
}

async function recordReminderActivity(
  appointment,
  reminderType,
) {
  const action =
    reminderType === "24h"
      ? "24 Hour Reminder Sent"
      : "1 Hour Reminder Sent";

  try {
    const activity = await ActivityLog.create({
      action,
      details: `${appointment.name} - ${appointment.date} ${appointment.timeSlot}`,
      type: "appointment",
    });

    emitToAdmins("activityLogUpdated", {
      action,
      activity,
      appointment,
    });
  } catch (error) {
    logError(
      "Reminder activity log failed:",
      error instanceof Error ? error.message : error,
    );
  }

  emitToAdmins("reminderSent", {
    reminderType,
    appointment,
  });
}

async function sendReminder(
  appointment,
  reminderType,
) {
  if (!appointment.email) {
    logError(
      `Reminder skipped: appointment ${appointment._id} has no email`,
    );
    return false;
  }

  const is24h = reminderType === "24h";

  const [emailResult, whatsappResult] = await Promise.allSettled([
    sendEmail({
      to: appointment.email,
      subject: is24h
        ? "Appointment Reminder - Tomorrow - Teeth & Gums Care"
        : "Appointment Reminder - 1 Hour Left - Teeth & Gums Care",
      html: appointmentReminderEmail(appointment, reminderType),
    }),
    sendAppointmentReminderWhatsApp(appointment, reminderType),
  ]);

  const emailSent = emailResult.status === "fulfilled" && emailResult.value;
  const whatsappSent = whatsappResult.status === "fulfilled" && whatsappResult.value;

  if (!emailSent && !whatsappSent) {
    logError(`Both email and WhatsApp ${reminderType} reminders failed for ${appointment._id}`);
    return false;
  }

  const flagName = is24h
    ? "reminder24hSent"
    : "reminder1hSent";

  /**
   * Update only when the reminder is still unsent. This protects against
   * duplicate flag updates if the same appointment is processed again.
   */
  const updatedAppointment =
    await Appointment.findOneAndUpdate(
      {
        _id: appointment._id,
        [flagName]: false,
      },
      {
        $set: {
          [flagName]: true,
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );

  if (!updatedAppointment) {
    logInfo(
      `${reminderType} reminder flag was already updated for ${appointment._id}`,
    );
    return true;
  }

  await recordReminderActivity(
    updatedAppointment,
    reminderType,
  );

  logInfo(
    `${reminderType} reminder sent to ${updatedAppointment.email}`,
  );

  return true;
}

async function processAppointmentReminders() {
  if (reminderJobRunning) {
    logInfo(
      "Reminder cron skipped because the previous run is still active",
    );
    return;
  }

  reminderJobRunning = true;

  try {
    const now = new Date();

    const appointments = await Appointment.find({
      status: {
        $in: ["confirmed", "rescheduled"],
      },
      email: {
        $exists: true,
        $ne: "",
      },
      $or: [
        { reminder24hSent: false },
        { reminder1hSent: false },
      ],
    })
      .sort({ date: 1, timeSlot: 1 })
      .exec();

    for (const appointment of appointments) {
      const appointmentDateTime =
        parseAppointmentDateTime(
          appointment.date,
          appointment.timeSlot,
        );

      if (!appointmentDateTime) {
        logError(
          `Invalid appointment date/time for ${appointment._id}: ${appointment.date} ${appointment.timeSlot}`,
        );
        continue;
      }

      const diffMs =
        appointmentDateTime.getTime() - now.getTime();

      if (diffMs <= 0) {
        continue;
      }

      if (
        !appointment.reminder24hSent &&
        isReminderDue(
          diffMs,
          REMINDER_24H_TARGET_MS,
        )
      ) {
        await sendReminder(appointment, "24h");
      }

      if (
        !appointment.reminder1hSent &&
        isReminderDue(
          diffMs,
          REMINDER_1H_TARGET_MS,
        )
      ) {
        await sendReminder(appointment, "1h");
      }
    }
  } catch (error) {
    logError(
      "Appointment reminder cron error:",
      error instanceof Error ? error.message : error,
    );
  } finally {
    reminderJobRunning = false;
  }
}

function startAppointmentReminderCron() {
  /**
   * Run once every minute, explicitly using India time.
   * Appointment timestamps are also parsed with +05:30, so the VPS/server
   * timezone cannot shift reminder delivery.
   */
  const task = cron.schedule(
    "* * * * *",
    processAppointmentReminders,
    {
      timezone: INDIA_TIME_ZONE,
      noOverlap: true,
      name: "appointment-reminders",
    },
  );

  /**
   * Check immediately on server startup. This does not send random reminders;
   * it only sends when an appointment falls inside an exact due window.
   */
  void processAppointmentReminders();

  logInfo(
    "Appointment reminder cron started: every minute in Asia/Kolkata",
  );

  return task;
}

module.exports = {
  startAppointmentReminderCron,
  processAppointmentReminders,
  parseAppointmentDateTime,
};
