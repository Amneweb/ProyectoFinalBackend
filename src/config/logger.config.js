import { createLogger, format, transports, addColors } from "winston";
import __dirname from "../../utils.js";
const filename = `${__dirname}/public/logs/global.log`;
// definimos configuracion del logger

const customLevelsOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    http: 3,
    debug: 4,
    method: 5,
    path: 6,
  },
  colors: {
    fatal: "red",
    error: "purple",
    warning: "yellow",
    http: "green",
    debug: "blue",
    method: "magenta",
    path: "cyan",
  },
};
//addColors(customLevelsOptions.colors);

export const settings = {
  levels: customLevelsOptions.levels,
  level: "path",
  format: format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  defaultMeta: { service: "global" },
  transports: [
    /*
===================
CONSOLA
===================
*/
    new transports.Console({
      format: format.combine(
        format.colorize({ colors: customLevelsOptions.colors, message: true }),
        format.errors({ stack: true }),
        format.simple()
      ),
    }),
    /*
===================
FILE
===================
*/
    new transports.File({
      filename: filename,

      format: format.combine(format.colorize(), format.simple()),
    }),
  ],
};

// Declaramos un middleware
export const addLogger = (req, res, next) => {
  const logger = createLogger(settings);
  req.logger = logger;

  req.logger.path(`${req.method} en ${req.url} - `);
  next();
};
