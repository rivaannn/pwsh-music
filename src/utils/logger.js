function getTimestamp() {
  return new Date().toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    hour12: false,
  });
}

export const logger = {
  info: (msg) => console.log(`[${getTimestamp()}] [INFO] ${msg}`),
  warn: (msg) => console.log(`[${getTimestamp()}] [WARN] ${msg}`),
  error: (msg) => console.error(`[${getTimestamp()}] [ERROR] ${msg}`),
  success: (msg) => console.log(`[${getTimestamp()}] [SUCCESS] ${msg}`),
  cmd: (user, command) =>
    console.log(`[${getTimestamp()}] [CMD] ${user} executed /${command}`),
};
