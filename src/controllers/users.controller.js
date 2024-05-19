import UserService from "../services/daos/users/users.service.js";
import CartService from "../services/daos/carts/carts.service.js";
import TicketsService from "../services/daos/tickets/tickets.service.js";
import pc from "picocolors";
import { createHash, isValidPassword, generateJWToken } from "../../utils.js";
import { createLogger } from "winston";
import { settings } from "../config/logger.config.js";

const logger = createLogger(settings);
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
    const todos = await this.#userService.getAll();

    logger.method("getAll");
    res.send(todos);
  };

  getByUsername = async (req, res) => {
    console.log("dentro de getByUsername");

    console.log(req.user.email);
    const filtro = req.query.filtro && req.query.filtro;
    try {
      const user = await this.#userService.findByUsername(req.user.email);
      console.log("user en getbyusername ", user);
      if (!user) {
        res
          .status(202)
          .json({ message: "User not found with email: " + req.user.email });
      }
      const respuesta = filtro ? user[filtro] : user;
      res.json(respuesta);
    } catch (error) {
      console.error(
        "Error consultando el usuario con email: " + req.user.email
      );
    }
  };

  getCart = async (req, res) => {
    logger.method("getCart");
    try {
      await this.#userService.findByUsername(req.user.email).then((result) => {
        console.log("primer result ", result);
        if (!result) {
          logger.error("usuario con email %s no encontrado", req.user.email);
          return res.status(202).json({
            message: "User not found with email: " + req.user.email,
          });
        }

        try {
          console.log("result pra get cart by id ", result);
          this.#cartService
            .getCartByID(result.userCartID)
            .then((result) => res.json(result));
        } catch (e) {
          logger.error(
            "Carrito no encontrado para email %s at %s",
            req.user.email,
            new Date()
          );
          console.error("No se pudo obtener el carrito ");
        }
      });
    } catch (error) {
      console.error(
        "Error consultando el usuario con email: " + req.user.email
      );
    }
  };
  addCart = async (req, res) => {
    const value = [req.params.cid];

    //TODO: le saqué el middleware de la ruta. Hay que verificar qué pasa
    console.log(req.user);
    const user = await this.#userService.findByUsername(req.user.email);
    console.log("Usuario encontrado para login:");
    console.log(user);
    const userID = user._id;
    if (user.userCartID.length > 0) {
      const carritoAnterior = user.userCartID[0];
      console.log("carrito existente ", carritoAnterior);
      await this.#cartService.deleteFullCartByID({ _id: carritoAnterior });
    }

    console.log(pc.bgYellow("en controller, metodo addCart"));
    console.log(pc.yellow(value));
    console.log(pc.yellow(userID));

    const modificado = await this.#userService.update(
      userID,
      "userCartID",
      value
    );
    res.sendSuccess(modificado);
  };

  getCurrentUser = (req, res) => {
    console.log(pc.bgYellow("en get current user dentro del controlador "));

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
      const user = await this.#userService.findByUsername(userEmail);
      console.log("Usuario encontrado para login:");
      console.log(user);
      if (!user) {
        console.warn("User doesn't exists with username: " + userEmail);
        return res.status(202).send({
          error: "Not found",
          message: "Usuario no encontrado con username: " + userEmail,
        });
      }
      if (!isValidPassword(userPassword, user.userPassword)) {
        console.warn("Invalid credentials for user: " + userEmail);
        return res.status(401).send({
          status: "error",
          error: "El usuario y la contraseña no coinciden!",
        });
      }
      const tokenUser = {
        name: `${user.userName} ${user.userLastName}`,
        email: user.userEmail,
        age: user.userAge,
        role: user.userRole,
      };
      const access_token = generateJWToken(tokenUser); // Genera JWT Token que contiene la info del user
      console.log("token generado ", access_token);
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
      // return res.status(500).send({ status: "error", error: "Error interno de la applicacion." });

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
    console.log("Registrando usuario:");
    console.log(req.body);

    const exists = await this.#userService.findByUsername(userEmail);
    if (exists) {
      return res
        .status(400)
        .send({ status: "error", message: "Usuario ya existe." });
    }
    const user = {
      userName,
      userLastName,
      userEmail,
      userAge,
      userPassword: createHash(userPassword),
      userRole,
    };
    const result = await this.#userService.save(user);
    res.status(201).send({
      status: "success",
      message: "Usuario creado con éxito con ID: " + result._id,
    });
  };

  getTickets = async (req, res) => {
    const tickets = await this.#ticketsService.getTicketByUser(req.user.email);

    if (!tickets) {
      return res.status(500).send({
        status: "error",
        error: "No se pueden mostrar los tickets",
      });
    }
    res.status(201).send({ status: "success", payload: tickets });
  };

  logout = (req, res) => {
    const cookieToken = req.cookies["token_login"];
    console.log("hay cookie token ", cookieToken);
    if (cookieToken)
      return res.clearCookie("token_login").status(201).send({
        status: "success",
        message:
          "Te has deslogueado correctamente. Para volver a loguearte, hacé click en el botón de abajo",
      });
    res.status(501).redirect("errors", {
      status: "error",
      message: "Hubo un error interno",
    });
  };
}
