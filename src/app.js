import express from "express";
import productRoutes from "./routes/products.routes.js";
const app = express();
const PORT = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/products", productRoutes);
app.listen(PORT, () => {
  console.log("listening on port ", PORT);
});
