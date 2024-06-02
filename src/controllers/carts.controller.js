import CartManager from "../services/carts.service.js";

import UserManager from "../services/users.service.js";
import { cartsLogger as logger } from "../config/logger.config.js";
import { BadRequestError, InternalServerError } from "../utils/errors.js";

import { sendEmail } from "../utils/utils.js";
import pc from "picocolors";
export default class CartController {
  #cartManager;
  #userManager;
  constructor() {
    this.#cartManager = new CartManager();
    this.#userManager = new UserManager();
  }
  getOne = async (req, res) => {
    logger.method("getOne");
    try {
      const result = await this.#cartManager.getCartByID(req.params.cid);
      if (!result) {
        logger.error("El carrito con id %s no existe", req.params.cid);
        throw new BadRequestError("El carrito no existe");
      }
      res.sendSuccess(result);
    } catch (e) {
      logger.error("error enviado al cliente: %s", e.message);
      res.sendClientError(e);
    }
  };
  getCarts = async (req, res) => {
    req.logger.path(
      `Probando getCarts en req logger ${(req.method, req.path)}`
    );
    logger.debug("en getCarts de controlador");

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
    const cid = req.params.cid;
    const pid = req.params.pid;
    logger.debug(
      "Dentro del controlador de carritos. Id producto: %s; Id carrito: %s",
      pid,
      cid
    );
    try {
      const carritoModificado = await this.#cartManager.addProductToCartID(
        cid,
        pid
      );
      logger.debug(
        "carrito modificado luego de agregado el producto: %j",
        carritoModificado
      );
      res.sendSuccess(carritoModificado);
    } catch (e) {
      logger.error("error en addToCart de controlador %s", e.message);
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
      logger.error("error en deleteCart de controlador %s", e.message);
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
    const email = req.user.email;
    const cid = req.params.cid;
    console.log("req completo ", req.params);
    console.log("en controller purchase");
    console.log(pc.bgGreen("req user " + req.user.email));
    console.log(pc.bgYellow("req id" + req.params.cid));
    try {
      const ticket = await this.#cartManager.purchase(email, cid);
      const emailMethod = sendEmail(ticket);
      res.sendSuccess(ticket);
    } catch (e) {
      logger.error("Error dentro de purchase en controller %s", e.message);
      res.sendClientError(e);
    }
  };
}
