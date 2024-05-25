import { cartsService } from "../services/factory.js";
import { productsService } from "../services/factory.js";
import TicketManager from "../services/daos/tickets/tickets.service.js";
import UserManager from "../services/daos/users/users.service.js";
import {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  InternalServerError,
} from "../utils/errors.js";

import { sendEmail } from "../utils/utils.js";
import pc from "picocolors";
import { v4 as uuidv4 } from "uuid";
export default class CartController {
  #cartManager;
  #productManager;
  #ticketManager;
  #userManager;
  constructor() {
    this.#cartManager = cartsService;
    this.#productManager = productsService;
    this.#ticketManager = new TicketManager();
    this.#userManager = new UserManager();
  }
  getOne = async (req, res) => {
    try {
      const result = await this.#cartManager.getCartByID(req.params.cid);
      if (!result) {
        throw new BadRequestError("El carrito no existe");
      }
      res.sendSuccess(result);
    } catch (e) {
      res.sendClientError(e);
    }
  };
  getCarts = async (req, res) => {
    try {
      const result = await this.#cartManager.getCarts();
      res.sendSuccess(result);
    } catch (e) {
      res.sendInternalServerError(e);
    }
  };

  postOne = async (req, res) => {
    try {
      const carritoVacio = await this.#cartManager.addCart();
      if (!carritoVacio) {
        throw new InternalServerError("No se pudo crear el carrito");
      }
      const filter = "userCartID";
      const usuarioModificado = await this.#userManager.update(
        req.user,
        filter,
        carritoVacio._id
      );
      res.sendSuccess(usuarioModificado);
    } catch (e) {
      res.sendNotFoundError(e);
    }
  };

  addToCart = async (req, res) => {
    const cartID = req.params.cid;
    const prodID = req.params.pid;

    try {
      const carritoModificado = await this.#cartManager.addProductToCartID(
        cartID,
        prodID
      );
      res.sendSuccess(carritoModificado);
    } catch (e) {
      res.sendClientError(e);
    }
  };
  deleteCart = async (req, res) => {
    try {
      const carritoBorrado = await this.#cartManager.deleteFullCartByID(
        req.params.id
      );
      return res.sendSuccess(carritoBorrado);
    } catch (e) {
      return res.sendClientError(e);
    }
  };
  deleteProduct = async (req, res) => {
    const cartID = req.params.cid;
    const prodID = req.params.pid;
    const one = parseInt(req.query.qty) === 1 ? true : false;
    try {
      const carritoModificado = one
        ? await this.#cartManager.deleteOneProduct(cartID, prodID)
        : await this.#cartManager.deleteProductFromCart(cartID, prodID);
      res.sendSuccess(carritoModificado);
    } catch (e) {
      res.sendClientError(e.message);
    }
  };
  purchase = async (req, res) => {
    const user = req.user;
    console.log("req completo ", req.params);
    console.log("en controller purchase");
    console.log(pc.bgGreen("req user " + req.user.email));
    console.log(pc.bgYellow("req id" + req.params.cid));
    try {
      await this.#cartManager
        .getCartByID(req.params.cid)
        .then(async (result) => {
          console.log(pc.bgGreen("carrito encontrado" + result));
          if (!result.success) {
            return res.send({ message: "no se encontró el carrito" });
          }

          let carritoRemanente = [];

          //verificamos stock, creamos el array "order" y calculamos el total
          let order = [];
          let amount = 0;
          console.log("carrito.data.cart");
          console.log(result.data.cart);

          await Promise.all(
            result.data.cart.map(async (producto) => {
              await this.#productManager
                .getProductByID(producto.product._id)
                .then((info) => {
                  const stock = info.stock;
                  const precio = info.price;
                  const compra = producto.qty;
                  console.log(
                    "dentro de map " + stock + " " + precio + " " + compra
                  );
                  if (stock < compra) {
                    carritoRemanente.push({
                      product: producto.product._id,
                      qty: compra - stock,
                    });
                    order.push({ product: producto.product._id, qty: stock });
                    amount += stock * precio;
                  } else {
                    order.push({ product: producto.product._id, qty: compra });
                    amount += precio * compra;
                  }
                });
            })
          )
            .then(async () => {
              let promise1;
              let promise2;
              if (carritoRemanente.length > 0) {
                promise1 = await this.#cartManager.updateCart(
                  req.params.cid,
                  carritoRemanente
                );
                promise2 = "";
              } else {
                console.log("lo que mando al user manager", user);
                const filter = "userCartID";
                const value = [];
                promise1 = this.#userManager.update(user, filter, value);
                promise2 = this.#cartManager.deleteFullCartByID(req.params.cid);
              }
              await Promise.all([promise1, promise2]);
            })
            .then(async () => {
              const ticket = {
                order: order,
                amount: amount,
                purchaser: user.email,
                code: uuidv4(),
              };

              console.log(pc.bgRed("ticket a enviar"));

              await this.#ticketManager
                .createTicket(ticket)
                .then(async (result) => {
                  sendEmail(result);
                  res.status(201).send({ status: "success", payload: result });
                });
            });
        });
    } catch (e) {
      res.send(e.message);
    }
  };
}
