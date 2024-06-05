import { BadRequestError } from "../utils/errors.js";
import { productDAO } from "../utils/factory.js";
import { validateProduct, validateId } from "../utils/product.validator.js";
import UserDAO from "./daos/mongo/users/users.mongo.dao.js";
import { productsLogger as logger } from "../config/logger.config.js";
export default class ProductManager {
  constructor() {
    this.userDAO = new UserDAO();
  }

  getProducts = async (page, limit, sort) => {
    return await productDAO.findAll(page, limit, sort);
  };

  addProduct = async (product) => {
    logger.debug("Datos que llegan al servicio %j", product);
    const existsProduct = await productDAO.findOne({ code: product.code });

    if (existsProduct) {
      throw new BadRequestError(
        `Ya existe un producto con el código ${product.code}`
      );
    }
    const { title, description, code, price, category, thumb, st, stock } =
      validateProduct(product).data;
    const ownerVerificado =
      product.owner && (await this.userDAO.findOne(product.owner));
    logger.debug("owner verificado %j", ownerVerificado);
    const nuevoProducto = await productDAO.create({
      title,
      description,
      code,
      price,
      category,
      thumb,
      st,
      stock,
      ...(ownerVerificado && { owner: ownerVerificado._id }),
    });

    return nuevoProducto;
  };
  getProductByID = async (id) => {
    return await productDAO.findByID(id);
  };
  deleteProduct = async (id) => {
    if (!validateId(id)) {
      throw new BadRequestError(`el id ${id} no es un id válido`);
    }

    return await productDAO.deleteByID(id);
  };
  updateProduct = async (id, nuevo) => {
    return await productDAO.update(id, nuevo);
  };
  updateCategory = async (id, cate) => {
    const existente = await productDAO.findByID(id);
    if (!existente) {
      throw new BadRequestError("no existe ningún producto con ese ID");
    }
    const arrayCategorias = existente.category;
    if (arrayCategorias.indexOf(cate) === -1) {
      arrayCategorias.push(cate);
    } else {
      arrayCategorias.splice(arrayCategorias.indexOf(cate), 1);
    }
    return await productDAO.update(id, {
      ...existente,
      category: arrayCategorias,
    });
  };
}
