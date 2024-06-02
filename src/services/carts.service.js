import { cartDAO, productDAO } from "../utils/factory.js";
import TicketDAO from "./daos/mongo/tickets/tickets.mongo.dao.js";
import { BadRequestError } from "../utils/errors.js";
import { v4 as uuidv4 } from "uuid";
import { validateId } from "../utils/product.validator.js";
import { cartsLogger as logger } from "../config/logger.config.js";
import UserDAO from "./daos/mongo/users/users.mongo.dao.js";
import pc from "picocolors";
class CartManager {
  constructor() {
    this.ticketDAO = new TicketDAO();
    this.userDAO = new UserDAO();
  }

  //carrito vacío
  addCart = async () => {
    let newCarrito = {
      products: [],
    };
    return await cartDAO.create(newCarrito);
  };
  //obtener carritos
  getCarts = async () => {
    return await cartDAO.findAll();
  };
  //obtener carrito con id determinado
  getCartByID = async (id) => {
    if (!validateId(id)) {
      throw new BadRequestError(`El id ${id} no corresponde a un id válido`);
    }
    return await cartDAO.findByID(id);
  };
  updateCart = async (id, nuevoCarrito) => {
    if (!validateId(id)) {
      throw new BadRequestError(`El id ${id} no corresponde a un id válido`);
    }
    const existe = await cartDAO.findById(id);
    if (!existe) {
      throw new BadRequestError(`No existe ningún carrito con el id ${id}`);
    }
    return await cartDAO.update(id, nuevoCarrito);
  };

  //agregar producto a un carrito específico
  addProductToCartID = async (cid, pid) => {
    logger.debug(
      "En carts service | Id de carrito: %s, Id de producto: %s",
      cid,
      pid
    );

    if (!validateId(cid)) {
      console.log("error de validacion de id de carrito");
      throw new BadRequestError(
        `El id ${pid} del carrito buscado no corresponde a un id válido`
      );
    }
    if (!validateId(pid)) {
      console.log("error de validacion de id de producto");
      throw new BadRequestError(
        `El id ${pid} del producto buscado no es válido`
      );
    }
    console.log("en add product to cart");

    let carritoBuscado = await cartDAO.findByID(cid);
    console.log("carrito buscado luego de cart dao ", carritoBuscado);
    if (!carritoBuscado) {
      throw new BadRequestError(`No se encontró ningún carrito con id ${cid}`);
    }
    const producto = await productDAO.findByID(pid);

    //para verificar que exista un producto con ese id
    if (!producto) {
      console.log("adentro de if producto ");
      throw new BadRequestError(`No existe ningún producto con id ${pid}`);
    }
    console.log("pid directo del req", pid);
    /*let i = -1;
    if (carritoBuscado.length>0) {
      for (i = 0; i < carritoBuscado.cart.length; i++) {
        if (carritoBuscado.cart[i].product.toString() === pid) {
          console.log("yes");
          return i;
        }
      }
    }
    */

    const productIndex = carritoBuscado.cart.indexOf((productItem) => {
      console.log(productItem.product);
      console.log(productItem.product.toString());
      console.log(productItem.product.toString() === pid);
      productItem.product.toString() === pid;
    });

    console.log("product index", productIndex);
    if (productIndex === -1) {
      carritoBuscado.cart.push({ product: pid, qty: 1 });
    } else {
      carritoBuscado.cart[productIndex].qty++;
    }
    logger.debug(
      "carrito buscado luego de la transformacion %j",
      carritoBuscado
    );

    return await cartDAO.update(cid, carritoBuscado.cart);
  };

  //borrar carrito
  deleteFullCartByID = async (id) => {
    if (!validateId(id)) {
      throw new BadRequestError(
        `El id ${id} del carrito buscado no corresponde a un id válido`
      );
    }
    const carritoBuscado = await cartDAO.findByID(id);
    if (!carritoBuscado) {
      throw new BadRequestError("El carrito buscado no existe");
    }
    return await cartDAO.delete(id);
  };

  //borrar producto de un carrito específico (cualquiera sea la cantidad)
  deleteProductFromCart = async (id, productID) => {
    if (!validateId(id)) {
      throw new BadRequestError(
        `El id ${id} del carrito buscado no corresponde a un id válido`
      );
    }
    if (!validateId(productID)) {
      throw new BadRequestError(
        `El id ${productID} del producto buscado no es válido`
      );
    }
    let carritoBuscado = await cartDAO.findById(id);

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

    return await cartDAO.update(id, carritoBuscado);
  };

  //borrar producto de un carrito específico (uno por uno)
  deleteOneProduct = async (id, productID) => {
    if (!validateId(id)) {
      throw new BadRequestError(
        `El id ${id} del carrito buscado no corresponde a un id válido`
      );
    }
    if (!validateId(productID)) {
      throw new BadRequestError(
        `El id ${productID} del producto buscado no es válido`
      );
    }
    let carritoBuscado = await cartDAO.findById(id);

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

    return await cartDAO.update(id, carritoBuscado);
  };

  purchase = async (email, cid) => {
    const carritoComprado = await cartDAO.findAndPopulate(cid);
    logger.debug("carrito comprado luego del populate %j", carritoComprado);
    if (!carritoComprado) {
      logger.error("no se encontró el carrito comprado");
      throw new BadRequestError("No se encontró el carrito");
    }
    let carritoRemanente = [];

    //verificamos stock, creamos el array "order" y calculamos el total
    let order = [];
    let amount = 0;

    console.log("carrito comprado ", carritoComprado.cart);

    carritoComprado.cart.forEach((producto) => {
      const stock = producto.product.stock;
      const precio = producto.product.price;
      const compra = producto.qty;
      if (stock < compra) {
        carritoRemanente.push({
          product: producto._id,
          qty: compra - stock,
        });
        order.push({ product: producto._id, qty: stock });
        amount += stock * precio;
      } else {
        order.push({ product: producto._id, qty: compra });
        amount += precio * compra;
      }
    });

    if (carritoRemanente.length > 0) {
      const carritoActualizado = await cartDAO.updateCart(
        cid,
        carritoRemanente
      );
    } else {
      console.log("lo que mando al user manager", email);
      //const filter = "userCartID";
      //const value = [];
      await this.userDAO.update(email);
      await cartDAO.delete(cid);
    }

    const ticket = {
      order: order,
      amount: amount,
      purchaser: email,
      code: uuidv4(),
    };

    console.log(pc.bgRed("ticket a enviar"));

    const ticketCreado = await this.ticketDAO.create(ticket);
    return ticketCreado;
  };
}

export default CartManager;
