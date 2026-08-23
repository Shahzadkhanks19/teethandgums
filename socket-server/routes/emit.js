const express = require("express");
const { emitToAdmins } = require("../socket/socket");
const { logInfo } = require("../utils/logger");

const router = express.Router();

function verifyEmitSecret(req, res, next) {
  const secret = req.headers["x-socket-secret"];

  if (!secret || secret !== process.env.SOCKET_SECRET) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized socket emit request",
    });
  }

  next();
}

router.post("/", verifyEmitSecret, (req, res) => {
  const { eventName, payload } = req.body;

  if (!eventName) {
    return res.status(400).json({
      success: false,
      message: "eventName is required",
    });
  }

  const emitted = emitToAdmins(eventName, payload || {});

  logInfo("Emit request received", {
    eventName,
  });

  return res.json({
    success: emitted,
    message: emitted
      ? "Event emitted successfully"
      : "Socket server not initialized",
  });
});

module.exports = router;