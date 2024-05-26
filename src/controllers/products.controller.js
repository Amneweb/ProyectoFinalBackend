import productManager from "../services/products.service.js";
import { BadRequestError, InternalServerError } from "../utils/errors.js";
import { productsLogger as logger } from "../config/logger.config.js";

export default class ProductsController {
  #productManager;
  constructor() {
    this.#productManager = productManager;
  }

  getAll = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 300;
    const criterio = req.query.criterio || "title";
    const sentido = parseInt(req.query.sentido) || 1;
    let sort = {};
    sort[criterio] = sentido;
    try {
      const productosObtenidos = await this.#productManager.getProducts(
        page,
        limit,
        sort
      );
      if (!productosObtenidos) {
        throw new InternalServerError(
          "Error interno al tratar de obtener los productos. Por favor vuelva a intentarlo más tarde."
        );
      }

      return res.send(productosObtenidos);
    } catch (e) {
      res.sendInternalServerError(e);
    }
  };

  getOne = async (req, res) => {
    try {
      const id = req.params.id;
      const result = await this.#productManager.getProductByID(id);
      if (!result) {
        throw new BadRequestError(
          `no se encontró ningún producto con el ID ${req.params.id}`
        );
      }
      logger.method("getOne");
      res.sendSuccess(result);
    } catch (e) {
      logger.error(e.message);
      res.sendClientError(e);
    }
  };

  postOne = async (req, res) => {
    const nuevo = req.validatedData;
    if (nuevo.error) {
      return res.sendClientError(nuevo.error.message);
    }
    try {
      let imagen = [];
      nuevo.data.thumb && imagen.push(nuevo.data.thumb);
      const result = await this.#productManager.addProduct({
        ...nuevo.data,
        thumb: imagen,
      });

      res.sendSuccess(result);
    } catch (e) {
      res.sendClientError(e);
    }
  };

  deleteOne = async (req, res) => {
    const id = req.params.id;
    try {
      const result = await this.#productManager.deleteProduct(id);
      res.sendSuccess(result);
    } catch (e) {
      res.sendClientError(e);
    }
  };

  modifyOne = async (req, res) => {
    const nuevo = req.validatedData;
    const id = req.params.id;

    if (nuevo.error) {
      return res.sendClientError(nuevo.error.message);
    } else
      try {
        const result = await this.#productManager.updateProduct(id, nuevo.data);
        res.sendSuccess(result);
      } catch (e) {
        res.sendClientError(e);
      }
  };

  modifyCate = async (req, res) => {
    const id = req.params.id;
    const category = req.params.cate;

    try {
      const result = this.#productManager.updateCategory(id, category);
      res.sendSuccess(result);
    } catch (e) {
      res.sendClientError(e);
    }
  };
  postImage = async (req, res) => {
    const id = req.body.IDproducto;
    const datos = req.validatedData;
    if (!req.file) {
      return res.sendClientError("no hay ningún archivo adjunto");
    }

    try {
      let imagen = [];
      datos.data.thumb && imagen.push(datos.data.thumb);
      const nuevo = { ...datos, thumb: imagen };
      const result = await this.#productManager.updateProduct(id, nuevo);
      res.sendSuccess(result);
    } catch (e) {
      res.sendClientError(e);
    }
  };
}
