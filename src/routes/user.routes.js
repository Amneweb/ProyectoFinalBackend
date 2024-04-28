import CustomRouter from "./custom/custom.router.js";
import UsersController from "../controllers/users.controller.js";

export default class UsersRouter extends CustomRouter {
  init() {
    // Todas las req/res van dentro de este init()

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
