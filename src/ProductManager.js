import fs from "fs";
class Producto {
  constructor(title, price, code, stock, description, status, thumb) {
    this.title = title;
    this.price = price;
    this.code = code;
    this.stock = stock;
    this.description = description;
    this.status = status;
    this.thumb = thumb;
  }
}

class ProductManager {
  #productos;
  #productosRutaDirectorio;
  #productosRutaArchivo;
  #fs;

  constructor() {
    this.#productos = [];
    this.#productosRutaDirectorio = "archivos";
    this.#productosRutaArchivo =
      this.#productosRutaDirectorio + "/productos.json";
    this.#fs = fs;
  }
  /* Método Crear directorio y verificar existencia de archivo
   *
   *
   */
  createDir = async () => {
    try {
      await this.#fs.promises.mkdir(this.#productosRutaDirectorio, {
        recursive: true,
      });
      if (!this.#fs.existsSync(this.#productosRutaArchivo)) {
        await this.#fs.promises.writeFile(this.#productosRutaArchivo, "[]");
      }
    } catch (error) {
      console.log("error creando directorio y archivo", error);
      throw ("error creando directorio y archivo", error);
    } finally {
    }
  };

  /* Método Add Products: agrega productos al archivo
   *
   *
   */
  addProduct = async (
    title,
    price,
    code,
    stock,
    description,
    status,
    thumb
  ) => {
    if (!title || !price || !code || !stock || !description || !status) {
      let msj = `Al producto con nombre ${title} le faltan uno o más datos y no será agregado \n`;
      return msj;
    }

    let productoNuevo = new Producto(
      title,
      price,
      code,
      stock,
      description,
      status,
      thumb
    );

    try {
      const existentes = await this.getProducts();
      console.log(existentes);
      console.log(this.#productos);
      if (
        existentes.find(
          (cadaproducto) => cadaproducto.code === productoNuevo.code
        )
      ) {
        let msj = `El producto con código ${productoNuevo.code} ya está en el archivo y no será agregado\n`;
        return msj;
      } else {
        let maxID = 0;

        if (existentes.length > 0) {
          const arrayDeID = existentes.map((producto) => producto.id);
          maxID =
            arrayDeID.length > 1
              ? arrayDeID.reduce((a, b) => Math.max(a, b))
              : arrayDeID[0];
        }
        this.#productos.push({
          ...productoNuevo,
          id: maxID + 1,
        });

        await this.#fs.promises.writeFile(
          this.#productosRutaArchivo,
          JSON.stringify(this.#productos, null, 2, "\t")
        );
        let msj = `El producto con código ${productoNuevo.code} fue agregado con éxito\n\n`;
        return msj;
      }
    } catch (error) {
      console.error(
        `Error creando el producto nuevo: ${JSON.stringify(
          productoNuevo
        )}, detalle del error: ${error}`
      );
      throw new Error(
        `Error creando producto nuevo: ${JSON.stringify(
          productoNuevo
        )}, detalle del error: ${error}`
      );
    }
  };
  /* Método getProducts: Leer archivo y obtener productos
   *
   *
   */
  getProducts = async () => {
    try {
      await this.createDir();
      let productosLeidos = await this.#fs.promises.readFile(
        this.#productosRutaArchivo,
        "utf-8"
      );
      this.#productos = JSON.parse(productosLeidos);
      return this.#productos;
    } catch (error) {
      console.error(`Error leyendo los productos, detalle del error: ${error}`);
      throw Error(`Error leyendo los productos, detalle del error: ${error}`);
    }
  };
  /* Método getProductByID: Leer archivo y ver si existe producto con determinado id
   *
   *
   */
  getProductByID = async (id) => {
    try {
      const productosObtenidos = await this.getProducts();

      const productoEncontrado = await productosObtenidos.find(
        (cadaproducto) => cadaproducto.id === id
      );
      if (productoEncontrado) {
        return productoEncontrado;
      } else {
        throw `No existe ningún producto con id = ${id}`;
      }
    } catch (error) {
      return `Error leyendo los productos en get product by id, detalle del error: ${error}`;
    }
  };

  /* Método deleteProductByID: Borrar producto con un id determinado
   *
   *
   */
  deleteProductByID = async (id) => {
    try {
      const productoAborrar = await this.getProductByID(id);
      if (productoAborrar) {
        console.log(productoAborrar);
        this.#productos.splice(this.#productos.indexOf(productoAborrar), 1);
        await this.#fs.promises.writeFile(
          this.#productosRutaArchivo,
          JSON.stringify(this.#productos, null, 2, "\t")
        );

        let msj = `El producto con id ${id} fue borrado con éxito\n\n`;
        return msj;
      } else {
        throw "No existe el producto con el id indicado";
      }
    } catch (error) {
      return `error al tratar de borrar el producto, detalle del error: ${error}`;
    }
  };

  /* Método updateProductByID: Modificar producto con un id determinado
   *
   *
   */
  updateProductByID = async (id, propiedad, nuevoValor) => {
    try {
      const productoAmodificar = await this.getProductByID(id);

      if (productoAmodificar) {
        const indice = this.#productos.indexOf(productoAmodificar);
        this.#productos[indice][propiedad] = nuevoValor;
        await this.#fs.promises.writeFile(
          this.#productosRutaArchivo,
          JSON.stringify(this.#productos, null, 2, "\t")
        );
        let msj = `El producto con id ${id} fue modificado con éxito\n\n`;
        return msj;
      } else {
        throw "No existe un producto con el id indicado";
      }
    } catch (error) {
      return `Error al tratar de modificar el producto.\nDetalle del error: ${error}`;
    }
  };
}

export default ProductManager;
