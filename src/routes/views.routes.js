import CustomRouter from "./custom/custom.router.js";
import ProductViewsController from "../controllers/products.views.controller.js";
import CartViewsController from "../controllers/carts.views.controller.js";
export default class ViewsRouter extends CustomRouter {
  init() {
    const productController = new ProductViewsController();
    const cartController = new CartViewsController();
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
     *  ==============================================================
     *  dominio.../catalogo/category/:cid Vista al público de productos de 1 categoría
     *  ==============================================================
     */
    this.get(
      "/catalogo/category/:cid",
      ["PUBLIC"],
      productController.getByCate
    );
    /*
     *  =========================================
     *  dominio.../index.html Home page
     *  =========================================
     */
    this.get("/", ["PUBLIC"], productController.index);
    /*
     *  ===============================================================
     *  dominio.../admin/catalogo Vista de productos al administrador
     *  ===============================================================
     */
    this.get("/admin/catalogo", ["ADMIN"], productController.getAll);
    /*
     *  ===============================================================
     *  dominio.../admin/catalogo Vista de un producto al administrador
     *  ===============================================================
     */
    this.get("/admin/producto/:id", ["ADMIN"], productController.getOne);
    /*
     *  ===============================================================
     *  dominio.../admin/carts Vista de todos los carritos
     *  ===============================================================
     */
    this.get("/admin/carts", ["ADMIN"], cartController.getCarts);

    this.get("/localstorage", ["PUBLIC"], cartController.localStorage);

    this.get("/compra", ["USER", "PREMIUM"], cartController.compra);
  }
}
