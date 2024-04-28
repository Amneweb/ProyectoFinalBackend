import express from "express";
import __dirname from "../utils.js";
import mongoose from "mongoose";
import { environmentConfig } from "./config/environment.config.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";

import passport from "passport";
import initializePassport from "./config/passport.config.js";

//import productRoutes from "./routes/products.routes.js";
import ProductsRouter from "./routes/products.routes.js";
import CategoriesRouter from "./routes/category.routes.js";
import CartsRouter from "./routes/cart.routes.js";
import viewsRouter from "./routes/views.routes.js";
import UsersRouter from "./routes/user.routes.js";
//import sessionRoutes from "./routes/sessions.routes.js";
//import sessionViewsRoutes from "./routes/session.views.routes.js";
import usersViewsRouter from "./routes/user.views.routes.js";
//import usersRouter from "./routes/users.router.js";
//import jwtRouter from "./routes/jwt.router.js";
import messageModel from "./services/db/models/messages.model.js";
const app = express();

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/src/views");

app.set("view engine", "handlebars");

const handlebarsCreate = handlebars.create({});

handlebarsCreate.handlebars.registerHelper("formatear", function (amount) {
  const formateado = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(amount);
  return formateado;
});

app.use(express.static(__dirname + "/public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = environmentConfig.PORT;

const httpServer = app.listen(PORT, () => {
  console.log("listening on port ", PORT);
});

/*app.use(
  session({
    store: MongoStore.create({
      mongoUrl: uri,
      ttl: 10 * 60,
    }),
    secret: claves.secret,
    resave: false,
    saveUninitialized: true,
  })
);*/

//Middlewares Passport
initializePassport();
app.use(passport.initialize());

app.use("/", viewsRouter);
app.use("/users", usersViewsRouter);
const productRouter = new ProductsRouter();
app.use("/api/products", productRouter.getRouter());
const cartsRouter = new CartsRouter();
app.use("/api/carts", cartsRouter.getRouter());
const categoriesRouter = new CategoriesRouter();
app.use("/api/categories", categoriesRouter.getRouter());
const usersRouter = new UsersRouter();
app.use("/api/users", usersRouter.getRouter());

//FIXME:
app.get("*", (req, res) => {
  res.status(400).send("Connot get that URL!!");
});
url = environmentConfig.DATABASE.MONGO.URL;
db = environmentConfig.DATABASE.MONGO.DB_NAME;

const connectMongoDB = async () => {
  try {
    await mongoose.connect(url, { dbName: db });
    //probando la conexión
    console.log("Conectado con éxito a la base de datos");
  } catch (error) {
    console.error("No se pudo conectar a la BD usando Moongose: " + error);
    process.exit();
  }
};
connectMongoDB();

const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {
  let messages = await messageModel.find();

  socketServer.emit("messageLogs", messages);

  socket.on("message", async (data) => {
    try {
      const newMessage = await messageModel.create(data);
      messages = await messageModel.find();

      socketServer.emit("messageLogs", messages);
    } catch (error) {
      console.error("Error guardando en la base de datos:", error);
    }
  });

  socket.on("userConnected", (data) => {
    socket.broadcast.emit("userConnected", data.user);
  });

  socket.on("closeChat", (data) => {
    if (data.close === "close") socket.disconnect();
  });
});
