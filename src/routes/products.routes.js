import { uploader, validateModifiedData, agregarRuta } from "../utils/utils.js";
import { validateFormData } from "../utils/utils.js";
import CustomRouter from "./custom/custom.router.js";
import ProductController from "../controllers/products.controller.js";
import pc from "picocolors";

export default class ProductsRouter extends CustomRouter {
  init() {
    const productController = new ProductController();

    this.get("/", ["PUBLIC"], productController.getAll);
    this.get("/:id", ["PUBLIC"], productController.getOne);

    this.post(
      "/",
      ["ADMIN", "PREMIUM"],
      agregarRuta,
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

    this.put(
      "/:id/imagenes/",
      ["ADMIN", "PREMIUM"],
      agregarRuta,
      uploader.single("imagen"),
      validateModifiedData,
      productController.putImage
    );
  }
}
