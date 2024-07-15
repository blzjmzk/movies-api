const { createLogger, format, transports } = require("winston");
const winston = require("winston");
const { MongoDB } = require("winston-mongodb");
require("express-async-errors");

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }), // Log the stack trace
    format.json()
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple() // Simple format for console
      ),
    }),
    new transports.File({ filename: "combined.log" }),
    new transports.File({ filename: "error.log", level: "error" }),
    new MongoDB({
      db: "mongodb://localhost/movies-api",
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      collection: "log",
      tryReconnect: true,
    }),
  ],
  exceptionHandlers: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple() // Simple format for console
      ),
    }),
    new transports.File({ filename: "uncaughtExceptions.log" }),
  ],
  rejectionHandlers: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple() // Simple format for console
      ),
    }),
    new transports.File({ filename: "unhandledRejections.log" }),
  ],
});

process.on("unhandledRejection", (ex) => {
  throw ex; // This will be caught by the uncaughtException handler
});

module.exports = logger;
