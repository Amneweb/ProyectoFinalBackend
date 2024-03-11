import express from "express";
import __dirname from "../utils.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import handlebars from "express-handlebars";

dotenv.config();
import productRoutes from "./routes/products.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import viewsRouter from "./routes/views.routes.js";
const app = express();

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/src/views");

app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = 8080;

app.use("/", viewsRouter);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.listen(PORT, () => {
  console.log("listening on port ", PORT);
});

const username = process.env.DB_USER_NAME;
const password = process.env.DB_PASS;
const cluster = process.env.CLUSTER_NAME;
const dbname = process.env.DB_NAME;

let uri = `mongodb+srv://${username}:${password}@${cluster}.2encwlm.mongodb.net/${dbname}?retryWrites=true&w=majority&appName=ClusterCursoCoder`;

const connectMongoDB = async () => {
  try {
    await mongoose.connect(uri);
    //probando la conexión
    console.log("Conectado con éxito a la base de datos");
  } catch (error) {
    console.error("No se pudo conectar a la BD usando Moongose: " + error);
    process.exit();
  }
};
connectMongoDB();
