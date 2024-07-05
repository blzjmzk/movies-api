const { createLogger, format, transports } = require("winston");

const logger = createLogger({
  level: "error",
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console(),
    // Optional: Add a File transport to log errors to a file
    new transports.File({ filename: "error.log" }),
  ],
});

module.exports = logger;
