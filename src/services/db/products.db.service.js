import productModel from "./models/products.model.js";
import pc from "picocolors";

export default class ProductManager {
  constructor() {
    console.log(pc.blue("Dentro de la clase product manager"));
  }
  getProducts = async () => {
    const products = await productModel.find().lean();
    return products;
  };

  getPagination = async (page, limit) => {
    const products = await productModel.paginate(
      {},
      {
        page,
        limit: 4,
        sort: {
          stock: -1,
        },
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
    let result = await productModel.updateOne({ _id: id }, nuevo);
    if (result.modifiedCount > 0) {
      const modificado = await productModel.findOne({ _id: id });
      return { modificado };
    } else {
      return result;
    }
  };
}
