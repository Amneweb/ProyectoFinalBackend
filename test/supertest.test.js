import * as chai from "chai";
import supertest from "supertest";
import pc from "picocolors";
import mongoose from "mongoose";
const expect = chai.expect;
const requester = supertest("http://localhost:8080");
describe("Test de toda la App", () => {
  console.log(pc.bgYellow("NOTA PREVIA:"));
  console.log(
    "En lo que sigue, el usuario con email prueba2@gmail ya está cargado en la base de datos, y no se borra. Los otros usuarios se crean y se borran en el proceso de testing de usuarios. El usuario admin queda logueado para las pruebas de productos"
  );
  let cookie;
  let IDusuarioFicticio2;
  let IDusuarioFicticio;
  let IDproducto;
  let IDproductoMulter;
  let RoleUsuarioFicticio2;
  /*
  * * * * * * * * * * * * * * * * *
  TESTS DE USUARIOS
  * * * * * * * * * * * * * * * * *  
  */
  describe("Test del módulo Usuarios", () => {
    /*
    ==================================
    TEST 1 = REGISTRO DE USUARIOS
    ==================================
    */
    it("POST api/users/register crea un usuario correctamente (con rol user por default)", async () => {
      // Given
      const usuarioFicticioOK = {
        userName: "Usuario de prueba",
        userLastName: "Apellido de prueba",
        userEmail: "prueba@gmail.com",
        userAge: 54,
        userPassword: "123456",
      };
      // Then
      const { _body, statusCode } = await requester
        .post("/api/users/register")
        .send(usuarioFicticioOK);
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
    it("POST api/users/register no debe permitir la creación de un usuario sin alguno de los datos", async () => {
      // Given
      const usuarioFicticioNOK = {
        userName: "Usuario de prueba NOK",
        userLastName: "Apellido de prueba",
        userAge: 54,
        userPassword: "123456",
      };
      // Then
      const { _body, statusCode } = await requester
        .post("/api/users/register")
        .send(usuarioFicticioNOK);
      // Assert
      expect(statusCode).is.eql(400);
      expect(_body).to.ok.and.to.have.property("error");
    });
    /*
    =====================================================
    TEST 3 = USUARIO CON EMAIL YA EXISTENTE
    =====================================================
    */
    it("POST api/users/register no debe permitir la creación de un usuario con email existente", async () => {
      // Given
      const usuarioFicticioNOK = {
        userName: "Usuario de prueba NOK",
        userLastName: "Apellido de prueba",
        userEmail: "prueba@gmail.com",
        userAge: 54,
        userPassword: "123456",
      };
      // Then
      const { _body, statusCode } = await requester
        .post("/api/users/register")
        .send(usuarioFicticioNOK);
      // Assert
      expect(statusCode).is.eql(400);
      expect(_body).to.ok.and.to.have.property("error");
    });
    /*
    ========================================================
    TEST 4 = EL USUARIO CREADO DEBE TENER UN CARRITO VACIO
    ========================================================
    */
    it("POST api/users/register crea un usuario con la propiedad userCartID como array vacío", async () => {
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
      RoleUsuarioFicticio2 = _body.payload.userRole;
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
    it("POST api/users/login loguea un usuario correctamente", async function () {
      // Given
      const mockLogin = {
        userEmail: "prueba3@gmail.com",
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
    TEST 6 = CAMBIO DE ROL
    ===========================================
    */
    it(`PUT /api/users/premium/:uid debe cambiar correctamente el rol del usuario logueado.`, async function () {
      // Given
      const torole = { torole: "premium" };
      // Then
      const { statusCode, _body } = await requester
        .put(`/api/users/premium/${IDusuarioFicticio2}`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`])
        .send(torole);
      console.log("body payload en cambio de rol", _body.payload);
      // Assert
      expect(statusCode).is.eql(200);
      expect(_body.payload).to.ok;
    });
    /*
    ===========================================
    TEST 6 = VERIFICACION DE ROL CAMBIADO
    ===========================================
    */
    it(`PUT /api/users/updateCurrentUser debe traer la información actualizada del usuario logueado.`, async function () {
      // Then
      const { statusCode, _body } = await requester
        .get(`/api/users/updateCurrentUser`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);

      console.log("body payload en update user", _body.payload);
      // Assert
      expect(statusCode).is.eql(200);
      expect(_body.payload).to.ok;
      expect(_body.payload).to.have.property("userRole").to.equal("premium");
    });
    /*
    =======================================================================
    TEST 7 = CAMBIO DE ROL CON UN USUARIO QUE NO TIENE EL ID DEL PARAMETRO
    =======================================================================
    */
    it(`PUT /api/users/premium/:uid da error cuando el usuario logueado no tiene ID = uid.`, async function () {
      // Given
      const torole = "premium";
      // Then
      const { statusCode, _body } = await requester
        .put(`/api/users/premium/${IDusuarioFicticio}`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`])
        .send(torole);
      console.log("body payload en cambio de rol", _body.error);
      // Assert
      expect(statusCode).is.eql(400);
      expect(_body).to.ok.and.to.have.property("error");
    });
    /*
    ===================================
    TEST 8 = LOGIN DE USUARIO ADMIN
    ===================================
    */
    it("POST api/users/login loguea un usuario correctamente (este usuario ya tiene configurado rol = ADMIN)", async function () {
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
    TEST 9 = RUTA PROTEGIDA: BORRAR USUARIO 1
    ===========================================
    */
    it(`DELETE /api/users/:id borra al usuario con el id indicado (primer usuario creado)`, async function () {
      const { statusCode, _body } = await requester
        .delete(`/api/users/${IDusuarioFicticio}`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);
      // Assert
      expect(statusCode).is.eql(200);
      expect(_body.payload).to.ok;
    });
    /*
    ===========================================
    TEST 10 = RUTA PROTEGIDA: BORRAR USUARIO 2
    ===========================================
    */
    it(`DELETE /api/users/:id borra al usuario con el id indicado (segundo usuario creado)`, async function () {
      const { statusCode, _body } = await requester
        .delete(`/api/users/${IDusuarioFicticio2}`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);
      // Assert
      expect(statusCode).is.eql(200);
      expect(_body.payload).to.ok;
    });
  });
  /*
  * * * * * * * * * * * * * * * * *
  TESTS DE PRODUCTOS
  * * * * * * * * * * * * * * * * *
  */
  describe("Test del módulo Productos", () => {
    /* 
    =========================================
    TEST 1 = RUTA PROTEGIDA: CREAR PRODUCTO
    =========================================
    */
    it("POST api/products/ con un usuario 'admin' crea un producto correctamente y sin el campo owner", async () => {
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
    it("DELETE api/products/:id borra el producto correctamente", async () => {
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
    it("POST /api/products/ debe devolver status 400 y el error al intentar crear un producto sin el nombre ", async function () {
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
  * * * * * * * * * * * * * * * * *
  TESTS DE CARGA DE ARCHIVOS
  * * * * * * * * * * * * * * * * *
  */
  describe("Test de subida de imagenes", () => {
    /*
    ===========================================
    TEST 1 = CREACION DE PRODUCTO CON IMAGEN
    ===========================================
    */
    it("POST /api/products crea un producto con la imagen subida y la ruta guardada en la propiedad thumb", async function () {
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
    it("PUT /api/products/:id/imagenes sube correctamente una imagen y la ruta se agrega al array de thumb", async function () {
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
    it("DELETE api/products/:id borra el producto creado para probar Multer", async () => {
      //Given
      //Then
      const { statusCode } = await requester
        .delete(`/api/products/${IDproductoMulter}`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);
      // Assert
      expect(statusCode).is.eql(200);
    });
  });
  //after(function () {
  //  mongoose.connection.collections.products.drop();
  //});
});
