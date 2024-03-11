import { cartModel } from "./models/carts.model.js";
import pc from "picocolors";
import productModel from "./models/products.model.js";

class CartManager {
  //carrito vacío
  addCart = async () => {
    let newCarrito = {
      products: [],
    };

    await cartModel.create(newCarrito);
    return newCarrito;
  };
  //obtener carritos
  getCarts = async () => {
    const carritos = await cartModel.find();
    return carritos.map((cart) => cart.toObject());
  };
  //obtener carrito con id determinado
  getCartByID = async (id) => {
    const carrito = await cartModel.findOne({ _id: id });
    return carrito;
  };
  //agregar producto a un carrito específico
  addProductToCartID = async (id, productID) => {
    let carritoBuscado = await cartModel.findById(id);
    await productModel.findById(productID); //para verificar que exista un producto con ese id

    if (carritoBuscado) {
      const existe = carritoBuscado.cart.find(
        (cadaProducto) => cadaProducto.product === productID
      );
      console.log(pc.bgYellow("existe el producto??"));
      existe ? console.log("si") : console.log("no");
      let update;
      let filter;
      if (existe) {
        //const idProductoEncontrado = existe._id.toString();
        const newQty = existe.qty + 1;
        console.log("new qty ", newQty);
        const ubicacion = carritoBuscado.cart.indexOf(existe);
        console.log(pc.blue("ubicacion del producto a borrrar"));
        carritoBuscado.cart.splice(ubicacion, 1);
        console.log(pc.bgRed("carrito ya sin producto a modificar"));
        console.log(carritoBuscado);
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
      //carritoBuscado = await cartModel.findOneAndUpdate(filter, update, {
      // new: true,
      // });
      //carritoBuscado = await cartModel.findOne(filter);
      console.log(carritoBuscado);
    }
  };

  //borrar carrito
  deleteFullCartByID = async (id) => {
    const result = await cartModel.deleteOne({ _id: id });
    return result;
  };
}

export default CartManager;
