import { Router } from "express";
import CartManager from "../scripts/CartManager.js";
const router = Router();

let cartManager = new CartManager();
router.get("/:cid", async (req, res) => {
  const cid = parseInt(req.params.cid);
  try {
    const carritoBuscado = await cartManager.getCartByID(cid);
    res.send(carritoBuscado.products);
  } catch (e) {
    res.send(e.message);
  }
});
router.get("/", async (req, res) => {
  res.send(await cartManager.getCarts());
});

router.post("/", async (req, res) => {
  res.send(cartManager.addCart());
});

router.post("/:cid/product/:pid", async (req, res) => {
  const cartID = parseInt(req.params.cid);
  const prodID = parseInt(req.params.pid);
  try {
    res.send(await cartManager.addProductToCartID(cartID, prodID));
  } catch (e) {
    throw e;
  }
});

router.delete("/:id", async (req, res) => {
  res.send(await cartManager.deleteProductByID(parseInt(req.params.id)));
});

export default router;
