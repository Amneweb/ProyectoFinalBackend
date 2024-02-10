import { Router } from "express";
import CartManager from "../scripts/CartManager.js";
const router = Router();

let cartManager = new CartManager();
router.get("/:cid", async (req, res) => {
  const cid = parseInt(req.params.cid);
  const productosEnCarrito = await cartManager.getProductsByCartID(cid);
  res.send(productosEnCarrito);
});

router.post("/", async (req, res) => {
  const products = req.body;
  res.send(cartManager.addCart(products));
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cartID = parseInt(req.params.cid);
  const prodID = parseInt(req.params.pid);
  res.send(await cartManager.addProductToCartID(cartID, prodID));
});

router.delete("/:id", async (req, res) => {
  res.send(await cartManager.deleteProductByID(parseInt(req.params.id)));
});

export default router;
