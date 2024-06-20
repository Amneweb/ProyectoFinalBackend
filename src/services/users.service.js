import { userMongoDAO as userDAO } from "./daos/mongo/index.js";
import jwt from "jsonwebtoken";
import { cartDAO } from "../utils/factory.js";
import { BadRequestError } from "../utils/errors.js";
import { validateUser } from "../utils/user.validator.js";
import { userLogger as logger } from "../config/logger.config.js";
import { environmentConfig } from "../config/environment.config.js";
import {
  isValidPassword,
  generateJWToken,
  createHash,
} from "../utils/utils.js";
export default class UserService {
  constructor() {}
  getAll = async () => {
    return await userDAO.findAll();
  };
  save = async ({
    userName,
    userLastName,
    userEmail,
    userAge,
    userPassword,
  }) => {
    const email = userEmail;
    const existsUser = await userDAO.findOne(email);

    if (existsUser) {
      throw new BadRequestError(`Ya existe un usuario con el email ${email}`);
    }
    const validatedUser = validateUser({
      userName,
      userLastName,
      userEmail,
      userAge,
      userPassword,
    });

    if (!validatedUser) {
      throw new BadRequestError(
        "no se pudo validar el usuario, uno o más datos no cumple con los requerimientos"
      );
    }

    const userDTO = {
      ...validatedUser,
      userPassword: createHash(userPassword),
    };
    return await userDAO.create(userDTO);
  };

  findByUsername = async (userEmail) => {
    return await userDAO.findOne(userEmail);
  };
  update = async (user, filter, value) => {
    console.log("Update user with filter and value:");
    console.log(filter);
    console.log(value);
    console.log(user);
    const hayUsuario = await userDAO.findOne(user.email);
    if (!hayUsuario) {
      throw new BadRequestError("No se encontró usuario con ese email");
    }

    hayUsuario[filter] = value;

    await hayUsuario.save();

    return hayUsuario;
  };

  findCart = async (email) => {
    logger.method("findCart");

    const usuario = await userDAO.findOne(email);
    if (!usuario) {
      logger.error("usuario con email %s no encontrado", email);
      throw new BadRequestError("usuario con email %s no encontrado", email);
    }

    const carrito = cartDAO.findByID(usuario.userCartID);
    if (!carrito) {
      logger.error(
        "Carrito no encontrado para email %s at %s",
        req.user.email,
        new Date()
      );

      throw new BadRequestError(
        "Carrito no encontrado para email %s at %s",
        req.user.email
      );
    }
    return carrito;
  };

  deleteUser = async (id) => {
    const usuarioBorrado = await userDAO.deleteOne(id);
    return usuarioBorrado;
  };

  login = async (userEmail, userPassword) => {
    const user = await userDAO.findOne(userEmail);
    console.log("Usuario encontrado para login:");
    console.log(user);
    if (!user) {
      console.warn("User doesn't exists with username: " + userEmail);
      return new BadRequestError(
        "no hay un usuario registrado con email " + userEmail
      );
    }
    if (!isValidPassword(userPassword, user.userPassword)) {
      console.warn("Invalid credentials for user: " + userEmail);
      return new BadRequestError("El usuario y la contraseña no coinciden!");
    }

    const tokenUser = {
      name: `${user.userName} ${user.userLastName}`,
      email: user.userEmail,
      age: user.userAge,
      role: user.userRole,
    };
    const access_token = generateJWToken(tokenUser); // Genera JWT Token que contiene la info del user

    return access_token;
  };
  recovery = async (token, cookie) => {
    if (token === cookie) {
      //verifico el contenido del token
      const jwtInfo = jwt.verify(token, environmentConfig.SERVER.JWT.SECRET);
      console.log("email extraido de jwt", jwtInfo);
      return jwtInfo.user.email;
    } else {
      return new BadRequestError("el email no es el que hizo la petición");
    }
  };
  verify = async (email, pass) => {
    const usuarioEncontrado = await userDAO.findOne(email);
    logger.debug(
      "usuario obtenido para modificar password %j",
      usuarioEncontrado
    );
    if (!usuarioEncontrado) {
      throw new BadRequestError("no se encontró el usuario con email " + email);
    }
    const hasheado = createHash(pass);

    if (isValidPassword(pass, usuarioEncontrado.userPassword)) {
      throw new BadRequestError(
        "El password no puede repetirse, por favor ingresá un password diferente al anterior"
      );
    }

    usuarioEncontrado["userPassword"] = hasheado;
    await usuarioEncontrado.save();
    return usuarioEncontrado;
  };
  changerole = async (uid, torole, user) => {
    const usuarioEncontrado = await userDAO.findByID(uid);

    if (!usuarioEncontrado) {
      throw new BadRequestError("no se encontró el usuario con id " + uid);
    }
    if (usuarioEncontrado.userEmail != user.email) {
      logger.error(
        "El usuario logueado no es el usuario con el id ingresado por parámetro"
      );
      throw new BadRequestError(
        "El usuario logueado no es el mismo que el usuario con id " + uid
      );
    }
    const usuarioModificado = await userDAO.updateByFilter(user.email, {
      userRole: torole,
    });
    return usuarioModificado;
  };
}
