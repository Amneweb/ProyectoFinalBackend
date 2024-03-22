import { Router } from "express";
import ProductManager from "../services/db/products.db.service.js";
import CartManager from "../services/db/carts.db.service.js";

const router = Router();

let productManager = new ProductManager();
let cartManager = new CartManager();

router.get("/catalogo", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 300;
  const criterio = req.query.criterio || "title";
  const sentido = parseInt(req.query.sentido) || 1;
  let sort = {};
  sort[criterio] = sentido;
  console.log("objeto sort", sort);
  try {
    const productosObtenidos = await productManager.getPagination(
      page,
      limit,
      sort
    );
    productosObtenidos.paginacion =
      limit >= productosObtenidos.totalDocs ? false : true;

    productosObtenidos.prevLink = productosObtenidos.hasPrevPage
      ? `/catalogo/?page=${productosObtenidos.prevPage}&limit=${limit}&sentido=${sentido}&criterio=${criterio}`
      : "";
    productosObtenidos.nextLink = productosObtenidos.hasNextPage
      ? `/catalogo/?page=${productosObtenidos.nextPage}&limit=${limit}&sentido=${sentido}&criterio=${criterio}`
      : "";

    productosObtenidos.isValid = !(
      page < 1 || page > productosObtenidos.totalPages
    );

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

router.get("/home", async (req, res) => {
  try {
    const productosObtenidos = await productManager.getProducts();

    res.render("adminProducts", { productosObtenidos, style: "general.css" });
  } catch (e) {
    res.status(500).send(e.message);
  }
});

//para ver el carrito del usuario
router.get("/carrito/:cid", async (req, res) => {
  try {
    const carrito = await cartManager.getCartByID(req.params.cid);
    res.render("usercart", {
      carrito,
      style: "general.css",
    });
  } catch (e) {
    res.status(404).send(e.message);
  }
});

export default router;
