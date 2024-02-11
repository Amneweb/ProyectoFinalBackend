import express from "express";
import __dirname from "../utils.js";
import productRoutes from "./routes/products.routes.js";
import cartRoutes from "./routes/cart.routes.js";
const app = express();
app.use(express.static(__dirname + "/public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = 8080;
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.listen(PORT, () => {
  console.log("listening on port ", PORT);
});
