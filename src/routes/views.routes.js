/*======================================================
RUTAS DESDE LA RAIZ DEL SITIO
/*======================================================*/
import CustomRouter from "./custom/custom.router.js";
import ProductManager from "../services/products.service.js";
import CategoryManager from "../services/categories.service.js";
import CartManager from "../services/carts.service.js";
import pc from "picocolors";

export default class ViewsRouter extends CustomRouter {
  init() {
    const productManager = new ProductManager();
    const cartManager = new CartManager();
    const categoryManager = new CategoryManager();

    this.get("/catalogo", ["PUBLIC"], async (req, res) => {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 300;
      const criterio = req.query.criterio || "title";
      const sentido = parseInt(req.query.sentido) || 1;
      let sort = {};
      sort[criterio] = sentido;

      try {
        const productosObtenidos = await productManager.getProducts(
          page,
          limit,
          sort
        );
        productosObtenidos.paginacion =
          limit >= productosObtenidos.totalDocs ? false : true;

        productosObtenidos.prevLink = productosObtenidos.hasPrevPage
          ? `/catalogo/?page=${productosObtenidos.prevPage}&limit=${limit}&sentido=${sentido}&criterio=${criterio}`
          : "";
        productosObtenidos.nextLink = productosObtenidos.hasNextPage
          ? `/catalogo/?page=${productosObtenidos.nextPage}&limit=${limit}&sentido=${sentido}&criterio=${criterio}`
          : "";

        productosObtenidos.isValid = !(
          page < 1 || page > productosObtenidos.totalPages
        );

        res.render("catalogo", {
          productosObtenidos,
          user: req.user,
          style: "catalogo.css",
        });
      } catch (e) {
        res
          .status(500)
          .render("errors", { mesage: e.message, style: "catalogo.css" });
      }
    });

    /*======================================================
//Vista de un único producto. Abierta a todo el público
======================================================*/
    this.get("/catalogo/:id", ["PUBLIC"], async (req, res) => {
      const id = req.params.id;
      try {
        const producto = await productManager.getProductByID(id);
        if (!producto) {
          const estado = 403;
          const mensaje = `no se encontró ningún producto con el ID ${id}. Número de estado: ${estado}`;
          throw new Error(mensaje);
        }
        res.render("product", {
          producto,
          style: "catalogo.css",
        });
      } catch (e) {
        res
          .status(500)
          .render("errors", { message: e.message, style: "catalogo.css" });
      }
    });

    /*======================================================
Vista de los carritos armados por los usuarios. 
Acceso exclusivo para administradores
======================================================*/
    this.get("/admin", ["ADMIN", "PREMIUM"], async (req, res) => {
      try {
        const carritosObtenidos = await cartManager.getCarts();
        if (!carritosObtenidos) {
          const mensaje = `No se pudieron cargar los carritos`;
          throw new Error(mensaje);
        }
        res.render("carts", { carritosObtenidos, style: "general.css" });
      } catch (e) {
        res
          .status(500)
          .render("errors", { message: e.message, style: "catalogo.css" });
      }
    });

    /*======================================================
Vista del chat de sitio. Acceso para todos 
los usuarios logueados
========================================================*/
    this.get("/chat", ["PUBLIC"], (req, res) => {
      res.render("messages", { style: "general.css" });
    });

    /*======================================================
Vista de todos los productos a la venta en el ecommerce. 
Acceso sólo para administradores.
======================================================*/
    this.get("/home", ["ADMIN"], async (req, res) => {
      try {
        let productosObtenidos = productManager.getProducts(1, 300, {
          title: 1,
        });
        let categoriasExistentes = categoryManager.getCategories();
        await Promise.all([productosObtenidos, categoriasExistentes]).then(
          ([productosObtenidos, categoriasExistentes]) => {
            res.render("adminProducts", {
              productosObtenidos,
              categoriasExistentes,
              style: "general.css",
            });
          }
        );
      } catch (e) {
        res
          .status(500)
          .render("errors", { message: e.message, style: "catalogo.css" });
      }
    });

    /*======================================================
Vista del carrito del usuario. 
Acceso para el usuario que tiene un carrito en el localstorage
======================================================*/
    this.get("/carrito/:cid", ["PUBLIC"], async (req, res) => {
      try {
        const carrito = await cartManager.getCartByID(req.params.cid);

        if (!carrito.success) {
          throw new Error(carrito.message);
        }
        res.render("usercart", {
          carrito: carrito.data,
          style: "general.css",
        });
      } catch (e) {
        res
          .status(404)
          .render("errors", { message: e.message, style: "catalogo.css" });
      }
    });

    /*======================================================
Vista de datos de un producto. 
Acceso exclusivo para administradores.
/*======================================================*/
    this.get("/adminProduct/:pid", ["ADMIN"], async (req, res) => {
      const id = req.params.pid;
      try {
        let productosObtenidos = productManager.getProductByID(id);
        let categoriasExistentes = categoryManager.getCategories();
        await Promise.all([productosObtenidos, categoriasExistentes]).then(
          ([productosObtenidos, categoriasExistentes]) => {
            res.render("adminProduct", {
              productosObtenidos,
              categoriasExistentes,
              style: "general.css",
            });
          }
        );
      } catch (e) {
        res
          .status(500)
          .render("errors", { message: e.message, style: "catalogo.css" });
      }
    });

    this.get("/", ["PUBLIC"], async (req, res) => {
      try {
        res.render("index", {
          style: "catalogo.css",
        });
      } catch (e) {
        res
          .status(500)
          .render("errors", { mesage: e.message, style: "catalogo.css" });
      }
    });

    this.get("/localstorage", ["PUBLIC"], async (req, res) => {
      res.render("localusercart", {
        style: "general.css",
      });
    });
  }
}
