import mongoose from "mongoose";
import pc from "picocolors";
import * as chai from "chai";
import CartDAO from "../src/services/daos/mongo/carts/carts.mongo.dao.js";
import ProductDAO from "../src/services/daos/mongo/products/products.mongo.dao.js";
import { environmentConfig } from "../src/config/environment.config.js";
const url = environmentConfig.DATABASE.MONGO.URL;
const db = "test";
mongoose.connect(url, { dbName: db });
const expect = chai.expect;

describe("Test del DAO de carritos", () => {
  before(function () {
    this.cartDAO = new CartDAO();
    this.productDAO = new ProductDAO();
    this.cartID;
    this.productID;
  });
  beforeEach(function () {
    this.timeout(5000);
  });
  /*
  ============================
  TEST 1
  ============================
  */
  it("El dao debe devolver los carritos en un Array", async function () {
    // Given
    // Then
    const result = await this.cartDAO.findAll();

    // Asserts
    expect(Array.isArray(result)).to.be.equals(true);
  });
  /*
  ============================
  TEST 2
  ============================
  */
  it("El dao debe agregar un carrito vacío a la base de datos", async function () {
    // Given
    const newCarrito = {
      products: [],
    };
    // Then
    const result = await this.cartDAO.create(newCarrito);
    this.cartID = result._id;
    // Asserts
    expect(result._id).to.be.ok;
  });
  /*
  ============================
  TEST 3
  ============================
  */
  it("El dao debe devolver el carrito correspondiente al id enviado", async function () {
    //Given
    // Then
    const result = await this.cartDAO.findByID(this.cartID);
    // Asserts
    expect(result._id).deep.equal(this.cartID);
  });
  /*
  ============================
  TEST 4
  ============================
  */
  it("El dao devuelve null si se pide un carrito inexistente", async function () {
    //Given
    // Then
    const result = await this.cartDAO.findByID("666f6b3b6fca434177172576");
    // Asserts
    expect(result).to.be.null;
  });
  /*
  ============================
  TEST 5
  ============================
  */
  it("El dao modifica correctamente un carrito existente", async function () {
    // primero genero un producto
    // Given
    const productoFicticio = {
      title: "Producto Cart DAO",
      stock: 50,
      description: "Producto creado desde el test de carritos",
      price: 100001,
      category: "EDNA",
      code: "CDAO1",
      thumb: "/imagenes/productoFicticio50.jpg",
    };
    // Then
    const producto = await this.productDAO.create(productoFicticio);
    this.productID = producto._id;
    const updatedCart = [{ product: this.productID, qty: 2 }];
    const result = await this.cartDAO.update(this.cartID, updatedCart);
    expect(typeof result).to.be.deep.equal("object");
    expect(result).to.have.property("modifiedCount").and.be.equal(1);
  });
  /*
  ============================
  TEST 6
  ============================
  */
  it("el dao debe borrar un carrito en base a su id", async function () {
    const result = await this.cartDAO.delete(this.cartID);
    expect(typeof result).to.be.deep.equal("object");
    expect(result).to.have.property("deletedCount").and.be.equal(1);
  });

  after(function () {
    mongoose.connection.collections.products.drop();
    mongoose.connection.collections.carts.drop();
  });
});
