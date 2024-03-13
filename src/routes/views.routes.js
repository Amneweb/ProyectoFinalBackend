import { Router } from "express";
import ProductManager from "../services/db/products.db.service.js";
import CartManager from "../services/db/carts.db.service.js";

const router = Router();

let productManager = new ProductManager();
router.get("/home", async (req, res) => {
  try {
    const productosObtenidos = await productManager.getProducts();

    res.render("home", { productosObtenidos, style: "general.css" });
  } catch (e) {
    res.status(500).send(e.message);
  }
});

let cartManager = new CartManager();
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

router.get("/home/:id", async (req, res) => {
  try {
    id = req.params.id;
    const producto = await productManager.getProductByID(id);
    res.render("product", {
      producto,
      style: "general.css",
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default router;
