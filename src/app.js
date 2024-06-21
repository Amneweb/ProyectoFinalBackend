import express from "express";
import __dirname from "../dirname.js";
import { passportJWTCall } from "./utils/utils.js";
import cookieParser from "cookie-parser";
import { environmentConfig } from "./config/environment.config.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import swaggerUi from "swagger-ui-express";
import swaggerSpecs from "../src/config/swagger.config.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";

import ProductsRouter from "./routes/products.routes.js";
import CategoriesRouter from "./routes/category.routes.js";
import DocumentationRouter from "./routes/documentation.routes.js";
import CartsRouter from "./routes/cart.routes.js";
import ViewsRouter from "./routes/views.routes.js";
import UsersRouter from "./routes/user.routes.js";
import EmailRouter from "./routes/email.routes.js";
import usersViewsRouter from "./routes/user.views.routes.js";
import mockRouter from "./routes/mock.routes.js";

import messageModel from "./services/daos/mongo/mensajes/messages.model.js";
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
app.use(cookieParser());
const PORT = environmentConfig.SERVER.PORT;

const httpServer = app.listen(PORT, () => {
  console.log("listening on port ", PORT);
});
import { addLogger } from "./config/logger.config.js";

app.use(addLogger);
//Middlewares Passport
initializePassport();
app.use(passport.initialize());
app.use(passportJWTCall);
const emailRouter = new EmailRouter();
app.use("/api/email", emailRouter.getRouter());
const viewsRouter = new ViewsRouter();
app.use("/", viewsRouter.getRouter());
app.use("/users", usersViewsRouter);
const productRouter = new ProductsRouter();
app.use("/api/products", productRouter.getRouter());
const cartsRouter = new CartsRouter();
app.use("/api/carts", cartsRouter.getRouter());
const categoriesRouter = new CategoriesRouter();
app.use("/api/categories", categoriesRouter.getRouter());
const usersRouter = new UsersRouter();
app.use("/api/users", usersRouter.getRouter());
app.use("/api/mockproducts/", mockRouter);
const documentationRouter = new DocumentationRouter();
app.use("/api/documentation", documentationRouter.getRouter());

app.get("/loggertest", (req, res) => {
  // Logica
  req.logger.warning("Prueba de log level warning --> en Endpoint");

  res.send("Prueba de logger!");
});

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
//FIXME:
app.get("*", (req, res) => {
  res.status(400).send("Cannot get that URL!!");
});
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
