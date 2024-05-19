import { format, transports } from "winston";
import __dirname from "../../utils.js";
const filename = `${__dirname}/public/logs/global.log`;
export const settings = {
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
};
