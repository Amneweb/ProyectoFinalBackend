import { Router } from "express";
import { uploader, validateModifiedData } from "../../utils.js";
import { validateFormData } from "../../utils.js";
import ProductManager from "../services/db/products.db.service.js";
const router = Router();
let productManager = new ProductManager();
router.get("/", async (req, res) => {
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
router.get("/:id", async (req, res) => {
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

router.post(
  "/",
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
      req.validatedData.data.thumb && imagen.push(req.validatedData.data.thumb);
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

router.delete("/:id", async (req, res) => {
  try {
    res.send(await productManager.deleteProduct(req.params.id));
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.put("/:id", validateModifiedData, async (req, res) => {
  const nuevo = req.validatedData;

  if (nuevo.error) {
    return res.status(400).json({ error: JSON.parse(nuevo.error.message) });
  } else
    try {
      res.send(await productManager.updateProduct(req.params.id, nuevo.data));
    } catch (e) {
      res.status(400).send(e.message);
    }
});

router.put("/:id/categoria/:cate", async (req, res) => {
  try {
    res.send(
      await productManager.deleteProductCategory(req.params.id, req.params.cate)
    );
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post(
  "/imagenes/",
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
      req.validatedData.data.thumb && imagen.push(req.validatedData.data.thumb);
      res.send(await productManager.updateProduct(id, { thumb: imagen }));
    } catch (e) {
      res.status(500).send(e.message);
    }
  }
);
export default router;
