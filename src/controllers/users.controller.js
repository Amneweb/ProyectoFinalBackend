import UserService from "../services/users.service.js";
import TicketsService from "../services/tickets.service.js";
import passport from "passport";

import { userLogger as logger } from "../config/logger.config.js";
import UsersDTO from "../services/dtos/users.dto.js";
export default class UsersController {
  #userService;
  #ticketsService;
  #usersDTO;
  constructor() {
    this.#userService = new UserService();
    this.#ticketsService = new TicketsService();
    this.#usersDTO = new UsersDTO();
  }

  getAll = async (req, res) => {
    try {
      const todos = await this.#userService.getAll();

      const todosMoldeados = todos.map((cadauno) =>
        this.#usersDTO.getUserInputFrom(cadauno)
      );
      logger.method("getAll");
      res.sendSuccess(todosMoldeados);
    } catch (e) {
      logger.error(
        "Error interno al tratar de mostrar los usuarios %s",
        e.message
      );
      res.sendInternalServerError(e.message);
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
    console.log("viene por la api");
    console.log(req.user);
    res.sendSuccess(req.user);
  };

  login = async (req, res) => {
    const { userEmail, userPassword } = req.body;
    try {
      const access_token = await this.#userService.login(
        userEmail,
        userPassword
      );
      console.log("access token");
      console.log(access_token);
      logger.debug(
        "El usuario que se quiere loguear tiene email: %s",
        userEmail
      );

      res
        .cookie("token_login", access_token, {
          maxAge: 600000,
          httpOnly: true,
          signed: true,
        })
        .send({
          message: "Login successful!",
          access_token: access_token,
          //id: user._id,
        });
    } catch (error) {
      logger.error("Mensaje interno: %s", error.message);
      return res.sendClientError(error.message);
    }
  };

  register = async (req, res) => {
    const { userName, userLastName, userEmail, userAge, userPassword } =
      req.validatedData;

    logger.debug("Email del usuario a crear %s", req.validatedData.userEmail);

    try {
      if (
        !userName ||
        !userLastName ||
        !userEmail ||
        !userAge ||
        !userPassword
      ) {
        throw new Error("Error de ingreso de datos", req.validatedData.error);
      }
      const registrado = await this.#userService.save({
        userName,
        userLastName,
        userEmail,
        userAge,
        userPassword,
      });
      logger.debug(
        "se ha creado el usuario con email %s",
        registrado.userEmail
      );
      res.sendSuccess(registrado);
    } catch (e) {
      logger.error("No se pudo crear el usuario %j", e.message);
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

  logout = async (req, res) => {
    const cookieToken = req.signedCookies["token_login"];
    console.log("hay cookie token ", cookieToken);
    if (cookieToken)
      try {
        await this.#userService.update(req.user, "userConnection", Date.now());
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
  recoverPassword = async (req, res) => {
    const token = req.params.tid;
    const cookie = req.signedCookies["email_recovery_expiration"];

    console.log("token ", token);
    console.log("cookie ", cookie);
    if (!cookie) {
      throw new Error("el tiempo ha expirado. Volvé a intentarlo");
    }
    try {
      const emailRecibido = await this.#userService.recovery(token, cookie);
      console.log("email recibido", emailRecibido);
      if (!emailRecibido.error)
        res.render("restablecer", {
          emailRecibido: emailRecibido,
          style: "admin.css",
        });
    } catch (e) {
      res.sendBadClientError(e.message);
    }
  };

  newpassword = async (req, res) => {
    const email = req.body.email;
    const pass = req.body.pass;
    const cookie = req.signedCookies["email_recovery_expiration"];

    try {
      if (!cookie) {
        throw new Error(
          "el tiempo ha expirado. Volvé a intentarlo a través de la página de recupero de contraseña"
        );
      }
      const modificado = await this.#userService.verify(email, pass);
      res.sendSuccess(
        "El password para el usuario con email " +
          modificado.userEmail +
          " se ha guardado con éxito, ya podés loguearte nuevamente"
      );
      logger.debug(
        "el password se ha guardado con éxito, ya podés loguearte nuevamente. %s",
        modificado.email
      );
    } catch (e) {
      logger.error("no se pudo guardar el password %s", e.message);
      res.sendClientError("no se ha podido guardar el password", e);
    }
  };
  updateCurrentUser = async (req, res) => {
    logger.method("Actualizar current user");
    const user = req.user;
    try {
      const datosActuales = await this.#userService.findByUsername(user.email);
      console.log("datos Acutales");
      console.log(datosActuales);
      const datosMoldeados = this.#usersDTO.getUserInputFrom(datosActuales);
      res.sendSuccess(datosMoldeados);
    } catch (e) {
      logger.error(
        "no pudo cargar la información del usuario. Error: %s",
        e.message
      );
      res.sendClientError(
        "No se ha podido cargar la información del usuario logueado. Mensaje de error:",
        e.message
      );
    }
  };
  changerole = async (req, res) => {
    logger.method("changerole");
    const uid = req.params.uid;
    const torole = req.body.torole;
    const user = req.user;
    try {
      const modificado = await this.#userService.changerole(uid, torole, user);
      const moldeado = this.#usersDTO.getUserInputFrom(modificado);
      res.sendSuccess(moldeado);
    } catch (e) {
      res.sendClientError(e.message);
    }
  };
  uploadDoc = async (req, res) => {
    const uid = req.params.uid;

    const user = req.user;
    const doc = req.file && `${req.destinationPath}/${req.file.filename}`;
    try {
      if (!doc) {
        return res.sendClientError("No se ha subido ningún archivo adjunto");
      }
      const docCode = req.body.docCode
        ? req.body.docCode
        : req.file.originalname;
      const result = await this.#userService.uploadDocs(
        uid,
        user,
        doc,
        docCode
      );
      const moldeado = this.#usersDTO.getUserInputFrom(result);
      logger.debug("El documento se cargó correctamente");
      res.sendSuccess(moldeado);
    } catch (e) {
      logger.error("No se pudo subir el documento: %s", e.message);
      res.sendClientError(
        `Error al tratar de subir el documento del usuario con email ${user.email}. Mensaje del sistema: "${e.message}"`
      );
    }
  };

  getSinActividad = async (req, res) => {
    const tiempolimite = parseInt(req.query.meses);
    console.log("tiempo limite", tiempolimite);
    logger.debug("tiempo limite en controlador %s", tiempolimite);
    try {
      const result = await this.#userService.getInactivos(tiempolimite);
      const moldeados = result.map((cadauno) =>
        this.#usersDTO.getUserInputFrom(cadauno)
      );
      logger.method("getSinActividad");
      res.sendSuccess(moldeados);
    } catch (e) {
      logger.error("Hubo un error interno: %s", e.message);
      res.sendInternalServerError(e.message);
    }
  };
}
