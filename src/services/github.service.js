import UserDAO from "./daos/mongo/users/users.mongo.dao.js";
import { cartDAO } from "./factory.js";

import { generateJWToken } from "../utils/utils.js";
const userDAO = new UserDAO();

const githubService = async (userEmail) => {
  const user = await userDAO.findOne(userEmail);

  if (!user) {
    console.warn("No existe usuario con email: " + userEmail);
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
        const existe = await cartDAO.findByID(arrayCarritos[i]);
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
  return access_token;
};
export default githubService;
