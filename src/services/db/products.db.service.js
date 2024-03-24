import productModel from "./models/products.model.js";
import pc from "picocolors";

export default class ProductManager {
  constructor() {}
  getProducts = async () => {
    const products = await productModel.find().lean();
    return products;
  };

  getPagination = async (page, limit, sort) => {
    const products = await productModel.paginate(
      {},
      {
        page,
        limit,
        sort,
        lean: true,
      }
    );
    return products;
  };

  addProduct = async (product) => {
    let productoNuevo = await productModel.create(product);
    return productoNuevo;
  };
  getProductByID = async (id) => {
    const product = await productModel.findOne({ _id: id }).lean();
    return product;
  };
  deleteProduct = async (id) => {
    let result = await productModel.deleteOne({ _id: id });
    return result;
  };
  updateProduct = async (id, nuevo) => {
    const { category, ...sinCategoria } = nuevo;

    let result = await productModel.updateOne(
      { _id: id },
      {
        $addToSet: {
          category: nuevo.category[0],
        },
        $set: {
          ...sinCategoria,
        },
      }
    );

    if (result.modifiedCount > 0) {
      const modificado = await productModel.findOne({ _id: id });
      return { modificado };
    } else {
      return result;
    }
  };
  deleteProductCategory = async (id, cate) => {
    let result = await productModel.updateOne(
      { _id: id },
      {
        $pull: {
          category: cate,
        },
      }
    );
    if (result.modifiedCount > 0) {
      const modificado = await productModel.findOne({ _id: id });
      return { modificado };
    } else {
      return result;
    }
  };
}
