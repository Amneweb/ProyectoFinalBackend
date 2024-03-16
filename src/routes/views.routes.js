import { Router } from "express";
import ProductManager from "../services/db/products.db.service.js";
import CartManager from "../services/db/carts.db.service.js";

const router = Router();

let productManager = new ProductManager();
let cartManager = new CartManager();

router.get("/catalogo", async (req, res) => {
  try {
    const productosObtenidos = await productManager.getProducts();

    res.render("catalogo", { productosObtenidos, style: "catalogo.css" });
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.get("/catalogo/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const producto = await productManager.getProductByID(id);
    res.render("product", {
      producto,
      style: "catalogo.css",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/admin", async (req, res) => {
  try {
    const carritosObtenidos = await cartManager.getCarts();

    res.render("carts", { carritosObtenidos, style: "general.css" });
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.get("/chat", (req, res) => {
  res.render("messages", { style: "general.css" });
});

export default router;
