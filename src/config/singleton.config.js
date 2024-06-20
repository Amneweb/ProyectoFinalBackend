import mongoose from "mongoose";
import pc from "picocolors";
import { environmentConfig } from "./environment.config.js";
const url = environmentConfig.DATABASE.MONGO.URL;
const db =
  environmentConfig.TESTING === "test"
    ? "test"
    : environmentConfig.DATABASE.MONGO.DB_NAME;
console.log(pc.bgCyan("base de datos usada " + db));
export default class MongoSingleton {
  static #instance;

  constructor() {
    this.#connectMongoDB();
  }

  static getInstance() {
    if (this.#instance) {
      console.log("Ya se ha abierto una conexion a MongoDB.");
    } else {
      this.#instance = new MongoSingleton();
    }
    return this.#instance;
  }

  #connectMongoDB = async () => {
    try {
      await mongoose.connect(url, { dbName: db });
      //probando la conexión

      console.log("Conectado con éxito a la base de datos");
    } catch (error) {
      console.error("No se pudo conectar a la BD usando Moongose: " + error);
      process.exit();
    }
  };
}

// MongoServerError: cannot use non-majority 'w' mode majorit when a host is not a member of a replica set, se debe a la configuración de escritura ('w') que estás utilizando en tus operaciones de MongoDB. Este error ocurre cuando intentas utilizar el modo de escritura 'majority' en una base de datos MongoDB que no está configurada como un conjunto de réplicas (replica set).
