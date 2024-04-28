import { uploader, validateModifiedData } from "../../utils.js";
import { validateFormData } from "../../utils.js";
import CustomRouter from "./custom/custom.router.js";
import ProductManager from "../services/db/products.db.service.js";

export default class ProductsRouter extends CustomRouter {
  init() {
    // Todas las req/res van dentro de este init()

    // Se instancia el service UserService
    const productManager = new ProductManager();
    console.log("en clase products admin");

    this.get("/", ["PUBLIC"], async (req, res) => {
      let limite = parseInt(req.query.limite);
      limite = limite < 0 || isNaN(limite) ? false : limite;

      try {
        const productosObtenidos = await productManager.getProducts();

        if (limite) {
          return res.send(productosObtenidos.slice(0, limite));
        } else {
          return res.send(productosObtenidos);
        }
      } catch (e) {
        res.status(500).send(e.message);
      }
    });
    this.get("/:id", ["PUBLIC"], async (req, res) => {
      try {
        const result = await productManager.getProductByID(req.params.id);
        if (!result) {
          const mensaje = `no se encontró ningún producto con el ID ${req.params.id}`;
          throw new Error(mensaje);
        }
        res.status(201).send(result);
      } catch (e) {
        res.status(422).send({ message: e.message });
      }
    });

    this.post(
      "/",
      ["ADMIN", "PREMIUM"],
      uploader.single("imagen"),
      validateFormData,
      async (req, res) => {
        if (req.validatedData.error) {
          return res
            .status(400)
            .json({ error: JSON.parse(req.validatedData.error.message) });
        }
        try {
          let imagen = [];
          req.validatedData.data.thumb &&
            imagen.push(req.validatedData.data.thumb);
          await productManager.addProduct({
            ...req.validatedData.data,
            thumb: imagen,
          });
          res.redirect("/home/");
        } catch (e) {
          res.status(500).send(e.message);
        }
      }
    );

    this.delete("/:id", ["ADMIN", "PREMIUM"], async (req, res) => {
      try {
        res.send(await productManager.deleteProduct(req.params.id));
      } catch (e) {
        res.status(400).send(e.message);
      }
    });

    this.put(
      "/:id",
      ["ADMIN", "PREMIUM"],
      validateModifiedData,
      async (req, res) => {
        const nuevo = req.validatedData;

        if (nuevo.error) {
          return res
            .status(400)
            .json({ error: JSON.parse(nuevo.error.message) });
        } else
          try {
            res.send(
              await productManager.updateProduct(req.params.id, nuevo.data)
            );
          } catch (e) {
            res.status(400).send(e.message);
          }
      }
    );

    this.put("/:id/categoria/:cate", ["ADMIN", "PREMIUM"], async (req, res) => {
      try {
        res.send(
          await productManager.deleteProductCategory(
            req.params.id,
            req.params.cate
          )
        );
      } catch (e) {
        res.status(400).send(e.message);
      }
    });

    this.post(
      "/imagenes/",
      ["ADMIN", "PREMIUM"],
      uploader.single("imagen"),
      validateModifiedData,
      async (req, res) => {
        const id = req.body.IDproducto;
        if (!req.file) {
          return res
            .status(400)
            .send({ status: "error", mensaje: "No se adjunto archivo." });
        }

        try {
          let imagen = [];
          req.validatedData.data.thumb &&
            imagen.push(req.validatedData.data.thumb);
          res.send(await productManager.updateProduct(id, { thumb: imagen }));
        } catch (e) {
          res.status(500).send(e.message);
        }
      }
    );
  }
}
