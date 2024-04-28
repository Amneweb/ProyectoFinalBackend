import dotenv from "dotenv";
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
} = process.env;

const environmentConfig = {
  SERVER: {
    PORT: PORT ?? 8080,
    JWT: {
      SECRET: JWT_SECRET_KEY ?? "SECRET_KEEEY_!",
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
