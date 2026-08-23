const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");

dotenv.config();

const connectDB = require("./config/db");
const emitRoutes = require("./routes/emit");
const { initSocket } = require("./socket/socket");
const {
  startAppointmentReminderCron,
} = require("./cron/appointmentReminder");
const { logInfo, logError } = require("./utils/logger");

const app = express();
const server = http.createServer(app);

const PORT = Number(process.env.PORT || 5001);

function normalizeOrigin(value = "") {
  return String(value).trim().replace(/\/+$/, "");
}

const publicClientUrl = normalizeOrigin(
  process.env.NEXT_PUBLIC_CLIENT_URL ||
    process.env.CLIENT_URL ||
    "",
);

/* ==========================================
   Allowed Origins
========================================== */

const allowedOrigins = [
  publicClientUrl,

  "https://shahzadtestsite.co.in",
  "https://www.shahzadtestsite.co.in",

  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://192.168.1.4:3000",
]
  .map(normalizeOrigin)
  .filter(Boolean);

function corsOrigin(origin, callback) {
  if (!origin) {
    return callback(null, true);
  }

  const normalizedOrigin = normalizeOrigin(origin);

  if (allowedOrigins.includes(normalizedOrigin)) {
    return callback(null, true);
  }

  logError(`CORS blocked origin: ${normalizedOrigin}`);

  return callback(new Error("Origin not allowed by CORS"));
}

/* ==========================================
   Express Middleware
========================================== */

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" }));

/* ==========================================
   Health Check
========================================== */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Teeth & Gums Care Socket Server is running",
    environment: process.env.NODE_ENV || "development",
    reminderTimeZone: "Asia/Kolkata",
  });
});

/* ==========================================
   Emit Routes
========================================== */

app.use("/emit", emitRoutes);

/* ==========================================
   Socket.IO
========================================== */

const io = new Server(server, {
  cors: {
    origin: corsOrigin,
    methods: ["GET", "POST"],
    credentials: true,
  },

  transports: ["polling", "websocket"],
  pingTimeout: 30000,
  pingInterval: 10000,
});

initSocket(io);

/* ==========================================
   Start Server
========================================== */

const startServer = async () => {
  try {
    await connectDB();

    startAppointmentReminderCron();

    server.listen(PORT, "0.0.0.0", () => {
      logInfo(`Socket server running on port ${PORT}`);
      logInfo(
        `Environment: ${process.env.NODE_ENV || "development"}`,
      );
      logInfo(`Reminder timezone: Asia/Kolkata`);
      logInfo("Allowed Origins:");
      allowedOrigins.forEach((origin) =>
        logInfo(`- ${origin}`),
      );
    });
  } catch (error) {
    logError(
      "Socket server startup failed:",
      error instanceof Error ? error.message : error,
    );
    process.exit(1);
  }
};

startServer();

/* ==========================================
   Graceful Shutdown
========================================== */

function shutdown(signal) {
  logInfo(`Socket server received ${signal}; shutting down...`);

  server.close(() => {
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("unhandledRejection", (error) => {
  logError("Unhandled Rejection:", error);
});

process.on("uncaughtException", (error) => {
  logError("Uncaught Exception:", error);
});
