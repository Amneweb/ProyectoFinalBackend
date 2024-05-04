import CartController from "../controllers/carts.controller.js";
import CustomRouter from "./custom/custom.router.js";
import pc from "picocolors";
export default class CartsRouter extends CustomRouter {
  init() {
    console.log(pc.bgRed("CARTS"));
    const cartController = new CartController();
    this.get("/:cid", ["USER", "ADMIN"], cartController.getOne);
    this.get("/", ["ADMIN"], async (req, res) => {
      res.send(await cartManager.getCarts());
    });
    this.post("/", ["PUBLIC"], cartController.postOne);
    this.post("/:cid/product/:pid", ["PUBLIC"], cartController.addToCart);
    this.delete("/:id", ["USER", "ADMIN"], cartController.deleteCart);
    //borrar producto de carrito
    this.delete(
      "/:cid/product/:pid",
      ["USER", "ADMIN"],
      cartController.deleteProduct
    );
  }
}
