import { userMongoDAO as userDAO } from "./daos/mongo/index.js";
import fs from "fs";
import jwt from "jsonwebtoken";
import { cartDAO } from "./factory.js";
import { BadRequestError } from "../utils/errors.js";
import { validateUser } from "../utils/user.validator.js";
import { userLogger as logger } from "../config/logger.config.js";
import { environmentConfig } from "../config/environment.config.js";
import {
  isValidPassword,
  generateJWToken,
  createHash,
} from "../utils/utils.js";
import __dirname from "../../dirname.js";
import DocumentationDAO from "./daos/mongo/documentation/documentation.mongo.dao.js";
export default class UserService {
  constructor() {
    this.documentationDAO = new DocumentationDAO();
  }
  getAll = async () => {
    return await userDAO.findAll();
  };
  getInactivos = async (meses) => {
    //calculamos la fecha de hoy en milisegundos
    logger.silly("dentro de getinacttivos");
    const hoy = new Date();

    logger.debug("hoy en milisegundos %s", hoy.getTime());

    //el tiempo limite para borrar los usuarios lo define el administrador y llega por la query "meses". No considero meses exactos, sino días
    // la formula real será lapso = meses * 30 * 24 * 60 * 60 * 1000 pero como necesito probarlo en minutos en lugar de meses, agrego un 0.0002 al final, y me transforma cada mes en casi 10 minutos

    const lapso = meses * 30 * 24 * 60 * 60 * 1000 * 0.0002;

    const limiteinferior = hoy - lapso;

    const result = await userDAO.findByFilter({
      userConnection: { $lte: limiteinferior },
    });

    return result;
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
    const hayUsuario = await userDAO.findOne(user.email);
    if (!hayUsuario) {
      throw new BadRequestError("No se encontró usuario con ese email");
    }

    if (filter === "userCartID") {
      const carritos = hayUsuario.userCartID;

      carritos.unshift(value.toString());

      hayUsuario["userCartID"] = carritos;
    } else {
      hayUsuario[filter] = value;
    }

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

    if (!user) {
      console.warn("User doesn't exists with username: " + userEmail);
      throw new BadRequestError(
        "no hay un usuario registrado con email " + userEmail
      );
    }
    if (!isValidPassword(userPassword, user.userPassword)) {
      console.warn("Invalid credentials for user: " + userEmail);
      throw new BadRequestError("El usuario y la contraseña no coinciden!");
    }
    user["userConnection"] = Date.now() + 600000;
    await user.save();
    const arrayCarritos = user.userCartID;
    logger.debug("cuantos carritos tiene el usuario %s", arrayCarritos.length);
    /*
    =========================================================================
    VERIFICO SI EL USUARIO TIENE ASOCIADO UN CARRITO INEXISTENTE Y LO BORRO
    =========================================================================
    */
    if (arrayCarritos.length > 0) {
      let inexistentes = [];

      const generarInexistentes = async function () {
        for (let i = 0; i < arrayCarritos.length; i++) {
          const existe = await cartDAO.findByID(arrayCarritos[i]);
          if (existe === null) {
            inexistentes.push(arrayCarritos[i]);
          }
        }
        return inexistentes;
      };
      const nulos = await generarInexistentes();

      logger.debug("carritos del usuario que no existen");
      logger.debug(nulos);
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

    return access_token;
  };

  recovery = async (token, cookie) => {
    if (token === cookie) {
      //verifico el contenido del token
      const jwtInfo = jwt.verify(token, environmentConfig.SERVER.JWT.SECRET);

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

    if (torole === "premium") {
      if (usuarioEncontrado.userStatus === false) {
        logger.error(
          "el usuario todavía no tiene el permiso para cambiar de rol"
        );
        throw new BadRequestError(
          "El usuario aun no cuenta con los permisos necesarios para cambiar el rol dado que hay documentación faltante. Contactate con nosotros ante cualquier duda."
        );
      }
    }
    const usuarioModificado = await userDAO.updateByFilter(user.email, {
      userRole: torole,
    });
    return usuarioModificado;
  };
  uploadDocs = async (uid, user, doc, docCode) => {
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
    const docObject = {
      docCode: docCode,
      docAddress: doc,
    };

    const arrayDocs = usuarioEncontrado.userDocs;

    const mapped = arrayDocs.map((item) => item.docCode);

    if (mapped.indexOf(docObject.docCode) === -1) {
      arrayDocs.push(docObject);
    } else {
      arrayDocs.splice(mapped.indexOf(docObject.docCode), 1);

      fs.unlink(__dirname + docObject.docAddress, (error) => {
        if (error) console.log(error);
        else {
          console.log("\nDeleted file: " + docObject.docAddress);
        }
      });

      arrayDocs.push(docObject);
    }
    const modificado = await userDAO.updateByFilter(user.email, {
      userDocs: arrayDocs,
    });

    const docs = await this.documentationDAO.findAll();

    const obligatorios = docs.map((doc) => {
      if (doc.obligatorio === true) return doc.codigo;
    });

    let faltantes = [];
    const soloCodigos = modificado.userDocs.map((item) => item.docCode);

    obligatorios.forEach((item) => {
      if (soloCodigos.indexOf(item) < 0) {
        faltantes.push(item);
      }
    });

    if (faltantes.length === 0) {
      return await userDAO.updateByFilter(user.email, { userStatus: true });
    } else {
      return modificado;
    }
  };
}
