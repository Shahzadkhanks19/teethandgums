const authenticateSocket = require("../middleware/auth");
const { logInfo, logError } = require("../utils/logger");

let ioInstance = null;

function initSocket(io) {
  ioInstance = io;

  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    logInfo("Admin socket connected:", socket.id);

    socket.join("admins");

    socket.emit("connected", {
      success: true,
      message: "Connected to realtime admin notifications",
      socketId: socket.id,
    });

    socket.on("pingServer", (callback) => {
      if (typeof callback === "function") {
        callback({
          success: true,
          message: "pong",
          timestamp: new Date().toISOString(),
        });
      }
    });

    socket.on("disconnect", (reason) => {
      logInfo("Admin socket disconnected:", {
        socketId: socket.id,
        reason,
      });
    });

    socket.on("error", (error) => {
      logError("Socket error:", error);
    });
  });
}

function emitToAdmins(eventName, payload = {}) {
  if (!ioInstance) {
    logError("Socket server not initialized");
    return false;
  }

  ioInstance.to("admins").emit(eventName, {
    ...payload,
    emittedAt: new Date().toISOString(),
  });

  logInfo(`Event emitted: ${eventName}`);

  return true;
}

module.exports = {
  initSocket,
  emitToAdmins,
};