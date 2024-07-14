import ProductManager from "../services/products.service.js";
import CategoryManager from "../services/categories.service.js";
import { BadRequestError, InternalServerError } from "../utils/errors.js";

import { productsLogger as logger } from "../config/logger.config.js";

export default class ProductsViewsController {
  #productManager;
  #categoryManager;

  constructor() {
    this.#productManager = new ProductManager();
    this.#categoryManager = new CategoryManager();
  }
  index = async (req, res) => {
    res.render("index", {
      style: "main.css",
    });
  };
  /*
   *  ============================================================
   *  vista de todos los productos: admin o visitante
   *  ============================================================
   */

  getAll = async (req, res) => {
    let page = parseInt(req.query.page) || 1;
    if (page <= 0 || page > 1000) {
      page = 1;
    }
    let limit = parseInt(req.query.limit) || 0;
    if (limit < 0 || limit > 10000) {
      limit = 0;
    }
    let criterio = req.query.criterio || "title";
    if (criterio != "title" && criterio != "price" && criterio != "stock") {
      criterio = "title";
    }
    let sentido = parseInt(req.query.sentido) || 1;
    if (sentido != -1 && sentido != 1) sentido = 1;
    let sort = {};
    sort[criterio] = sentido;
    try {
      const productosObtenidos = await this.#productManager.getProducts(
        page,
        limit,
        sort
      );
      if (!productosObtenidos) {
        logger.debug("Error interno al tratar de obtener los productos.");
        throw new InternalServerError(
          "Error interno al tratar de obtener los productos. Por favor vuelva a intentarlo más tarde."
        );
      }

      logger.debug("se obtuvieron todos los productos sin problema");

      productosObtenidos.prevLink = productosObtenidos.hasPrevPage
        ? `/catalogo/?page=${productosObtenidos.prevPage}&limit=${limit}&sentido=${sentido}&criterio=${criterio}`
        : "";
      productosObtenidos.nextLink = productosObtenidos.hasNextPage
        ? `/catalogo/?page=${productosObtenidos.nextPage}&limit=${limit}&sentido=${sentido}&criterio=${criterio}`
        : "";

      productosObtenidos.isValid = !(
        page < 1 || page > productosObtenidos.totalPages
      );
      const logueado = req.user && req.user;
      if (req.path === "/admin/catalogo") {
        const categoriasExistentes =
          await this.#categoryManager.getCategories();
        res.render("catalogoAdmin", {
          productosObtenidos,
          categoriasExistentes,
          style: `admin.css`,
        });
      } else {
        res.render("catalogo", {
          productosObtenidos,

          logueado,
          style: `catalogo.css`,
        });
      }
    } catch (e) {
      logger.error(
        "Error interno al tratar de obtener productos: %s",
        e.message
      );
      res.render("errors", {
        message:
          "Error interno al tratar de obtener los productos. Mensaje del sistema: " +
          e.message,
      });
    }
  };

  getByCate = async (req, res) => {
    const cate = req.params.cid;
    let page = parseInt(req.query.page) || 1;
    if (page <= 0 || page > 1000) {
      page = 1;
    }
    let limit = parseInt(req.query.limit) || 0;
    if (limit < 0 || limit > 10000) {
      limit = 0;
    }
    let criterio = req.query.criterio || "title";
    if (criterio != "title" && criterio != "price" && criterio != "stock") {
      criterio = "title";
    }
    let sentido = parseInt(req.query.sentido) || 1;
    if (sentido != -1 && sentido != 1) sentido = 1;
    let sort = {};
    sort[criterio] = sentido;
    try {
      const productosObtenidos = await this.#productManager.getByCategory(
        page,
        limit,
        sort,
        cate
      );
      if (!productosObtenidos) {
        logger.debug("Error interno al tratar de obtener los productos.");
        throw new InternalServerError(
          "Error interno al tratar de obtener los productos. Por favor vuelva a intentarlo más tarde."
        );
      }

      logger.debug("se obtuvieron todos los productos sin problema");

      productosObtenidos.prevLink = productosObtenidos.hasPrevPage
        ? `/catalogo/?page=${productosObtenidos.prevPage}&limit=${limit}&sentido=${sentido}&criterio=${criterio}`
        : "";
      productosObtenidos.nextLink = productosObtenidos.hasNextPage
        ? `/catalogo/?page=${productosObtenidos.nextPage}&limit=${limit}&sentido=${sentido}&criterio=${criterio}`
        : "";

      productosObtenidos.isValid = !(
        page < 1 || page > productosObtenidos.totalPages
      );
      const logueado = req.user && req.user;

      if (req.path === "/admin/catalogo") {
        res.render("catalogoAdmin", {
          productosObtenidos,
          style: `admin.css`,
        });
      } else {
        res.render("catalogo", {
          productosObtenidos,
          logueado,
          style: `catalogo.css`,
        });
      }
    } catch (e) {
      logger.error(
        "Error interno al tratar de obtener productos: %s",
        e.message
      );
      res.render("errors", {
        message:
          "Error interno al tratar de obtener los productos. Mensaje del sistema: " +
          e.message,
      });
    }
  };

  getOne = async (req, res) => {
    logger.method("getOne");
    try {
      const id = req.params.id;
      const result = await this.#productManager.getProductByID(id);

      if (!result) {
        logger.debug(
          "No se encontró ningún producto con el ID %s",
          req.params.id
        );
        throw new BadRequestError(
          `no se encontró ningún producto con el ID ${req.params.id}`
        );
      }
      logger.debug("Se obtuvo el producto sin problemas");

      if (req.path.split("/").includes("admin")) {
        const categoriasExistentes =
          await this.#categoryManager.getCategories();
        res.render("productoAdmin", {
          result,
          categoriasExistentes,
          style: `admin.css`,
        });
      } else {
        res.render("producto", {
          result,
          style: `catalogo.css`,
        });
      }
    } catch (e) {
      logger.error(
        "Error al tratar de obtener el producto. Mensaje: '%s'",
        e.message
      );
      res.render("errors", {
        message:
          "Error interno al tratar de obtener los productos. Mensaje del sistema: " +
          e.message,
      });
    }
  };
}
