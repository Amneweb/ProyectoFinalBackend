import ProductManager from "../services/products.service.js";
import CartManager from "../services/carts.service.js";
import TicketManager from "../services/tickets.service.js";
import UserManager from "../services/users.service.js";
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
    this.#cartManager = new CartManager();
    this.#productManager = new ProductManager();
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
    const user = req.user.email;
    const cartID = req.params.cid;
    console.log("req completo ", req.params);
    console.log("en controller purchase");
    console.log(pc.bgGreen("req user " + req.user.email));
    console.log(pc.bgYellow("req id" + req.params.cid));
    try {
      const ticket = await this.#cartManager.purchase(user, cartID);
      const email = sendEmail(ticket);
      res.sendSuccess(ticket);
    } catch (e) {
      res.sendClientError(e);
    }
  };
}
