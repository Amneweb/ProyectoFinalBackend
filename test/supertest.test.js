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
  let IDproductoMulter;
  /*
  *******************************
  TESTS DE USUARIOS
  *******************************
  */
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
    =========================================================
    TEST 2 = USUARIO SIN ALGUNO DE LOS DATOS
    =========================================================
    */
    it("el endpoing POST api/users/register no debe permitir la creación de un usuario sin alguno de los datos", async () => {
      // Given
      const usuarioFicticio1 = {
        userName: "Usuario de prueba",
        userLastName: "Apellido de prueba",
        userAge: 54,
        userPassword: "123456",
      };
      // Then
      const { _body, statusCode } = await requester
        .post("/api/users/register")
        .send(usuarioFicticio1);
      // Assert
      expect(statusCode).is.eql(400);
      expect(_body).to.ok.and.to.have.property("error");
    });
    /*
    =====================================================
    TEST 3 = USUARIO CON EMAIL YA EXISTENTE
    =====================================================
    */
    it("el endpoing POST api/users/register no debe permitir la creación de un usuario con email existente", async () => {
      // Given
      const usuarioFicticio1 = {
        userName: "Usuario de prueba",
        userLastName: "Apellido de prueba",
        userEmail: "prueba@gmail.com",
        userAge: 54,
        userPassword: "123456",
      };
      // Then
      const { _body, statusCode } = await requester
        .post("/api/users/register")
        .send(usuarioFicticio1);

      // Assert
      expect(statusCode).is.eql(400);
      expect(_body).to.ok.and.to.have.property("error");
    });
    /*
    ========================================================
    TEST 4 = EL USUARIO CREADO DEBE TENER UN CARRITO VACIO
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
    TEST 5 = LOGIN
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
    ===========================================
    TEST 6 = RUTA PROTEGIDA: BORRAR USUARIOS
    ===========================================
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
  *************************************
  TESTS DE PRODUCTOS
  *************************************
  */
  describe("Test del módulo Productos", () => {
    /* 
    =========================================
    TEST 1 = RUTA PROTEGIDA: CREAR PRODUCTO
    =========================================
    */
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
    ==========================================
    TEST 2 = BORRA EL PRODUCTO RECIEN CREADO
    ==========================================
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
    /*
    =========================================
    TEST 3 = PRODUCTO SIN TODOS LOS DATOS
    =========================================
    */
    it("El endpoint POST /api/products/ debe devolver status 400 y el error al intentar crear un producto sin el nombre ", async function () {
      //Given
      const productoFicticioSinDatos = {
        stock: 50,
        description:
          "descripcion del producto ficticio 2 generado con supertest",
        price: 100001,
        category: "EDNA",
        code: "PFST5",
      };
      //Then
      const { statusCode, _body } = await requester
        .post("/api/products/")
        .set("Cookie", [`${cookie.name}=${cookie.value}`])
        .send(productoFicticioSinDatos);
      // Assert
      expect(statusCode).is.eql(400);
      expect(_body).is.ok.and.to.have.property("error");
    });
  });
  /*
  *************************************
  TESTS DE CARGA DE ARCHIVOS
  *************************************
  */
  describe("Test de subida de imagenes", () => {
    /*
    ===========================================
    TEST 1 = CREACION DE PRODUCTO CON IMAGEN
    ===========================================
    */
    it("se debe poder crear un producto con la imagen subida y la ruta guardada en la propiedad thumb", async function () {
      //Given
      const productoFicticioMulter = {
        title: "Producto ficticio MT",
        stock: 10,
        description:
          "descripcion del producto ficticio generado con supertest para probar la subida de imágenes",
        price: 100341,
        category: "EDNA",
        code: "PFMT",
      };
      //Then
      const result = await requester
        .post("/api/products")
        .set("Cookie", [`${cookie.name}=${cookie.value}`])
        .field("title", productoFicticioMulter.title)
        .field("stock", productoFicticioMulter.stock)
        .field("description", productoFicticioMulter.description)
        .field("price", productoFicticioMulter.price)
        .field("category", productoFicticioMulter.category)
        .field("code", productoFicticioMulter.code)
        .attach("imagen", "./test/imagenes/afuera.jpeg");
      IDproductoMulter = result._body.payload._id;
      // Assert
      expect(result.statusCode).to.eql(200);
      // console.log(result._body);
      expect(result._body.payload.thumb).to.be.ok;
    });
    /*
    =====================================================
    TEST 2 = MODIFICACION DE PRODUCTO CON NUEVA IMAGEN
    =====================================================
    */
    it("El endpoint PUT /api/products/:id/imagenes debe cargar una imagen y la ruta se agregará al array de la propiedad thumb", async function () {
      //Given
      //Then
      const result = await requester
        .put(`/api/products/${IDproductoMulter}/imagenes`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`])
        .attach("imagen", "./test/imagenes/estanterias.jpeg");
      // Assert
      expect(result.statusCode).to.eql(200);
      // console.log(result._body);
      expect(result._body.payload.thumb).to.be.ok;
    });
    /*
    ===========================================
    TEST 3 = BORRA EL PRODUCTO RECIEN CREADO
    ===========================================
    */
    it("el endpoing DELETE api/products/:id borra el producto creado para probar Multer", async () => {
      //Given
      //Then
      const { statusCode } = await requester
        .delete(`/api/products/${IDproductoMulter}`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);
      // Assert
      expect(statusCode).is.eql(200);
    });
  });
});
