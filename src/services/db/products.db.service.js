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

  /*=============================================
=       Agregar 1 imagen a producto           =
=============================================*/
uploadThumbByID = async (id, file) => {
  try {
    const productoAmodificar = await this.getProductByID(id);
    console.log(
      "producto cuya imagen se está agregando ",
      productoAmodificar
    );
    if (productoAmodificar) {
      const indice = this.#productos.indexOf(productoAmodificar);
      this.#productos[indice].thumb.push(file.replaceAll(" ", "%20"));
      await this.#fs.promises.writeFile(
        this.#productosRutaArchivo,
        JSON.stringify(this.#productos, null, 2, "\t")
      );
      let msj = `El producto con id ${id} fue modificado con éxito\n\n`;
      return msj;
    } else {
      throw "No existe un producto con el id indicado";
    }
  } catch (error) {
    return `Error al tratar de modificar el producto.\nDetalle del error: ${error}`;
  }
};
}
}
