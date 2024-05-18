import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import pc from "picocolors";
class Producto {
  constructor(title, price, code, stock, description, status, category, thumb) {
    this.title = title;
    this.price = price;
    this.code = code;
    this.stock = stock;
    this.description = description;
    this.status = status ? status : true;
    this.category = category;
    this.thumb = thumb;
  }
}

class ProductManagerFS {
  #productos;
  #productosRutaDirectorio;
  #productosRutaArchivo;
  #fs;

  constructor() {
    this.#productos = [];
    this.#productosRutaDirectorio = "src/files";
    this.#productosRutaArchivo =
      this.#productosRutaDirectorio + "/productos.json";
    this.#fs = fs;
  }
  /*=============================================
=             Crear directorio                =
=============================================*/
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
    }
  };
  /*=============================================
=     Crear un producto (con imagen)          =
=============================================*/
  addProduct = async (product) => {
    console.log(pc.bgBlue("lo que llega a add product"));
    console.log(product);
    const { title, price, code, stock, description, status, category, thumb } =
      product;
    let productoNuevo = new Producto(
      title,
      price,
      code,
      stock,
      description,
      status,
      category,
      thumb
    );
    console.log(pc.bgYellow("producto nuevo dentro de add product"));
    console.log(productoNuevo);
    try {
      const existentes = await this.getProducts();

      if (
        existentes.find(
          (cadaproducto) => cadaproducto.code === productoNuevo.code
        )
      ) {
        throw new Error(
          `El producto con código ${productoNuevo.code} ya está en el archivo y no será agregado\n`
        );
      } else {
        const newID = uuidv4();
        console.log(pc.bgGreen("id generado con uuid " + newID));
        this.#productos.push({
          ...productoNuevo,
          id: newID,
        });

        await this.#fs.promises.writeFile(
          this.#productosRutaArchivo,
          JSON.stringify(this.#productos, null, 2, "\t")
        );
        let msj = `El producto fue agregado con éxito con id = ${newID} \n\n`;
        return msj;
      }
    } catch (error) {
      throw new Error(
        `Error creando producto nuevo: ${JSON.stringify(
          productoNuevo
        )}, detalle del ${error}`
      );
    }
  };
  /*=============================================
=             Obtener productos               =
=============================================*/
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
      throw new Error(
        `Error leyendo los productos, detalle del error: ${error}`
      );
    }
  };
  /*=============================================
=          Obtener 1 producto según ID        =
=============================================*/
  getProductByID = async (id) => {
    const productosObtenidos = await this.getProducts();

    const productoEncontrado = await productosObtenidos.find(
      (cadaproducto) => cadaproducto.id === id
    );
    if (productoEncontrado) {
      return productoEncontrado;
    } else {
      throw new Error(`No existe ningún producto con id = ${id}`);
    }
  };
  /*=============================================
=         Borrar producto según ID            =
=============================================*/
  deleteProduct = async (id) => {
    try {
      const productoAborrar = await this.getProductByID(id);
      if (productoAborrar) {
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
      throw new Error(
        `error al tratar de borrar el producto, detalle del ${error}`
      );
    }
  };
  /*=============================================
=        Modificar producto por ID            =
=============================================*/
  updateProduct = async (id, nuevo) => {
    try {
      const productoAmodificar = await this.getProductByID(id);

      if (productoAmodificar) {
        const indice = this.#productos.indexOf(productoAmodificar);
        this.#productos[indice] = { ...nuevo, id: id };
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

  //FIXME: no utilizado
  /*=============================================
=       Agregar 1 imagen a producto           =
=============================================*/
  uploadThumbByID = async (id, file) => {
    try {
      const productoAmodificar = await this.getProductByID(id);
      console.log(
        "producto cuya imagen se está agregando ",
        productoAmodificar
      );
      if (productoAmodificar) {
        const indice = this.#productos.indexOf(productoAmodificar);
        this.#productos[indice].thumb.push(file.replaceAll(" ", "%20"));
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
export default ProductManagerFS;
