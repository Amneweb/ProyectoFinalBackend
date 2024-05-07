import { cartModel } from "./carts.model.js";

import productModel from "../products/products.model.js";

class CartManager {
  //carrito vacío
  addCart = async () => {
    let newCarrito = {
      products: [],
    };

    const carrito = await cartModel.create(newCarrito);
    return carrito;
  };
  //obtener carritos
  getCarts = async () => {
    const carritos = await cartModel.find().lean();

    return carritos;
  };
  //obtener carrito con id determinado
  getCartByID = async (id) => {
    "dentro de get cart by id";
    const carrito = await cartModel.findOne({ _id: id }).lean();
    const result = carrito
      ? { success: true, data: { ...carrito } }
      : { success: false, message: "no se encontró ningún carrito con ese id" };
    return result;
  };
  updateCart = async (id, carritoRemanente) => {
    const carrito = await cartModel.updateOne(
      { _id: id },
      { $set: { cart: carritoRemanente } }
    );
    const result = carrito
      ? { success: true, data: { ...carrito } }
      : { success: false, message: "no se encontró ningún carrito con ese id" };
    return result;
  };
  //agregar producto a un carrito específico
  addProductToCartID = async (id, productID) => {
    let carritoBuscado = await cartModel.findById(id);
    if (!carritoBuscado) {
      throw new Error("Carrito no encontrado");
    }
    const producto = await productModel.findById(productID); //para verificar que exista un producto con ese id
    if (!producto) {
      throw new Error("producto no encontrado");
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
    const result = await cartModel.deleteOne({ _id: id });
    return result;
  };

  //borrar producto de un carrito específico
  deleteProductFromCart = async (id, productID) => {
    let carritoBuscado = await cartModel.findById(id);

    if (!carritoBuscado) {
      throw new Error("Carrito no encontrado");
    }

    const productIndex = carritoBuscado.cart.findIndex(
      (productItem) => productItem.product._id.toString() === productID
    );

    if (productIndex === -1) {
      throw new Error("el producto indicado no existe en el carrito");
    } else {
      carritoBuscado.cart.splice(productIndex, 1);
    }

    await carritoBuscado.save();

    return carritoBuscado;
  };
}

export default CartManager;
