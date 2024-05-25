import CartDAO from "./carts/carts.mongo.dao.js";
import ProductDAO from "./products/products.mongo.dao.js";
import UserDAO from "./users/users.mongo.dao.js";
import TicketDAO from "./tickets/tickets.mongo.dao.js";
import CategoryDAO from "./categories/categories.mongo.dao.js";

export const userMongoDAO = new UserDAO();
export const productMongoDAO = new ProductDAO();
export const cartMongoDAO = new CartDAO();
export const categoryMongoDAO = new CategoryDAO();
export const ticketMongoDAO = new TicketDAO();
