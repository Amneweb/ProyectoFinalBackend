import mongoose from "mongoose";
import pc from "picocolors";
import * as chai from "chai";
import ProductDAO from "../src/services/daos/mongo/products/products.mongo.dao.js";
import { environmentConfig } from "../src/config/environment.config.js";
const url = environmentConfig.DATABASE.MONGO.URL;
const db = "test";
mongoose.connect(url, { dbName: db });
const expect = chai.expect;

describe("Test del DAO de productos", () => {
  before(function () {
    this.productDAO = new ProductDAO();
  });
  beforeEach(function () {
    this.timeout(5000);
  });
  /*
============================
TEST 1
============================
*/
  it("El dao debe devolver los productos en un Array", async function () {
    // Given
    const isArray = true;

    // Then
    const result = await this.productDAO.findAll();

    // Asserts
    expect(Array.isArray(result.docs)).to.be.equals(true);
  });

  /*
============================
TEST 2
============================
*/
  it("El dao debe agregar un producto correctamente a la base de datos", async function () {
    // Given
    const productoFicticio = {
      title: "Producto ficticio 5",
      stock: 50,
      description: "descripcion del producto ficticio 5",
      price: 100001,
      category: "EDNA",
      code: "PF5",
      thumb: "/imagenes/productoFicticio1.jpg",
    };

    // Then
    const result = await this.productDAO.create(productoFicticio);

    // Asserts
    expect(result._id).to.be.ok;
  });
  /*
============================
TEST 3
============================
*/
  it("Cuando no lo envía el usuario, el dao creará por defecto la propiedad thumb con un array vacío", async function () {
    //Given
    const productoSinThumb = {
      title: "Producto ficticio 2",
      stock: 50,
      description: "descripcion del producto ficticio 2",
      price: 100002,
      category: "EDNA",
      code: "PF2",
    };
    // Then
    const result = await this.productDAO.create(productoSinThumb);

    // Asserts
    expect(result.thumb).deep.equal([]);
  });

  /*
============================
TEST 4
============================
*/
  it("El dao debe obtener un producto por su SKU (code)", async function () {
    const filters = { code: "PF2" };
    const result = await this.productDAO.findOne(filters);
    expect(typeof result).to.be.deep.equal("object");
  });

  after(function () {
    mongoose.connection.collections.products.drop();
  });
});
