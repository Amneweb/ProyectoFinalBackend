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
      logger.debug(
        "El usuario que se quiere loguear tiene email: %s",
        userEmail
      );
      //TODO: el login me tiene que devolver el access token
      res
        .cookie("token_login", access_token, {
          maxAge: 600000,
          httpOnly: true,
        })
        .send({
          message: "Login successful!",
          access_token: access_token,
          //id: user._id,
        });
    } catch (error) {
      console.error(error);
      logger.error(
        "Ha habido un error interno al tratar de loguear al usuario con email %s",
        userEmail
      );
      return res.sendInternalServerError(error);
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
  recoverPassword = async (req, res) => {
    const token = req.params.tid;
    const cookie = req.cookies["email_recovery_expiration"];
    if (!cookie) {
      throw new Error("el tiempo ha expirado. Volvé a intentarlo");
    }
    try {
      const emailRecibido = await this.#userService.recovery(token, cookie);
      res.sendSuccess(
        `Token y cookie son iguales, ahora renderizo el formulario para cargar el password nuevo para el email ${emailRecibido}. En postman, ir a Ingreso nuevo password`
      );
    } catch (e) {
      res.sendBadClientError(e.message);
    }
  };

  newpassword = async (req, res) => {
    const email = req.body.email;
    const pass = req.body.pass;
    const cookie = req.cookies["email_recovery_expiration"];

    try {
      if (!cookie) {
        throw new Error(
          "el tiempo ha expirado. Volvé a intentarlo. Acá va el enlace a la página de recupero de contraseña"
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
      res.sendSuccess(datosActuales);
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
      res.sendSuccess(modificado);
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
      logger.debug("El documento se cargó correctamente");
      res.sendSuccess(result);
    } catch (e) {
      logger.error("No se pudo subir el documento: %s", e.message);
      res.sendClientError(
        `Error al tratar de subir el documento del usuario con email ${user.email}. Mensaje del sistema: "${e.message}"`
      );
    }
  };
}
