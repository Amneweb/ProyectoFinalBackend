import passport from "passport";
import jwtStrategy from "passport-jwt";
import GithubStrategy from "passport-github2";
import { environmentConfig } from "./environment.config.js";
import userModel from "../services/daos/mongo/users/users.model.js";

const JwtStrategy = jwtStrategy.Strategy;
const ExtractJWT = jwtStrategy.ExtractJwt;

const initializePassport = () => {
  /*
  ==================================
  ESTRATEGIA GITHUB
  ==================================
  */

  passport.use(
    "github",
    new GithubStrategy(
      {
        clientID: environmentConfig.SERVER.GITHUB.CLIENT_ID,
        clientSecret: environmentConfig.SERVER.GITHUB.CLIENT_SECRET,
        scope: ["user:email"],
        callbackUrl:
          "https://proyectofinalbackend-test.up.railway.app/api/sessions/githubcallback",
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
              userAge: 20,
              userEmail: profile.emails[0].value,
              userPassword: "",
            };
            const result = await userModel.create(newUser);
            console.log("luego de creado el user con github");
            console.log(result);
            return done(null, result);
          } else {
            console.log("Usuario encontrado para login:");
            console.log(user);
            return done(null, user);
          }
        } catch (error) {
          console.log("error en passport config");
          console.log(error.message);
          return done(error);
        }
      }
    )
  );

  /*
=============================
ESTRATEGIA JWT
==============================
*/
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

  if (req && req.signedCookies) {
    //Validamos que exista el request y las cookies.

    if (req.signedCookies["token_login"])
      token = req.signedCookies["token_login"];
  }
  return token;
};

export default initializePassport;
