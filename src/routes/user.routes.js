import CustomRouter from "./custom/custom.router.js";
import UserService from "../services/daos/users/users.service.js";
import {
  createHash,
  isValidPassword,
  generateJWToken,
  authToken,
} from "../../utils.js";

export default class UsersRouter extends CustomRouter {
  init() {
    // Todas las req/res van dentro de este init()

    // Se instancia el service UserService
    const userService = new UserService();

    this.get("/", ["ADMIN"], async (req, res) => {
      const todos = await userService.getAll();
      res.send(todos);
    });

    this.get("/currentUser", ["USER", "PREMIUM", "ADMIN"], (req, res) => {
      res.sendSuccess(req.user);
    });

    this.get("/premiumUser", ["PREMIUM"], (req, res) => {
      res.sendSuccess(req.user);
    });

    this.get("/adminUser", ["ADMIN"], (req, res) => {
      res.sendSuccess(req.user);
    });

    this.post("/login", ["PUBLIC"], async (req, res) => {
      const { userEmail, userPassword } = req.body;
      try {
        const user = await userService.findByUsername(userEmail);
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
        res.send({
          message: "Login successful!",
          access_token: access_token,
          id: user._id,
        });
      } catch (error) {
        console.error(error);
        // return res.status(500).send({ status: "error", error: "Error interno de la applicacion." });

        return res.sendInternalServerError(error);
      }
    });

    this.post("/register", ["PUBLIC"], async (req, res) => {
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

      const exists = await userService.findByUsername(userEmail);
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
      const result = await userService.save(user);
      res.status(201).send({
        status: "success",
        message: "Usuario creado con éxito con ID: " + result.id,
      });
    });

    this.get("/logout", ["USER", "ADMIN", "PREMIUM"], (req, res) => {
      localStorage.clearItem("authToken");
      localStorage.clearItem("USER_ID");

      res.status(201).send({
        status: "success",
        message:
          "Te has deslogueado correctamente. Para volver a loguearte, hacé click en el botón de abajo",
      });
    });
  }

  /*this.get("/:userId", authToken, async (req, res) => {
      const userId = req.params.userId;
      try {
        const user = await userModel.findById(userId);
        if (!user) {
          res
            .status(202)
            .json({ message: "User not found with ID: " + userId });
        }
        res.json(user);
      } catch (error) {
        console.error("Error consultando el usuario con ID: " + userId);
      }
    });*/
}
