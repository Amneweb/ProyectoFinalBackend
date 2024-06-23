import CustomRouter from "./custom/custom.router.js";
import ProductController from "../controllers/products.controller.js";
import { renderizar as renderOption } from "../utils/utils.js";

export default class ViewsRouter extends CustomRouter {
  init() {
    const productController = new ProductController();

    this.get("/catalogo", ["PUBLIC"], renderOption, productController.getAll);
    this.get(
      "/catalogo/:id",
      ["PUBLIC"],
      renderOption,
      productController.getOne
    );
    this.get("/", ["PUBLIC"], renderOption, productController.getAll);
    this.get(
      "/admin/productos",
      ["ADMIN"],
      renderOption,
      productController.getAll
    );
  }
}
