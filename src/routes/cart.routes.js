import CartController from "../controllers/carts.controller.js";
import CustomRouter from "./custom/custom.router.js";
export default class CartsRouter extends CustomRouter {
  init() {
    console.log("en clase cart routes");
    const cartController = new CartController();
    this.get("/:cid", ["USER", "ADMIN"], cartController.getOne);
    this.get("/", ["ADMIN"], async (req, res) => {
      res.send(await cartManager.getCarts());
    });
    this.post("/", ["USER", "ADMIN"], cartController.postOne);
    this.post(
      "/:cid/product/:pid",
      ["USER", "ADMIN"],
      cartController.addToCart
    );
    this.delete("/:id", ["USER", "ADMIN"], cartController.deleteCart);
    //borrar producto de carrito
    this.delete(
      "/:cid/product/:pid",
      ["USER", "ADMIN"],
      cartController.deleteProduct
    );
  }
}
