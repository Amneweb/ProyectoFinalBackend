import dotenv from "dotenv";
dotenv.config();

const claves = {
  username: process.env.DB_USER_NAME,
  password: process.env.DB_PASS,
  cluster: process.env.DB_CLUSTER_NAME,
  secret: process.env.SESSION_SECRET,
  dbname: process.env.DB_NAME,
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
};

export default claves;
