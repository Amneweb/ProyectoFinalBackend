import CartController from "../controllers/carts.controller.js";
import CustomRouter from "./custom/custom.router.js";
import pc from "picocolors";
export default class CartsRouter extends CustomRouter {
  init() {
    console.log(pc.bgRed("CARTS"));
    const cartController = new CartController();
    this.get("/:cid", ["ADMIN", "USER", "PREMIUM"], cartController.getOne);
    this.get("/", ["ADMIN"], cartController.getCarts);
    this.post("/", ["USER", "PREMIUM"], cartController.postOne);
    this.post(
      "/:cid/product/:pid",
      ["USER", "PREMIUM"],
      cartController.addToCart
    );
    this.delete(
      "/:id",
      ["USER", "PREMIUM", "ADMIN"],
      cartController.deleteCart
    );
    //borrar producto de carrito
    this.delete(
      "/:cid/product/:pid",
      ["USER", "PREMIUM", "ADMIN"],
      cartController.deleteProduct
    );
    this.post("/:cid/purchase", ["USER", "PREMIUM"], cartController.purchase);
  }
}
