import { createLogger, format, transports } from "winston";
import __dirname from "../../utils.js";
const filename = `${__dirname}/public/logs/global.log`;
const loggerParticular = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: "usuarios" },
  transports: [
    //
    // - Write to all logs with level `info` and below to `quick-start-combined.log`.
    // - Write all logs error (and below) to `quick-start-error.log`.
    //
    new transports.Console({
      level: "info",
      format: format.combine(format.colorize(), format.simple()),
    }),
    new transports.File({
      filename: filename,
      format: format.simple(),
    }),
  ],
});

//
// If we're not in production then **ALSO** log to the `console`
// with the colorized simple format.
//
/*if (process.env.NODE_ENV !== "production") {
  loggerParticular.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    })
  );
}*/

// ***************
// Allows for JSON logging
// ***************

loggerParticular.log({
  level: "info",
  message: "Probando logger escribiendo log",
});

loggerParticular.info({
  message: "Probando logger con el nivel como propiedad",
});

// ***************
// Allows for parameter-based logging
// ***************

loggerParticular.log("info", "Pass a message and this works", {
  additional: "properties",
  are: "passed along",
});

loggerParticular.warn("Use a helper method if you want", {
  additional: "properties",
  are: "passed along",
});

// ***************
// Allows for string interpolation
// ***************
/*
// info: test message my string {}
loggerParticular.log("info", "test message %s", "my string");

// info: test message 123 {}
loggerParticular.log("info", "test message %d", 123);

// info: test message first second {number: 123}
loggerParticular.log("info", "test message %s, %s", "first", "second", {
  number: 123,
});

// prints "Found error at %s"*/
loggerParticular.info("Found %s at %s", "error", new Date());
/*loggerParticular.info("Found %s at %s", "error", new Error("chill winston"));
loggerParticular.info("Found %s at %s", "error", /WUT/);
loggerParticular.info("Found %s at %s", "error", true);
loggerParticular.info("Found %s at %s", "error", 100.0);
loggerParticular.info("Found %s at %s", "error", ["1, 2, 3"]);

// ***************
// Allows for logging Error instances
// ***************

loggerParticular.warn(new Error("Error passed as info"));
loggerParticular.log("error", new Error("Error passed as message"));

loggerParticular.warn(
  "Maybe important error: ",
  new Error("Error passed as meta")
);
loggerParticular.log(
  "error",
  "Important error: ",
  new Error("Error passed as meta")
);

loggerParticular.error(new Error("Error as info"));*/
export default loggerParticular;
