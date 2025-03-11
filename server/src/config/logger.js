const winston = require("winston");
const fs = require("fs");
const path = require("path");

const logDir = "logs";

// Only create logs directory in development
if (process.env.NODE_ENV === "development") {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
}

// create the logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    // winston.format.colorize(),
    winston.format.timestamp({
      format: 'MM-DD-YYYY HH:mm:ss [[' + global.process.pid + ']]'
    }),
    winston.format.printf(info => {
      if (info.stack) {
        return `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message} - ${info.stack}`
      }

      return `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`
    }
  )),
  transports: [
    new winston.transports.Console(),
  ],
});

// Add file transport only in development
if (process.env.NODE_ENV === "development") {
  logger.add(new winston.transports.File({ filename: path.join(logDir, "app.log") }));
}

module.exports = logger;
