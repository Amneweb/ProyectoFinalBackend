import { addColors, createLogger, format, transports } from "winston";
import { environmentConfig } from "./environment.config.js";
import __dirname from "../../dirname.js";
const filenameDEV = `${__dirname}/public/logs/globalDEV.log`;
const filename = `${__dirname}/public/logs/global.log`;
const customLevelOptions = {
  levels: {
    error: 0,
    warning: 1,
    http: 2,
    debug: 3,
    method: 4,
    path: 5,
    silly: 6,
  },
  colors: {
    error: "red",
    warning: "bold magenta",
    http: "yellow",
    debug: "green",
    method: "blue",
    path: "cyan",
    silly: "magenta",
  },
};
addColors(customLevelOptions);

let formatConsole = format.combine(
  format.colorize({
    all: true,
  }),

  format.timestamp({
    format: "YY-MM-DD HH:mm:ss",
  }),
  format.printf((info) => {
    const component = info.component.toUpperCase();
    return `${info.timestamp} ${component} [${info.level}] : ${info.message}`;
  })
);

let formatFile = format.combine(
  format.timestamp({
    format: "YY-MM-DD HH:mm:ss",
  }),
  format.printf((info) => {
    const component = info.component.toUpperCase();
    return `${info.timestamp} ${component} [${info.level}] : ${info.message}`;
  })
);

const settings = {
  levels: customLevelOptions.levels,
  level: environmentConfig.ENVIRONMENT === "dev" ? "silly" : "http",
  /*
===================
CONSOLA
===================
*/

  transportConsole: new transports.Console({
    format: format.combine(format.colorize(), format.splat(), formatConsole),
  }),
  /*
===================
FILE
===================
*/
  transportFile: new transports.File({
    filename: environmentConfig.ENVIRONMENT === "dev" ? filenameDEV : filename,

    format: format.combine(format.splat(), formatFile),
  }),
};

export const userLogger = createLogger({
  levels: settings.levels,
  level: settings.level,
  transports: [settings.transportConsole, settings.transportFile],
  defaultMeta: { component: "user-service" },
});
export const productsLogger = createLogger({
  levels: settings.levels,
  level: settings.level,
  transports: [settings.transportConsole, settings.transportFile],
  defaultMeta: { component: "product-service" },
});
export const cartsLogger = createLogger({
  levels: settings.levels,
  level: settings.level,
  transports: [settings.transportConsole, settings.transportFile],
  defaultMeta: { component: "carts-service" },
});
export const customLogger = createLogger({
  levels: settings.levels,
  level: settings.level,
  transports: [settings.transportConsole, settings.transportFile],
  defaultMeta: { component: "custom-router" },
});
export const logger = createLogger({
  levels: settings.levels,
  level: settings.level,
  transports: [settings.transportConsole, settings.transportFile],
  defaultMeta: { component: "global" },
});
// Declaramos un middleware
export const addLogger = (req, res, next) => {
  req.logger = logger;

  req.logger.path(`${req.method} en ${req.url}`);
  next();
};
