import UserService from "../services/users.service.js";
import CartService from "../services/carts.service.js";
import TicketsService from "../services/tickets.service.js";
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
    try {
      const user = await this.#userService.findByUsername(req.user.email);

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
    logger.debug("Buscando carrito de usuario con email %s", email);
    try {
      const carrito = await this.#userService.findCart(email);

      res.sendSuccess(carrito);
    } catch (e) {
      logger.error("Error: %s", e.message);
      res.sendClientError("error en get cart", e);
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
          //id: user._id,
        });
    } catch (error) {
      console.error(error);

      return res.sendInternalServerError(error);
    }
  };

  register = async (req, res) => {
    const { userName, userLastName, userEmail, userAge, userPassword } =
      req.validatedData;
    logger.debug(
      "Datos que llegan luego de la validación del formulario de login %j",
      req.validatedData
    );

    try {
      const registrado = await this.#userService.save({
        userName,
        userLastName,
        userEmail,
        userAge,
        userPassword,
      });
      logger.debug("se ha creado el usuario %j", registrado);
      res.sendSuccess(registrado);
    } catch (e) {
      logger.error("No se pudo crear el usuario %s", e.message);
      res.sendClientError(e.message);
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

  deleteUser = async (req, res) => {
    const id = req.params.uid;
    try {
      await this.#userService.deleteUser(id);

      logger.debug(`El usuario con id ${id} fue borrado con éxito`);
      res.sendSuccess("El usuario se ha borrado con éxito");
    } catch (error) {
      logger.error(
        "No se pudo borrar el usuario. Mensaje interno: %s",
        error.message
      );
      res.sendClientError(
        `No se pudo borrar el usuario con id %s. Mensaje interno: %s`,
        id,
        error.message
      );
    }
  };
}
