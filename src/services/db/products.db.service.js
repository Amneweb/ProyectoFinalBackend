import productModel from "./models/products.model.js";
import pc from "picocolors";

export default class ProductManager {
  constructor() {
    console.log(pc.blue("Dentro de la clase product manager"));
  }
  getProducts = async () => {
    const products = await productModel.find();
    return products.map((product) => product.toObject());
  };
  addProduct = async (product) => {
    let productoNuevo = await productModel.create(product);
    return productoNuevo;
  };
  getProductByID = async (id) => {
    const product = await productModel.findOne({ _id: id });
    return product.toObject();
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
