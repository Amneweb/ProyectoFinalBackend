import productModel from "./products.model.js";
import pc from "picocolors";
export default class ProductManager {
  constructor() {}

  getProducts = async (page, limit, sort) => {
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
    try {
      let productoNuevo = await productModel.create(product);
      return productoNuevo;
    } catch (e) {
      console.log(pc.green("error completo " + e));
      console.log("error ", e.message);
      console.log(pc.bgYellow("termina el error"));
      throw new Error("No se pudo crear el producto " + e.message);
    }
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
