import UserService from "../services/users.service.js";
import CartService from "../services/carts.service.js";
import TicketsService from "../services/tickets.service.js";

//import { createLogger } from "winston";
import { userLogger as logger } from "../config/logger.config.js";

export default class UsersController {
  #userService;
  #cartService;
  #ticketsService;
  constructor() {
    this.#userService = new UserService();
    this.#cartService = new CartService();
    this.#ticketsService = new TicketsService();
  }

  getAll = async (req, res) => {
    try {
      const todos = await this.#userService.getAll();

      logger.method("getAll");
      res.sendSuccess(todos);
    } catch (e) {
      res.sendInternalServerError(e);
    }
  };

  getByUsername = async (req, res) => {
    console.log("dentro de getByUsername");

    try {
      const user = await this.#userService.findByUsername(req.user.email);
      console.log("user en getbyusername ", user);

      res.sendSuccess(user);
    } catch (error) {
      res.sendClientError(
        "Error consultando el usuario con email: " + req.user.email
      );
    }
  };

  getCart = async (req, res) => {
    const email = req.user.email;
    logger.method("getCart");
    try {
      const carrito = await this.#userService.findCart(email);

      res.sendSuccess(carrito);
    } catch (e) {
      res.sendClientError(e);
    }
  };
  addCart = async (req, res) => {
    const value = [req.params.cid];
    const email = req.user.email;
    const filter = "userCartID";

    try {
      const modificado = await this.#userService.update(email, filter, value);
      res.sendSuccess(modificado);
    } catch (e) {
      res.sendClientError(e);
    }
  };

  getCurrentUser = (req, res) => {
    console.log(req.user);
    res.sendSuccess(req.user);
  };

  getPremiumUser = (req, res) => {
    res.sendSuccess(req.user);
  };

  getAdminUser = (req, res) => {
    res.sendSuccess(req.user);
  };

  login = async (req, res) => {
    const { userEmail, userPassword } = req.body;
    try {
      const access_token = await this.#userService.login(
        userEmail,
        userPassword
      );
      //TODO: el login me tiene que devolver el access token
      res
        .cookie("token_login", access_token, {
          maxAge: 240000,
          httpOnly: true,
        })
        .send({
          message: "Login successful!",
          access_token: access_token,
          id: user._id,
        });
    } catch (error) {
      console.error(error);

      return res.sendInternalServerError(error);
    }
  };

  register = async (req, res) => {
    const {
      userName,
      userLastName,
      userEmail,
      userAge,
      userPassword,
      userRole,
    } = req.body;
    try {
      const registrado = this.#userService.save({
        userName,
        userLastName,
        userEmail,
        userAge,
        userPassword,
        userRole,
      });
      res.sendSuccess(registrado);
    } catch (e) {
      res.sendClientError(e);
    }
  };

  getTickets = async (req, res) => {
    try {
      const tickets = await this.#ticketsService.getTicketByUser(
        req.user.email
      );
      res.sendSuccess(tickets);
    } catch (e) {
      res.sendClientError(e);
    }
  };

  logout = (req, res) => {
    const cookieToken = req.cookies["token_login"];
    console.log("hay cookie token ", cookieToken);
    if (cookieToken)
      try {
        return res.clearCookie("token_login").status(201).sendSuccess({
          status: "success",
          message:
            "Te has deslogueado correctamente. Para volver a loguearte, hacé click en el botón de abajo",
        });
      } catch (e) {
        res.sendInternalServerError(e);
      }
  };
}
