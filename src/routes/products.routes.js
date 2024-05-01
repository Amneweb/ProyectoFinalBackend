import { uploader, validateModifiedData } from "../../utils.js";
import { validateFormData } from "../../utils.js";
import CustomRouter from "./custom/custom.router.js";
import ProductController from "../controllers/products.controller.js";
import pc from "picocolors";

export default class ProductsRouter extends CustomRouter {
  init() {
    const productController = new ProductController();
    console.log(pc.bgYellow("ADMIN PRODUCTS"));

    this.get("/", ["PUBLIC"], productController.getAll);
    this.get("/:id", ["PUBLIC"], productController.getOne);

    this.post(
      "/",
      ["ADMIN", "PREMIUM"],
      uploader.single("imagen"),
      validateFormData,
      productController.postOne
    );

    this.delete("/:id", ["ADMIN", "PREMIUM"], productController.deleteOne);

    this.put(
      "/:id",
      ["ADMIN", "PREMIUM"],
      validateModifiedData,
      productController.modifyOne
    );

    this.put(
      "/:id/categoria/:cate",
      ["ADMIN", "PREMIUM"],
      productController.modifyCate
    );

    this.post(
      "/imagenes/",
      ["ADMIN", "PREMIUM"],
      uploader.single("imagen"),
      validateModifiedData,
      productController.postImage
    );
  }
}
