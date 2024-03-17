import { Router } from "express";
import CartManager from "../services/db/carts.db.service.js";
const router = Router();

let cartManager = new CartManager();
router.get("/:cid", async (req, res) => {
  try {
    res.send(await cartManager.getCartByID(req.params.cid));
  } catch (e) {
    res.status(404).send(e.message);
  }
});
router.get("/", async (req, res) => {
  res.send(await cartManager.getCarts());
});

router.post("/", async (req, res) => {
  const carritoCreado = await cartManager.addCart();
  console.log("carrito Creado ", carritoCreado);
  res.send(carritoCreado);
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cartID = req.params.cid;
  const prodID = req.params.pid;

  try {
    res.send(await cartManager.addProductToCartID(cartID, prodID));
  } catch (e) {
    throw e;
  }
});

router.delete("/:id", async (req, res) => {
  res.send(await cartManager.deleteFullCartByID(req.params.id));
});

//borrar producto de carrito
router.delete("/:cid/product/:pid", async (req, res) => {
  const cartID = req.params.cid;
  const prodID = req.params.pid;
  console.log(cartID, prodID);
  try {
    res.send(await cartManager.deleteProductFromCart(cartID, prodID));
  } catch (e) {
    throw e;
  }
});

export default router;
