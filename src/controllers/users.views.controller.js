import UserService from "../services/users.service.js";

import { userLogger as logger } from "../config/logger.config.js";

export default class UsersController {
  #userService;

  constructor() {
    this.#userService = new UserService();
  }

  getAll = async (req, res) => {
    try {
      const todos = await this.#userService.getAll();

      logger.method("getAll");
      res.render("profilesAdmin", {
        todos,
        style: "admin.css",
      });
    } catch (e) {
      res.render("errors", {
        message:
          "Error interno, no podemos traer los datos. Motivo:" + e.message,
      });
    }
  };

  getCart = async (req, res) => {
    const email = req.user.email;
    logger.method("getCart");
    logger.debug("Buscando carrito de usuario con email %s", email);
    try {
      const carrito = await this.#userService.findCart(email);
      req.render("usercart", { carrito, style: "carrito.css" });
    } catch (e) {
      logger.error("Error: %s", e.message);
      res.sendClientError("error en get cart", e);
    }
  };
  login = (req, res) => {
    res.render("login", { style: "admin.css" });
  };

  register = (req, res) => {
    res.render("register", { style: "admin.css" });
  };
  getCurrentUser = (req, res) => {
    console.log(req.user);
    const user = req.user;
    if (!user) {
      res.render("login", { style: "admin.css" });
    }
    res.render("profile", {
      user,
      style: "admin.css",
    });
  };
}
