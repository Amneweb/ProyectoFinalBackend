import userDAO from "./daos/mongo/users/users.mongo.dao.js";
import cartDAO from "./daos/mongo/carts/carts.mongo.dao.js";
import { validateUser } from "../utils/user.validator.js";

export default class UserService {
  constructor() {
    console.log("Calling users model using a service.");
  }
  getAll = async () => {
    return await userDAO.findAll();
  };
  save = async ({
    userName,
    userLastName,
    userEmail,
    userAge,
    userPassword,
    userRole,
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
      userRole,
    });
    const role = "user";
    const userDTO = {
      ...validatedUser,
      userPassword: createHash(userPassword),
      userRole: role,
      userCartID: [],
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
    try {
      const usuario = await this.userDAO.findOne(email);
      if (!usuario) {
        logger.error("usuario con email %s no encontrado", email);
        throw new BadRequestError("usuario con email %s no encontrado", email);
      }

      const carrito = this.cartDAO.findByID(usuario.userCartID);
      if (!carrito) {
        logger.error(
          "Carrito no encontrado para email %s at %s",
          req.user.email,
          new Date()
        );
        console.error("No se pudo obtener el carrito ");
        throw new BadRequestError(
          "Carrito no encontrado para email %s at %s",
          req.user.email
        );
      }
      res.sendSuccess(carrito);
    } catch (e) {
      res.sendClientError(e);
    }
  };

  login = async (userEmail, userPassword) => {
    const user = await userDAO.findOne(userEmail);
    console.log("Usuario encontrado para login:");
    console.log(user);
    if (!user) {
      console.warn("User doesn't exists with username: " + userEmail);
      return BadRequestError(
        "no hay un usuario registrado con email " + userEmail
      );
    }
    if (!isValidPassword(userPassword, user.userPassword)) {
      console.warn("Invalid credentials for user: " + userEmail);
      return BadREquestError("El usuario y la contraseña no coinciden!");
    }

    const tokenUser = {
      name: `${user.userName} ${user.userLastName}`,
      email: user.userEmail,
      age: user.userAge,
      role: user.userRole,
    };
    const access_token = generateJWToken(tokenUser); // Genera JWT Token que contiene la info del user
    console.log("token generado ", access_token);
    return access_token;
  };
}
