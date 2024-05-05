import CustomRouter from "./custom/custom.router.js";
import UsersController from "../controllers/users.controller.js";
import { authToken } from "../../utils.js";
import pc from "picocolors";

export default class UsersRouter extends CustomRouter {
  init() {
    // Todas las req/res van dentro de este init()
    console.log(pc.bgBlue("USUARIOS"));
    // Se instancia el service UserService
    const usersController = new UsersController();

    this.get("/", ["ADMIN"], usersController.getAll);

    this.get(
      "/currentUser",
      ["USER", "PREMIUM", "ADMIN"],
      usersController.getCurrentUser
    );

    this.get("/premiumUser", ["PREMIUM"], usersController.getPremiumUser);

    this.get("/adminUser", ["ADMIN"], usersController.getAdminUser);

    this.post("/login", ["PUBLIC"], usersController.login);

    this.post("/register", ["PUBLIC"], usersController.register);

    this.get("/logout", ["USER", "ADMIN", "PREMIUM"], usersController.logout);

    this.put(
      "/cart/:cid",
      ["USER", "ADMIN", "PREMIUM"],
      authToken,
      usersController.addCart
    );

    this.get(
      "/email",
      ["USER", "ADMIN", "PREMIUM"],
      authToken,
      usersController.getByUsername
    );
  }
}
