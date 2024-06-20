import dotenv from "dotenv";
import { Command } from "commander";
dotenv.config();

const {
  PORT,
  JWT_SECRET_KEY,
  COOKIE_AUTH_TOKEN_KEY,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_CALLBACK_URL,
  MONGO_URL,
  MONGO_DB_NAME,
  MAILER_AUTH_PASS,
  MAILER_EMAIL,
} = process.env;

const program = new Command(); //Crea la instancia de comandos de commander.

//TODO: FACTORY ES SOLO PARA CAMBIAR LA PERSISTENCIA. EL MODO DE TRABAJO LO USO PARA WINSTON.

program
  .option("-d", "Variable para debug", false)
  .option("--persist <mode>", "Modo de persistencia", "mongodb")
  .option("--mode <mode>", "Modo de trabajo", "dev")
  .option("--test <test>", "Modo test");
program.parse();

//console.log("Options: ", program.opts());
console.log("Environment Mode Option: ", program.opts().mode);
console.log("Persistence Mode Option: ", program.opts().persist);

const environmentConfig = {
  PERSISTENCE: program.opts().persist,
  ENVIRONMENT: program.opts().mode,
  TESTING: program.opts().test,
  MAILER: {
    AUTH_PASS: MAILER_AUTH_PASS,
    EMAIL: MAILER_EMAIL,
  },
  SERVER: {
    PORT: PORT ?? 8080,
    JWT: {
      SECRET: JWT_SECRET_KEY,
    },
    COOKIES: {
      AUTH: COOKIE_AUTH_TOKEN_KEY ?? "token_login",
    },
    GITHUB: {
      CLIENT_ID: GITHUB_CLIENT_ID,
      CLIENT_SECRET: GITHUB_CLIENT_SECRET,
      CALLBACK_URL: GITHUB_CALLBACK_URL,
    },
  },
  DATABASE: {
    MONGO: {
      URL:
        MONGO_URL ??
        "mongodb+srv://Amneweb:87a5e76@clustercursocoder.2encwlm.mongodb.net/?retryWrites=true&w=majority&appName=ClusterCursoCoder",
      DB_NAME: MONGO_DB_NAME ?? "ecommerce",
    },
  },
};
export { environmentConfig };
