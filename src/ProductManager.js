import fs from "fs";
class Producto {
  constructor(title, price, code, stock, description, thumb) {
    this.title = title;
    this.price = price;
    this.code = code;
    this.stock = stock;
    this.description = description;
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
  addProduct = async (title, price, code, stock, description, thumb) => {
    if (!title || !price || !code || !stock || !description || !thumb) {
      return console.log(
        `Al producto con nombre ${title} le faltan uno o más datos y no será agregado \n`
      );
    }

    let productoNuevo = new Producto(
      title,
      price,
      code,
      stock,
      description,
      thumb
    );

    try {
      await this.getProducts();

      if (
        this.#productos.find(
          (cadaproducto) => cadaproducto.code === productoNuevo.code
        )
      ) {
        let msj = `El producto con código ${productoNuevo.code} ya está en el archivo y no será agregado\n`;
        return msj;
      } else {
        let maxID = 0;

        if (this.#productos.length > 0) {
          const arrayDeID = this.#productos.map((producto) => producto.id);
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
        console.log(
          `El producto con código ${productoNuevo.code} fue agregado con éxito\n\n`
        );
      }
    } catch (error) {
      console.error(
        `Error creando el producto nuevo: ${JSON.stringify(
          productoNuevo
        )}, detalle del error: ${error}`
      );
      throw Error(
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

      return JSON.parse(productosLeidos);
    } catch (error) {
      console.error(
        `Dentro de getProducts: Error leyendo los productos, detalle del error: ${error}`
      );
      throw Error(
        `Dentro de getProducts: Error leyendo los productos, detalle del error: ${error}`
      );
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
        return `No existe ningún producto con id = ${id}`;
      }
    } catch (error) {
      console.error(
        `Error leyendo los productos en get product by id, detalle del error: ${error}`
      );
      throw Error(
        `Error leyendo los productos en get product by id, detalle del error: ${error}`
      );
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
        this.#productos.splice(this.#productos.indexOf(productoAborrar), 1);
        await this.#fs.promises.writeFile(
          this.#productosRutaArchivo,
          JSON.stringify(this.#productos, null, 2, "\t")
        );
        console.log(`El producto con id ${id} fue borrado con éxito\n\n`);
      } else {
        console.log("no existe el id indicado");
      }
    } catch (error) {
      console.log(
        `error al tratar de borrar el producto, detalle del error: ${error}`
      );
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
        console.log(`El producto con id ${id} fue modificado con éxito\n\n`);
      } else {
        console.log("no existe el id indicado");
      }
    } catch (error) {
      console.log(
        `error al tratar de modificar el producto, detalle del error: ${error}`
      );
    }
  };
}

export default ProductManager;
