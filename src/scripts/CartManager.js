import fs from "fs";

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
  /* Método Crear directorio y verificar existencia de archivo
   *
   *
   */
  createDir = async () => {
    try {
      await this.#fs.promises.mkdir(this.#carritosRutaDirectorio, {
        recursive: true,
      });
      if (!this.#fs.existsSync(this.#carritosRutaArchivo)) {
        await this.#fs.promises.writeFile(this.#carritosRutaArchivo, "[]");
      }
    } catch (error) {
      console.log("error creando directorio y archivo", error);
      throw ("error creando directorio y archivo", error);
    } finally {
    }
  };

  /* Método New Cart: genera un nuevo carrito
   *
   *
   */
  addCart = async (products) => {
    if (!products) {
      let msj = `El carrito que se intenta generar está vacío y no será creado \n`;
      return msj;
    }

    let newCarrito = {
      products: products,
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
        )}, detalle del error: ${error}`
      );
    }
  };
  /* Método getCarts: Leer archivo y obtener carritos
   *
   *
   */
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
      console.error(`Error leyendo los carritos, detalle del error: ${error}`);
      throw Error(`Error leyendo los productos, detalle del error: ${error}`);
    }
  };
  /* Método getCartByID: Leer archivo y ver si existe carrito con determinado id
   *
   *
   */
  getCartByID = async (id) => {
    try {
      const carritosObtenidos = await this.getCarts();

      const carritoEncontrado = await carritosObtenidos.find(
        (cadacarrito) => cadacarrito.id === id
      );
      if (carritoEncontrado) {
        return carritoEncontrado;
      } else {
        throw `No existe ningún carrito con id = ${id}`;
      }
    } catch (error) {
      return `Error leyendo cart by id, detalle del error: ${error}`;
    }
  };

  /* Método getProductsByCartID: Leer archivo y ver si existe producto con determinado id
   *
   *
   */
  getProductsByCartID = async (id) => {
    try {
      const carritoEncontrado = await this.getCartByID(id);

      if (carritoEncontrado) {
        return carritoEncontrado.products;
      } else {
        throw `No existe ningún carrito con id = ${id}`;
      }
    } catch (error) {
      return `Error leyendo cart by id, detalle del error: ${error}`;
    }
  };

  /* Método getProductsByCartID: Leer archivo y ver si existe producto con determinado id
   *
   *
   */
  addProductToCartID = async (id, productID) => {
    try {
      const carritoEncontrado = await this.getCartByID(id);

      if (carritoEncontrado) {
        const productoEncontrado = carritoEncontrado.products.find(
          (cadaProducto) => cadaProducto.productID === productID
        );
        const indice = this.#carritos.indexOf(carritoEncontrado);
        if (productoEncontrado) {
          const indiceProd =
            carritoEncontrado.products.indexOf(productoEncontrado);

          const newQuantity = carritoEncontrado.products[indiceProd].qty + 1;

          this.#carritos[indice].products[indiceProd].qty = newQuantity;
        } else {
          let productoNuevo = {
            productID: productID,
            qty: 1,
          };
          carritoEncontrado.products.push(productoNuevo);

          this.#carritos[indice].products = carritoEncontrado.products;
        }
        await this.#fs.promises.writeFile(
          this.#carritosRutaArchivo,
          JSON.stringify(this.#carritos, null, 2, "\t")
        );
      } else {
        throw `No existe ningún carrito con id = ${id}`;
      }
    } catch (error) {
      return `Error leyendo cart by id, detalle del error: ${error}`;
    }
  };

  /* Método deleteProductByID: Borrar producto con un id determinado
   *
   *
   */
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
      return `error al tratar de borrar el carrito, detalle del error: ${error}`;
    }
  };
}

export default CartManager;
