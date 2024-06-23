import CustomRouter from "./custom/custom.router.js";
import ProductViewsController from "../controllers/products.views.controller.js";

export default class ViewsRouter extends CustomRouter {
  init() {
    const productController = new ProductViewsController();
    /*
     *  ============================================================
     *  dominio.../catalogo Vista al público de todos los productos
     *  ============================================================
     */
    this.get("/catalogo", ["PUBLIC"], productController.getAll);
    /*
     *  ==============================================================
     *  dominio.../catalogo/:id Vista al público de un único producto
     *  ==============================================================
     */
    this.get("/catalogo/:id", ["PUBLIC"], productController.getOne);
    /*
     *  =========================================
     *  dominio.../index.html Home page
     *  =========================================
     */
    this.get("/", ["PUBLIC"], productController.getAll);
    /*
     *  ===============================================================
     *  dominio.../admin/catalogo Vista de productos al administrador
     *  ===============================================================
     */
    this.get("/admin/catalogo", ["ADMIN"], productController.getAll);
    this.get("/admin/producto/:id", ["ADMIN"], productController.getOne);
  }
}
