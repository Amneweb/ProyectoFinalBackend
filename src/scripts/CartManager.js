import fs from "fs";
import ProductManager from "./ProductManager.js";
let productManager = new ProductManager();
class CartManager {
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
=             Crear directorio                =
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
    let newCarrito = {
      products: [],
    };

    try {
      const existentes = await this.getCarts();

      let maxID = 0;

      if (existentes.length > 0) {
        const arrayDeID = existentes.map((carrito) => carrito.id);
        maxID =
          arrayDeID.length > 1
            ? arrayDeID.reduce((a, b) => Math.max(a, b))
            : arrayDeID[0];
      }

      this.#carritos.push({
        ...newCarrito,
        id: maxID + 1,
      });

      await this.#fs.promises.writeFile(
        this.#carritosRutaArchivo,
        JSON.stringify(this.#carritos, null, 2, "\t")
      );
      let msj = `El carrito se ha generado con éxito con id ${maxID + 1}\n\n`;
      return msj;
    } catch (error) {
      console.error(
        `Error creando el carrito nuevo: ${JSON.stringify(
          carritoNuevo
        )}, detalle del error: ${error}`
      );
      throw new Error(
        `Error creando carrito nuevo: ${JSON.stringify(
          carritoNuevo
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
      console.log("carrito encontrado ", carritoEncontrado);
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

export default CartManager;
