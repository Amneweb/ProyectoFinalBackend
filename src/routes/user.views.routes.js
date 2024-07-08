import CustomRouter from "./custom/custom.router.js";
import UsersViewsController from "../controllers/users.views.controller.js";

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

    this.get("/login", ["PUBLIC"], usersController.login);

    this.get("/register", ["PUBLIC"], usersController.register);

    this.get(
      "/cart",
      ["USER", "PREMIUM"],

      usersController.getCart
    );

    this.get("/tickets", ["USER", "PREMIUM"], usersController.getTickets);
  }
}
