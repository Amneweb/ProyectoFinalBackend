import { BadRequestError } from "../utils/errors.js";
import { productDAO } from "../utils/factory.js";
import { validateProduct, validateId } from "../utils/product.validator.js";
import { productsLogger as logger } from "../config/logger.config.js";
export default class ProductManager {
  constructor() {}
  getProducts = async (page, limit, sort) => {
    return await productDAO.findAll(page, limit, sort);
  };

  addProduct = async (product) => {
    const existsProduct = await productDAO.findOne({ code: product.code });

    if (existsProduct) {
      throw new BadRequestError(
        `Ya existe un producto con el código ${product.code}`
      );
    }
    const { title, description, code, price, category, thumb, st, stock } =
      validateProduct(product).data;

    return await productDAO.create({
      title,
      description,
      code,
      price,
      category,
      thumb,
      st,
      stock,
    });
  };
  getProductByID = async (id) => {
    return await productDAO.findByID(id);
  };
  deleteProduct = async (id) => {
    if (!validateId(id)) {
      throw new BadRequestError(`el id ${id} no es un id válido`);
    }

    return await productDAO.delete(id);
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
