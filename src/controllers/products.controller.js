import ProductManager from "../services/products.service.js";
import { BadRequestError, InternalServerError } from "../utils/errors.js";

import { productsLogger as logger } from "../config/logger.config.js";

export default class ProductsController {
  #productManager;

  constructor() {
    this.#productManager = new ProductManager();
  }

  getAll = async (req, res) => {
    const renderOption = req.renderOption;
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
      logger.debug("render options %s", renderOption);
      if (renderOption === "RENDER") {
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
          style: `catalogo.css`,
        });
      } else {
        res.sendSuccess(productosObtenidos);
      }

      //return consultaExitosa(res, productosObtenidos, renderOption, "catalogo");
    } catch (e) {
      logger.error(
        "Error interno al tratar de obtener productos: %s",
        e.message
      );
      res.sendInternalServerError(e);
    }
  };

  getOne = async (req, res) => {
    const renderOption = req.renderOption;
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
      if (renderOption === "RENDER") {
        res.render("product", {
          result,
          style: `catalogo.css`,
        });
      } else {
        res.sendSuccess(result);
      }
    } catch (e) {
      logger.error(
        "Error al tratar de obtener el producto. Mensaje: '%s'",
        e.message
      );
      res.sendClientError(
        "Hubo un error al tratar de traer los datos del producto. Mensaje del sistema ",
        e.message
      );
    }
  };

  postOne = async (req, res) => {
    const renderOption = req.renderOption;
    const nuevo = req.validatedData;
    logger.debug("usuario en controlador de productos %s", req.user.email);
    console.log("req user role", req.user.role.toUpperCase());
    if (req.user.role.toUpperCase() === "PREMIUM") {
      const owner = req.user.email;
    }

    const owner = req.user.role.toUpperCase() === "PREMIUM" && req.user.email;
    logger.debug("owner en controlador %s", owner);
    logger.debug(
      "datos para crear producto que llegan al controlador %s",
      req.validatedData.code
    );
    if (!nuevo) {
      logger.error(
        "Error de validación de datos al tratar de crear un producto nuevo: %s",
        nuevo.error.message
      );
      return res.sendClientError(
        `Error de validación de datos al tratar de crear un producto nuevo. Mensaje interno: "${nuevo.error.message}"`
      );
    }
    try {
      let imagen = [];
      if (nuevo.thumb != "") imagen.push(nuevo.thumb);
      const product = {
        ...nuevo,
        thumb: imagen,
        ...(owner && { owner: owner }),
      };

      const result = await this.#productManager.addProduct(product);
      logger.debug("El producto se agregó correctamente con id %s", result._id);
      consultaExitosa(res, result, renderOption, "catalogo");
    } catch (e) {
      logger.error("Error al tratar de crear un producto nuevo: %s", e.message);
      res.status(500).send({ status: "Internal Server Error", error });
    }
  };

  deleteOne = async (req, res) => {
    const renderOption = req.renderOption;
    const id = req.params.id;
    const user = req.user;

    try {
      const result = await this.#productManager.deleteProduct(id, user);
      logger.debug(`El producto con id ${id} se borró exitosamente`);
      res.sendSuccess(result);
    } catch (e) {
      logger.error("Error al tratar de borrar el producto: %s", e.message);
      res.sendClientError(
        `Error al tratar de borrar el producto. Mensaje del sistema: "${e.message}"`
      );
    }
  };

  modifyOne = async (req, res) => {
    const renderOption = req.renderOption;
    const modified = req.validatedData;
    const id = req.params.id;
    const user = req.user;
    console.log("en modify controller ", modified);
    if (modified.error) {
      logger.error(
        "Error de validación de datos al tratar de modificar el producto: %s",
        modified.error.message
      );
      return res.sendClientError(
        `Error de validación de datos al tratar de modificar el producto. Mensaje interno: "${modified.error.message}"`
      );
    } else
      try {
        const result = await this.#productManager.updateProduct(
          id,
          modified,
          user
        );
        logger.debug(`El producto con id ${id} se modificó exitosamente`);
        res.sendSuccess(result);
      } catch (e) {
        logger.error("Error al tratar de modificar el producto: %s", e.message);
        res.sendClientError(
          `Error al tratar de modificar el producto con id ${id}. Mensaje del sistema: "${e.message}"`
        );
      }
  };
  modifyCate = async (req, res) => {
    const renderOption = req.renderOption;
    const id = req.params.id;
    const category = req.params.cate;
    const user = req.user;
    try {
      const result = await this.#productManager.updateCategory(
        id,
        category,
        user
      );

      logger.debug("La categoría del producto se modificó exitosamente");
      res.sendSuccess(result);
    } catch (e) {
      logger.error(
        "Error al tratar de modificar la categoría del producto: %s",
        e.message
      );
      res.sendClientError(
        `Error al tratar de modifificar la categoría del producto con id ${id}. Mensaje del sistema: "${e.message}"`
      );
    }
  };
  putImage = async (req, res) => {
    const renderOption = req.renderOption;
    const id = req.params.id;
    const datos = req.validatedData;
    const user = req.user;
    if (!datos.thumb) {
      return res.sendClientError("No se ha subido ningún archivo adjunto");
    }

    try {
      const result = await this.#productManager.updateImages(
        id,
        datos.thumb,
        user
      );
      logger.debug("La imagen se cargó correctamente");
      res.sendSuccess(result);
    } catch (e) {
      logger.error("No se pudo subir la nueva imagen: %s", e.message);
      res.sendClientError(
        `Error al tratar de subir la imagen para el producto con ${id}. Mensaje del sistema: "${e.message}"`
      );
    }
  };
}
