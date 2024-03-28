import passport from "passport";
import local from "passport-local";
import userModel from "../services/db/models/users.model.js";
import { createHash, isValidPassword } from "../../utils.js";

//Declaramos nuestra estrategia:
const LocalStrategy = local.Strategy;

const initializePassport = () => {
  /*========================
ESTRATEGIA LOCAL
=========================*/

  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "userEmail",
        passwordField: "userPassword",
      },
      async (req, userEmail, userPassword, done) => {
        const { userName, userLastName, userAge } = req.body;
        try {
          const exists = await userModel.findOne({ userEmail });
          if (exists) {
            console.log("El usuario ya existe!!");
            return done(null, false);
          }

          //  Si el user no existe en la DB
          const user = {
            userName,
            userLastName,
            userEmail,
            userAge,
            userPassword: createHash(userPassword),
          };

          const result = await userModel.create(user);

          // TODO OK
          return done(null, result);
        } catch (error) {
          return done("Error registrando el usuario: " + error);
        }
      }
    )
  );

  // Estrategia de login
  passport.use(
    "login",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "userEmail",
        passwordField: "userPassword",
      },
      async (req, userEmail, userPassword, done) => {
        try {
          const user = await userModel.findOne({ userEmail: userEmail });
          console.log("Usuario encontrado para login:");
          console.log(user);

          if (!user) {
            console.warn(
              "No hay un usuario con esa dirección de correo: " + userEmail
            );
            return done(null, false);
          }

          // Validamos usando Bycrypt credenciales del usuario
          //user.userPassword es el password hasheado que viene de la bdd
          //userPassword es el que viene desde el formulario de login
          if (!isValidPassword(userPassword, user.userPassword)) {
            console.warn("Una de las credenciales es inválida: " + userEmail);
            return done(null, false);
          }
          // req.session.user = {
          //     name: `${user.first_name} ${user.last_name}`,
          //     email: user.email,
          //     age: user.age
          // }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //Funciones de Serializacion y Desserializacion
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      let user = await userModel.findById(id);
      done(null, user);
    } catch (error) {
      console.error("Error deserializando el usuario: " + error);
    }
  });
};

export default initializePassport;
