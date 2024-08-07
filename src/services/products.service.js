import { BadRequestError } from "../utils/errors.js";
import { productDAO } from "./factory.js";
import ProductRepository from "./repositories/products.repository.js";
import { validateProduct } from "../utils/product.validator.js";
import { productsLogger as logger } from "../config/logger.config.js";
import { validateId, validateOwnership } from "./validators.service.js";
import UserDAO from "./daos/mongo/users/users.mongo.dao.js";
export default class ProductManager {
  constructor() {
    this.userDAO = new UserDAO();
    this.productRepository = new ProductRepository();
  }

  getProducts = async (page, limit, sort) => {
    const options = limit === 0 ? { pagination: false } : { page, limit, sort };
    return await this.productRepository.findAll(options);
  };
  getByCategory = async (page, limit, sort, cate) => {
    const options = limit === 0 ? { pagination: false } : { page, limit, sort };
    return await this.productRepository.findByCate(options, cate);
  };

  addProduct = async (product) => {
    logger.debug("Datos que llegan al servicio %s", product.code);
    const existsProduct = await productDAO.findOne({ code: product.code });

    if (existsProduct) {
      throw new BadRequestError(
        `Ya existe un producto con el código ${product.code}`
      );
    }
    logger.silly("al validar %j", validateProduct(product));
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
  deleteProduct = async (id, user) => {
    const role = user.role;
    const email = user.email;

    logger.debug("ID del producto a borrar %s", id);
    if (!validateId(id)) {
      throw new BadRequestError(`el id ${id} no es un id válido`);
    }
    if (role.toUpperCase() != "ADMIN") {
      await validateOwnership(id, email);
    }
    logger.silly("pasó todos los controles");

    return await productDAO.delete(id);
  };
  updateProduct = async (id, nuevo, user) => {
    const role = user.role;
    const email = user.email;
    if (role.toUpperCase() != "ADMIN") {
      await validateOwnership(id, email);
    }
    logger.silly("pasó todos los controles");
    return await this.productRepository.updateFullProduct(id, nuevo);
  };
  updateCategory = async (id, cate, user) => {
    const role = user.role;
    const email = user.email;
    if (role.toUpperCase() != "ADMIN") {
      await validateOwnership(id, email);
    }
    logger.silly("pasó todos los controles para actualizar categoría");
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
    return await this.productRepository.updatePartial(id, {
      category: arrayCategorias,
    });
  };

  updateStock = async (id, stock) => {
    const existente = await productDAO.findByID(id);
    if (!existente) {
      throw new BadRequestError("no existe ningún producto con ese ID");
    }

    return await this.productRepository.updatePartial(id, {
      stock: stock,
    });
  };

  updateImages = async (id, thumb, user) => {
    const role = user.role;
    const email = user.email;
    if (role.toUpperCase() != "ADMIN") {
      await validateOwnership(id, email);
    }

    const existente = await productDAO.findByID(id);
    if (!existente) {
      throw new BadRequestError("no existe ningún producto con ese ID");
    }
    const arrayThumb = existente.thumb;
    if (arrayThumb.indexOf(thumb) === -1) {
      arrayThumb.push(thumb);
    } else {
      arrayThumb.splice(arrayThumb.indexOf(thumb), 1);
    }
    return await this.productRepository.updatePartial(id, {
      thumb: arrayThumb,
    });
  };
}
