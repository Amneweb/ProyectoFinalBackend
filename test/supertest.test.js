import pc from "picocolors";
import * as chai from "chai";
import supertest from "supertest";

import { environmentConfig } from "../src/config/environment.config.js";
const expect = chai.expect;
const requester = supertest("http://localhost:8080");
describe("Test de toda la App", () => {
  let cookie;
  let IDusuarioFicticio2;
  let IDusuarioFicticio;
  let IDproducto;
  describe("Test del módulo Usuarios", () => {
    console.log(
      pc.bgCyan("nombre base de datos"),
      environmentConfig.DATABASE.MONGO.DB_NAME
    );

    /*
    ==================================
    TEST 1 = REGISTRO DE USUARIOS
    ==================================
    */
    it("el endpoing POST api/users/register debe crear un usuario correctamente", async () => {
      // Given
      const usuarioFicticio = {
        userName: "Usuario de prueba",
        userLastName: "Apellido de prueba",
        userEmail: "prueba@gmail.com",
        userAge: 54,
        userPassword: "123456",
      };
      // Then
      const { _body, statusCode } = await requester
        .post("/api/users/register")
        .send(usuarioFicticio);
      IDusuarioFicticio = _body.payload._id;
      // Assert
      expect(statusCode).is.eql(200);
      expect(_body.payload).to.be.ok;
      expect(_body.payload).to.ok.and.to.have.property("_id");
      expect(_body.payload).to.not.have.property("owner");
    });

    /*
  ========================================================
  TEST 2 = EL USUARIO CREADO DEBE TENER UN CARRITO VACIO
  ========================================================
*/
    it("el usuario creado en el endpoing POST api/users/register debe tener la propiedad userCartID como array vacío", async () => {
      // Given
      const usuarioFicticio2 = {
        userName: "Usuario de prueba 3",
        userLastName: "Apellido de prueba 3",
        userEmail: "prueba3@gmail.com",
        userAge: 18,
        userPassword: "123456",
      };
      // Then
      const { _body, statusCode } = await requester
        .post("/api/users/register")
        .send(usuarioFicticio2);
      IDusuarioFicticio2 = _body.payload._id;

      // Assert
      expect(statusCode).is.eql(200);
      expect(_body.payload)
        .to.be.ok.and.to.have.property("userCartID")
        .deep.equal([]);
    });

    /*
===================================
TEST 3 = LOGIN
===================================
*/
    it("Test Login Usuario: Debe poder hacer login correctamente con el usuario registrado previamente.", async function () {
      // Given
      const mockLogin = {
        userEmail: "prueba2@gmail.com",
        userPassword: "123456",
      };

      // Then
      const result = await requester.post("/api/users/login").send(mockLogin);

      const cookieResult = result.headers["set-cookie"][0];

      const cookieData = cookieResult.split("=");
      cookie = {
        name: cookieData[0],
        value: cookieData[1],
      };

      // Assert
      expect(result.statusCode).is.eqls(200);
      expect(cookie.name).to.be.ok.and.eql("token_login");
      expect(cookie.value).to.be.ok;
    });
    /*
=================================
RUTA PROTEGIDA: BORRAR USUARIOS
=================================
*/
    it(`El endpoint DELETE /api/users/:id debe borrar correctamente al usuario con el id indicado`, async function () {
      const { statusCode, _body } = await requester
        .delete(`/api/users/${IDusuarioFicticio2}`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);
      // Assert
      expect(statusCode).is.eql(200);
      expect(_body.payload).to.ok;
    });
    it(`El endpoint DELETE /api/users/:id debe borrar correctamente al usuario con el id indicado`, async function () {
      const { statusCode, _body } = await requester
        .delete(`/api/users/${IDusuarioFicticio}`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);
      // Assert
      expect(statusCode).is.eql(200);
      expect(_body.payload).to.ok;
    });
  });

  /* 
            =========================================
            TEST 4 = RUTA PROTEGIDA / CREAR PRODUCTO
            =========================================
            */

  describe("Test del módulo Productos", () => {
    it("el endpoing POST api/products/ con un usuario 'user' debe crear un producto correctamente y sin el campo owner", async () => {
      //Given
      const productoFicticioSupertest = {
        title: "Producto ficticio ST2",
        stock: 50,
        description:
          "descripcion del producto ficticio 2 generado con supertest",
        price: 100001,
        category: "EDNA",
        code: "PFST2",
        thumb: "/imagenes/productoFicticioST2.jpg",
      };
      //Then
      const { statusCode, _body } = await requester
        .post("/api/products/")
        .set("Cookie", [`${cookie.name}=${cookie.value}`])
        .send(productoFicticioSupertest);
      IDproducto = _body.payload._id;
      // Assert
      expect(statusCode).is.eql(200);
      expect(_body.payload).to.ok.and.to.have.property("_id");
      expect(_body.payload).to.not.have.property("owner");
    });
    /*
==================================
BORRA EL PRODUCTO RECIEN CREADO
==================================
*/
    it("el endpoing DELETE api/products/:id borra el producto correctamente", async () => {
      //Given

      //Then
      const { statusCode } = await requester
        .delete(`/api/products/${IDproducto}`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);
      // Assert
      expect(statusCode).is.eql(200);
    });
  });
});
