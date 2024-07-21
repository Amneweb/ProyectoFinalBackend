import UserService from "../services/users.service.js";
import TicketManager from "../services/tickets.service.js";
import { userLogger as logger } from "../config/logger.config.js";

export default class UsersController {
  #userService;
  #ticketService;

  constructor() {
    this.#userService = new UserService();
    this.#ticketService = new TicketManager();
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
      res.render("usercart", { carrito, style: "carrito.css" });
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
    const user = req.user;
    const cookieCompra = req.signedCookies["WWcompraIniciada"];

    res.render("profile", {
      user,
      cookieCompra,
      style: "admin.css",
    });
  };
  getTickets = async (req, res) => {
    const ticket = req.query.ticket_code;
    const cookieCompra = req.signedCookies["WWcompraIniciada"];
    try {
      const compras = await this.#ticketService.getTicketByCode(ticket);
      const compra = compras[0];

      res.render("pagos", {
        amount: compra.amount,
        purchaser: compra.purchaser,
        code: compra.code,

        cookieCompra,
        style: "admin.css",
      });
    } catch (e) {
      logger.error("Error: %s", e.message);
      res.sendClientError("error al buscar el ticket de compra", e.message);
    }
  };
}
