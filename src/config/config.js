import dotenv from "dotenv";
dotenv.config();

const claves = {
  username: process.env.DB_USER_NAME,
  password: process.env.DB_PASS,
  cluster: process.env.DB_CLUSTER_NAME,
  secret: process.env.SESSION_SECRET,
  dbname: process.env.DB_NAME,
};

export default claves;
