import mongoose from "mongoose";
import { BadRequestError } from "../utils/errors.js";
import { productDAO } from "../utils/factory.js";
import UserDAO from "./daos/mongo/users/users.mongo.dao.js";
import { productsLogger as logger } from "../config/logger.config.js";
const userDAO = new UserDAO();
export const validateOwnership = async (pid, uemail) => {
  const productOwner = await productDAO.findByID(pid);
  logger.silly("id del owner del producto %s", productOwner.owner);

  if (!productOwner.owner) {
    logger.error("El producto con id %s no tiene dueño", id);
    throw new BadRequestError(
      `El usuario con email ${uemail} no tiene los privilegios para borrar el producto con id ${pid}`
    );
  }
  const ownerID = productOwner.owner;

  const datosUser = await userDAO.findOne(uemail);

  const userID = datosUser._id.toString();

  logger.debug("id del usuario con email %s: %s", uemail, userID);
  if (ownerID != userID) {
    logger.error(
      "El usuario con email %s no es el owner del producto con id %s",
      uemail,
      pid
    );
    throw new BadRequestError(
      `El usuario con email ${uemail} no tiene los privilegios para borrar el producto con id ${pid}`
    );
  }
};
export const validateCartOwnership = async (cid, uemail) => {
  console.log("email en validator ", uemail);
  const datosUser = await userDAO.findOne(uemail);
  if (!datosUser.userCartID.includes(cid)) {
    console.log("no son iguales los id");
    return false;
  }
  return true;
};

export function validateId(id) {
  const isValidObjectId = mongoose.isValidObjectId(id);

  return isValidObjectId;
}
