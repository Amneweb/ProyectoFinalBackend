import UserService from "../services/daos/users/users.service.js";
import CartService from "../services/daos/carts/carts.service.js";
import { environmentConfig } from "../config/environment.config.js";
import pc from "picocolors";
import { createHash, isValidPassword, generateJWToken } from "../../utils.js";

export default class UsersController {
  #userService;
  #cartService;
  constructor() {
    this.#userService = new UserService();
    this.#cartService = new CartService();
  }

  getAll = async (req, res) => {
    const todos = await this.#userService.getAll();
    res.send(todos);
  };

  getByUsername = async (req, res) => {
    console.log("dentro de getByUsername");
    console.log(req.user.email);
    try {
      const user = await this.#userService.findByUsername(req.user.email);
      console.log("user en getbyusername ", user);
      if (!user) {
        res
          .status(202)
          .json({ message: "User not found with email: " + req.user.email });
      }
      res.json(user);
    } catch (error) {
      console.error(
        "Error consultando el usuario con email: " + req.user.email
      );
    }
  };

  addCart = async (req, res) => {
    const value = req.params.cid;
    console.log("usuario en el req despues del middleware authToken");
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
        .cookie("windwardCookie", access_token, {
          maxAge: 120000,
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

  logout = (req, res) => {
    const cookieToken = req.cookies["windwardCookie"];
    console.log("hay cookie token ", cookieToken);
    if (cookieToken)
      return res.clearCookie("windwardCookie").status(201).send({
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
