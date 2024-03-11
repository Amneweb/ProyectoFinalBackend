import { cartModel } from "./models/carts.model.js";

import productModel from "./models/products.model.js";

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
    const carritos = await cartModel.find();
    return carritos.map((cart) => cart.toObject());
  };
  //obtener carrito con id determinado
  getCartByID = async (id) => {
    const carrito = await cartModel.findOne({ _id: id });
    const result = carrito
      ? carrito
      : { success: false, message: "no se encontró ningún carrito con ese id" };
    return result;
  };
  //agregar producto a un carrito específico
  addProductToCartID = async (id, productID) => {
    let carritoBuscado = await cartModel.findById(id);
    await productModel.findById(productID); //para verificar que exista un producto con ese id

    if (carritoBuscado) {
      const existe = carritoBuscado.cart.find(
        (cadaProducto) => cadaProducto.product === productID
      );

      let update;
      let filter;
      if (existe) {
        const newQty = existe.qty + 1;

        const ubicacion = carritoBuscado.cart.indexOf(existe);

        carritoBuscado.cart.splice(ubicacion, 1);

        carritoBuscado.cart.push({ product: productID, qty: newQty });
        update = { $set: { cart: carritoBuscado.cart } };
      } else {
        update = {
          $push: {
            cart: { product: productID, qty: 1 },
          },
        };
      }
      filter = { _id: { $eq: id } };
      carritoBuscado = await cartModel.findOneAndUpdate(filter, update, {
        new: true,
      });
    }
    return carritoBuscado;
  };

  //borrar carrito
  deleteFullCartByID = async (id) => {
    const result = await cartModel.deleteOne({ _id: id });
    return result;
  };
}

export default CartManager;
