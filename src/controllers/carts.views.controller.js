import CartManager from "../services/carts.service.js";

import { cartsLogger as logger } from "../config/logger.config.js";

export default class CartController {
  #cartManager;

  constructor() {
    this.#cartManager = new CartManager();
  }
  getOne = async (req, res) => {
    logger.method("getOne");
    const user = req.user;
    try {
      const result = await this.#cartManager.getCartByID(req.params.cid, user);

      res.render("usercart", {
        result,
        style: "catalogo.css",
      });
    } catch (e) {
      logger.error("error enviado al cliente: %s", e.message);
      res.sendClientError(e.message);
    }
  };
  getCarts = async (req, res) => {
    try {
      const result = await this.#cartManager.getCartsAndPopulate();

      res.render("usercartsAdmin", {
        carritosObtenidos: result,
        style: "admin.css",
      });
    } catch (e) {
      res.sendInternalServerError(e);
    }
  };
  localStorage = async (req, res) => {
    const logueado = req.user && req.user;
    res.render("localusercart", {
      logueado,
      style: "admin.css",
    });
  };
  compra = async (req, res) => {
    const logueado = req.user && req.user;
    res.render("compra", {
      logueado,
      style: "admin.css",
    });
  };
}
