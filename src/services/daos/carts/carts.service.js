import { cartModel } from "./carts.model.js";
import {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  InternalServerError,
} from "../../../utils/errors.js";
import productModel from "../products/products.model.js";

class CartManager {
  //carrito vacío
  addCart = async () => {
    let newCarrito = {
      products: [],
    };
    return await cartModel.create(newCarrito);
  };
  //obtener carritos
  getCarts = async () => {
    return await cartModel.find().lean();
  };
  //obtener carrito con id determinado
  getCartByID = async (id) => {
    return await cartModel.findOne({ _id: id }).lean();
  };
  updateCart = async (id, nuevoCarrito) => {
    return await cartModel.updateOne(
      { _id: id },
      { $set: { cart: nuevoCarrito } }
    );
  };

  //agregar producto a un carrito específico
  addProductToCartID = async (id, productID) => {
    console.log("en add product to cart");

    let carritoBuscado = await cartModel.findById(id);
    if (!carritoBuscado) {
      throw new BadRequestError(`No se encontró ningún carrito con id ${id}`);
    }
    const producto = await productModel.findById(productID);

    //para verificar que exista un producto con ese id
    if (!producto) {
      console.log("adentro de if producto ");
      throw new BadRequestError(
        `No existe ningún producto con id ${productID}`
      );
    }

    const productIndex = carritoBuscado.cart.findIndex(
      (productItem) => productItem.product._id.toString() === productID
    );

    if (productIndex === -1) {
      carritoBuscado.cart.push({ product: productID, qty: 1 });
    } else {
      carritoBuscado.cart[productIndex].qty++;
    }

    await carritoBuscado.save();

    return carritoBuscado;
  };

  //borrar carrito
  deleteFullCartByID = async (id) => {
    const carritoBuscado = cartModel.findById(id);
    if (!carritoBuscado) {
      throw new BadRequestError("El carrito buscado no existe");
    }
    return await cartModel.deleteOne({ _id: id });
  };

  //borrar producto de un carrito específico
  deleteProductFromCart = async (id, productID) => {
    let carritoBuscado = await cartModel.findById(id);

    if (!carritoBuscado) {
      throw new BadRequestError("Carrito no encontrado");
    }

    const productIndex = carritoBuscado.cart.findIndex(
      (productItem) => productItem.product._id.toString() === productID
    );

    if (productIndex === -1) {
      throw new BadRequestError("el producto indicado no existe en el carrito");
    }
    carritoBuscado.cart.splice(productIndex, 1);

    return await carritoBuscado.save();
  };

  //borrar producto de un carrito específico
  deleteOneProduct = async (id, productID) => {
    let carritoBuscado = await cartModel.findById(id);

    if (!carritoBuscado) {
      throw new BadRequestError("Carrito no encontrado");
    }

    const productIndex = carritoBuscado.cart.findIndex(
      (productItem) => productItem.product._id.toString() === productID
    );

    if (productIndex === -1) {
      throw new BadRequestError("el producto indicado no existe en el carrito");
    }
    carritoBuscado.cart[productIndex].qty--;

    return await carritoBuscado.save();
  };
}

export default CartManager;
