import passport from "passport";
import local from "passport-local";
import jwtStrategy from "passport-jwt";
import githubStrategy from "passport-github2";
import { environmentConfig } from "./environment.config.js";
import userModel from "../services/daos/mongo/users/users.model.js";
import { createHash, isValidPassword } from "../utils/utils.js";
const JwtStrategy = jwtStrategy.Strategy;
const ExtractJWT = jwtStrategy.ExtractJwt;

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  /*==================================
  ESTRATEGIA GITHUB
  ==================================*/
  //TODO: ver si funciona estrategia de github como opcional
  passport.use(
    "github",
    new githubStrategy(
      {
        clientID: environmentConfig.SERVER.GITHUB.CLIENT_ID,
        clientSecret: environmentConfig.SERVER.GITHUB.CLIENT_SECRET,
        scope: ["user:email"],
        callbackUrl: environmentConfig.SERVER.GITHUB.CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("Profile obtenido del usuario:");
        console.log(profile);
        try {
          const user = await userModel.findOne({
            userEmail: profile.emails[0].value,
          });

          if (!user) {
            console.warn(
              "No hay un usuario con la dirección de correo: " +
                profile.emails[0].value
            );
            let newUser = {
              userName: profile._json.name,
              userLastName: "",
              userAge: 25,
              userEmail: profile.emails[0].value,
              userPassword: "",
              userLoggedBy: "GitHub",
            };
            const result = await userModel.create(newUser);
            return done(null, result);
          } else {
            console.log("Usuario encontrado para login:");
            console.log(user);
            return done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  //FIXME: la estrategia local se puede borrar
  /*========================
  ESTRATEGIA LOCAL
  =========================*/
  // REGISTRO----------------
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

  // LOGIN ---------------------
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

          //user.userPassword es el password hasheado que viene de la bdd
          //userPassword es el que viene desde el formulario de login
          if (!isValidPassword(userPassword, user.userPassword)) {
            console.warn("Una de las credenciales es inválida: " + userEmail);
            return done(null, false);
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  //FIXME: verificar si la estoy usando y dónde.... 🤦‍♀️
  /*=============================
ESTRATEGIA JWT
==============================*/
  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([
          cookieExtractor,
          //  ExtractJWT.fromAuthHeaderAsBearerToken(),
        ]),
        secretOrKey: environmentConfig.SERVER.JWT.SECRET,
      },
      async (jwt_payload, done) => {
        try {
          console.log("JWT obtenido del payload");
          console.log(jwt_payload);
          return done(null, jwt_payload.user);
        } catch (error) {
          console.error(error);
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
export const cookieExtractor = (req) => {
  let token = null;

  if (req && req.cookies) {
    //Validamos que exista el request y las cookies.

    if (req.cookies["token_login"]) token = req.cookies["token_login"];
  }
  return token;
};

export default initializePassport;
