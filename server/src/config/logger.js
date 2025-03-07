const winston = require("winston");
const fs = require("fs");
const path = require("path");

const logDir = "logs";

// Only create logs directory in development
if (process.env.NODE_ENV !== "production") {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
}

const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message}`;
      })
    ),
  }),
];

// Add file transport only in development
if (process.env.NODE_ENV !== "production") {
  transports.push(new winston.transports.File({ filename: path.join(logDir, "app.log") }));
}

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports,
});

module.exports = logger;
