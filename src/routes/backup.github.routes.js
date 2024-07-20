import { Router } from "express";
import UserService from "../services/users.service.js";
import CartManager from "../services/carts.service.js";
import passport from "passport";
import { generateJWToken } from "../utils/utils.js";
const userService = new UserService();
const cartService = new CartManager();
const router = Router();
router.get(
  "/",
  passport.authenticate("github", { scope: ["user:userEmail"] }),
  async (req, res) => {}
);
router.get(
  "/githubcallback",
  passport.authenticate("github", {
    failureRedirect: "/login",
    session: false,
  }),

  async (req, res) => {
    const userEmail = req.user.userEmail;

    try {
      const user = await userService.findByUsername(userEmail);

      if (!user) {
        console.warn("User doesn't exists with username: " + userEmail);
        throw new Error("no hay un usuario registrado con email " + userEmail);
      }
      user["userConnection"] = Date.now() + 600000;
      await user.save();
      const arrayCarritos = user.userCartID;

      /*
        =========================================================================
        VERIFICO SI EL USUARIO TIENE ASOCIADO UN CARRITO INEXISTENTE Y LO BORRO
        =========================================================================
        */
      if (arrayCarritos.length > 0) {
        let inexistentes = [];

        const generarInexistentes = async function () {
          for (let i = 0; i < arrayCarritos.length; i++) {
            const existe = await cartService.getCartByID(
              arrayCarritos[i],
              user
            );
            if (existe === null) {
              inexistentes.push(arrayCarritos[i]);
            }
          }
          return inexistentes;
        };
        const nulos = await generarInexistentes();

        if (nulos.length > 0) {
          nulos.forEach((item) => {
            const IDinexistente = arrayCarritos.indexOf(item);

            arrayCarritos.splice(IDinexistente, 1);
          });
          user["userCartID"] = arrayCarritos;

          await user.save();
        }
      }
      const tokenUser = {
        name: `${user.userName} ${user.userLastName}`,
        email: user.userEmail,
        age: user.userAge,
        role: user.userRole,
      };
      const access_token = generateJWToken(tokenUser); // Genera JWT Token que contiene la info del user

      res
        .cookie("token_login", access_token, {
          maxAge: 600000,
          httpOnly: true,
          signed: true,
        })
        .redirect("/users/currentUser");
    } catch (error) {
      return res.send(`Error de autenticación con github ${error.message}`);
    }
  }
);

export default router;
