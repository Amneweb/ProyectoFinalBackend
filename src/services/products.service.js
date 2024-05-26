import { BadRequestError } from "../utils/errors.js";
import { productDAO } from "../utils/factory.js";
import { validateProduct, validateId } from "../utils/product.validator.js";
export default class ProductManager {
  getProducts = async (page, limit, sort) => {
    console.log("en get products de product service");
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
      validateProduct(product);

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
