import CustomRouter from "./custom/custom.router.js";
import UsersViewsController from "../controllers/users.views.controller.js";
import pc from "picocolors";
import { uploader, validateUserFormData, agregarRuta } from "../utils/utils.js";

export default class UsersViewsRouter extends CustomRouter {
  init() {
    // Todas las req/res van dentro de este init()

    // Se instancia el service UserService
    const usersController = new UsersViewsController();

    this.get("/", ["ADMIN"], usersController.getAll);

    this.get(
      "/currentUser",
      ["USER", "PREMIUM", "ADMIN"],
      usersController.getCurrentUser
    );
    this.get(
      "/updateCurrentUser",
      ["USER", "PREMIUM", "ADMIN"],
      usersController.updateCurrentUser
    );

    this.get("/premiumUser", ["PREMIUM"], usersController.getPremiumUser);

    this.get("/adminUser", ["ADMIN"], usersController.getAdminUser);

    this.get("/login", ["PUBLIC"], usersController.login);

    this.get("/register", ["PUBLIC"], usersController.register);

    this.get("/logout", ["USER", "ADMIN", "PREMIUM"], usersController.logout);

    this.get(
      "/cart",
      ["USER", "PREMIUM"],

      usersController.getCart
    );

    this.get("/tickets", ["USER", "PREMIUM"], usersController.getTickets);
  }
}
