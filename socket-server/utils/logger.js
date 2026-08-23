function logInfo(message, data = "") {
  console.log(`[SOCKET INFO] ${message}`, data);
}

function logError(message, error = "") {
  console.error(`[SOCKET ERROR] ${message}`, error);
}

module.exports = {
  logInfo,
  logError,
};