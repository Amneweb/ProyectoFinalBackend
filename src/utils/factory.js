import MongoSingleton from "../config/singleton.config.js";
import { environmentConfig } from "../config/environment.config.js";

let productDAO;
let cartDAO;

async function initializeMongoService() {
  console.log("Iniciando servicio para MongoDB");
  try {
    await MongoSingleton.getInstance();
  } catch (error) {
    console.error("Error al iniciar MongoDB:", error);
    process.exit(1); // Salir con código de error
  }
}

switch (environmentConfig.PERSISTENCE) {
  case "mongodb":
    initializeMongoService();
    const { default: ProductDAO } = await import(
      "../services/daos/mongo/products/products.mongo.dao.js"
    );
    productDAO = new ProductDAO();

    const { default: CartDAO } = await import(
      "../services/daos/mongo/carts/carts.mongo.dao.js"
    );
    cartDAO = new CartDAO();

    break;
  case "fs":
    //TODO:
    /*para poder crear productos necesito tener usuarios logueados. Tendría que hacer un service de usuarios en filesystem, pero creo que no es la intención de este ejercicio el tener que armarlo así que me conecto a mongo pero uso el servicio de carritos y productos de fs */

    initializeMongoService();
    const { default: ProductManagerFS } = await import(
      "./fs/products.fs.service.js"
    );
    productsService = new ProductManagerFS();
    console.log("Servicio de productos cargado:");
    console.log(productsService);

    const { default: CartManagerFS } = await import("./fs/carts.fs.service.js");
    cartsService = new CartManagerFS();
    console.log("Servicio de carritos cargado:");
    console.log(cartsService);
    break;

  default:
    break;
}

export { productDAO, cartDAO };
