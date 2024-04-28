import { Router } from "express";
import CartManager from "../services/db/carts.db.service.js";
import CustomRouter from "./custom/custom.router.js";
const router = Router();
export default class CartsRouter extends CustomRouter {
  init() {
    console.log("en clase cart routes");
    const cartManager = new CartManager();
    this.get("/:cid", ["USER", "ADMIN"], async (req, res) => {
      try {
        res.send(await cartManager.getCartByID(req.params.cid));
      } catch (e) {
        res.status(404).send(e.message);
      }
    });
    this.get("/", ["ADMIN"], async (req, res) => {
      res.send(await cartManager.getCarts());
    });

    this.post("/", ["USER", "ADMIN"], async (req, res) => {
      const carritoCreado = await cartManager.addCart();
      res.send(carritoCreado);
    });

    this.post("/:cid/product/:pid", ["USER", "ADMIN"], async (req, res) => {
      const cartID = req.params.cid;
      const prodID = req.params.pid;

      try {
        res.send(await cartManager.addProductToCartID(cartID, prodID));
      } catch (e) {
        throw e;
      }
    });

    this.delete("/:id", ["USER", "ADMIN"], async (req, res) => {
      res.send(await cartManager.deleteFullCartByID(req.params.id));
    });

    //borrar producto de carrito
    this.delete("/:cid/product/:pid", ["USER", "ADMIN"], async (req, res) => {
      const cartID = req.params.cid;
      const prodID = req.params.pid;

      try {
        res.send(await cartManager.deleteProductFromCart(cartID, prodID));
      } catch (e) {
        throw e;
      }
    });
  }
}
