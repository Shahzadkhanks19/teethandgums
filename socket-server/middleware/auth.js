const jwt = require("jsonwebtoken");

function authenticateSocket(socket, next) {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication token missing"));
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    socket.admin = decoded;

    next();
  } catch (error) {
    next(new Error("Authentication failed"));
  }
}

module.exports = authenticateSocket;