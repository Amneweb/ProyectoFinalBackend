import __dirname from "../../../dirname.js";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import ProductManagerFS from "./products.fs.service.js";
let productManager = new ProductManagerFS();
class CartManagerFS {
  #carritos;
  #carritosRutaDirectorio;
  #carritosRutaArchivo;
  #fs;

  constructor() {
    this.#carritos = [];
    this.#carritosRutaDirectorio = "src/files";
    this.#carritosRutaArchivo = this.#carritosRutaDirectorio + "/carritos.json";
    this.#fs = fs;
  }
  /*=============================================
=             Crear directorio y archivo                =
=============================================*/
  createDir = async () => {
    try {
      await this.#fs.promises.mkdir(this.#carritosRutaDirectorio, {
        recursive: true,
      });
      if (!this.#fs.existsSync(this.#carritosRutaArchivo)) {
        await this.#fs.promises.writeFile(this.#carritosRutaArchivo, "[]");
      }
    } catch (error) {
      throw ("error creando directorio y archivo", error);
    }
  };

  /*=============================================
=           Crear un carrito vacío            =
=============================================*/
  addCart = async () => {
    const newID = uuidv4();
    let newCarrito = {
      products: [],
      id: newID,
    };

    try {
      this.#carritos.push(newCarrito);

      await this.#fs.promises.writeFile(
        this.#carritosRutaArchivo,
        JSON.stringify(this.#carritos, null, 2, "\t")
      );
      return newCarrito;
    } catch (error) {
      console.error(
        `Error creando el carrito nuevo: ${JSON.stringify(
          newCarrito
        )}, detalle del error: ${error}`
      );
      throw new Error(
        `Error creando carrito nuevo: ${JSON.stringify(
          newCarrito
        )}, detalle del ${error}`
      );
    }
  };
  /*=============================================
=       Mostrar todos los  carritos           =
=============================================*/
  getCarts = async () => {
    try {
      await this.createDir();
      let carritosLeidos = await this.#fs.promises.readFile(
        this.#carritosRutaArchivo,
        "utf-8"
      );
      this.#carritos = JSON.parse(carritosLeidos);
      return this.#carritos;
    } catch (error) {
      console.error(`Error leyendo los productos, detalle del error: ${error}`);
      throw new Error(`Error leyendo los productos, detalle del ${error}`);
    }
  };
  /*=============================================
=            Mostrar carrito por ID           =
=============================================*/
  getCartByID = async (id) => {
    try {
      const carritos = await this.getCarts();
      if (!carritos) {
        throw "error al leer los carritos";
      }
      const carritoEncontrado = carritos.find(
        (cadacarrito) => cadacarrito.id === id
      );

      if (carritoEncontrado) {
        return carritoEncontrado;
      } else {
        throw `No existe ningún carrito con id = ${id}`;
      }
    } catch (error) {
      console.error(`Error leyendo cart by id, detalle: ${error}`);
      throw new Error(`Error leyendo cart by id, detalle: ${error}`);
    }
  };
  /*=============================================
=  Agregar prod. a carrito con ID específico  =
=============================================*/
  addProductToCartID = async (id, productID) => {
    try {
      await productManager.getProductByID(productID);
    } catch (e) {
      return e.message;
    }
    try {
      const carritoBuscado = await this.getCartByID(id);

      const indice = this.#carritos.indexOf(carritoBuscado);
      const productos = carritoBuscado.products;
      const verificarProducto = productos.find(
        (cadaproducto) => cadaproducto.productID === productID
      );
      if (verificarProducto) {
        const indiceProd = productos.indexOf(verificarProducto);
        const newQuantity = carritoBuscado.products[indiceProd].qty + 1;
        this.#carritos[indice].products[indiceProd].qty = newQuantity;
      } else {
        let productoNuevo = {
          productID: productID,
          qty: 1,
        };
        carritoBuscado.products.push(productoNuevo);

        this.#carritos[indice].products = carritoBuscado.products;

        await this.#fs.promises.writeFile(
          this.#carritosRutaArchivo,
          JSON.stringify(this.#carritos, null, 2, "\t")
        );
      }
      let msj = `El producto con id = ${productID} se ha agregado con éxito al carrito con id = ${id}`;
      return msj;
    } catch (error) {
      console.error(
        `Error leyendo en método "add product to cart", detalle: ${error}`
      );
      return error.message;
    }
  };
  /*=============================================
=        Borrar un carrito completo           =
=============================================*/
  deleteFullCartByID = async (id) => {
    try {
      const carritoAborrar = await this.getCartByID(id);
      if (carritoAborrar) {
        this.#carritos.splice(this.#carritos.indexOf(carritoAborrar), 1);
        await this.#fs.promises.writeFile(
          this.#carritosRutaArchivo,
          JSON.stringify(this.#carritos, null, 2, "\t")
        );

        let msj = `El carrito con id ${id} fue borrado con éxito\n\n`;
        return msj;
      } else {
        throw "No existe el carrito con el id indicado";
      }
    } catch (error) {
      console.error(
        `error al tratar de borrar el carrito, detalle del error: ${error}`
      );
      throw new Error(
        `error al tratar de borrar el carrito, detalle del ${error}`
      );
    }
  };
}

export default CartManagerFS;
