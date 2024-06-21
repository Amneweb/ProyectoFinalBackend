import CustomRouter from "./custom/custom.router.js";
import UsersController from "../controllers/users.controller.js";
import pc from "picocolors";
import { uploader, validateUserFormData, agregarRuta } from "../utils/utils.js";

export default class UsersRouter extends CustomRouter {
  init() {
    // Todas las req/res van dentro de este init()

    // Se instancia el service UserService
    const usersController = new UsersController();
    //TODO: volver a poner admin, lo cambié sólo para probar
    this.get("/", ["PUBLIC"], usersController.getAll);

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

    this.post("/login", ["PUBLIC"], usersController.login);

    this.post(
      "/register",
      ["PUBLIC"],
      validateUserFormData,
      usersController.register
    );

    this.get("/logout", ["USER", "ADMIN", "PREMIUM"], usersController.logout);

    this.put(
      "/cart/:cid",
      ["USER", "ADMIN", "PREMIUM"],
      usersController.addCart
    );

    this.get(
      "/email",
      ["USER", "ADMIN", "PREMIUM"],

      usersController.getByUsername
    );
    this.get(
      "/cart",
      ["USER", "PREMIUM"],

      usersController.getCart
    );
    this.get("/filtro/", ["USER", "PREMIUM"], usersController.getByUsername);
    this.get("/tickets", ["USER", "PREMIUM"], usersController.getTickets);

    this.delete("/:uid", ["ADMIN"], usersController.deleteUser);
    this.get("/recupero/:tid/", ["PUBLIC"], usersController.recoverPassword);
    this.post("/newpassword", ["PUBLIC"], usersController.newpassword);
    this.put("/premium/:uid", ["USER", "PREMIUM"], usersController.changerole);
    this.put(
      "/:uid/documents",
      ["USER", "PREMIUM"],
      agregarRuta,
      uploader.single("doc"),
      usersController.uploadDoc
    );
  }
}
