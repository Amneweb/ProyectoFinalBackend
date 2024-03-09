import { Router } from "express";
import { uploader } from "../../utils.js";
import ProductManager from "../services/db/products.db.service.js";
import {
  validateProduct,
  validatePartialProduct,
} from "../services/product.validator.js";
import pc from "picocolors";
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
    res.send(await productManager.getProductByID(req.params.id));
  } catch (e) {
    res.status(400).send(e.message);
  }
});

//router.post("/", uploader.single("thumb"), async (req, res) => {
//let thumb = new Array();
//req.file && thumb.push(req.file.path.replaceAll(" ", "%20"));
router.post("/", async (req, res) => {
  const result = validateProduct(req.body);
  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  } else
    try {
      res.send(await productManager.addProduct(result.data));
    } catch (e) {
      res.status(500).send(e.message);
    }
});

router.delete("/:id", async (req, res) => {
  try {
    res.send(await productManager.deleteProduct(req.params.id));
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.put("/:id", async (req, res) => {
  const nuevo = validatePartialProduct(req.body);
  if (nuevo.error) {
    return res.status(400).json({ error: JSON.parse(nuevo.error.message) });
  } else
    try {
      res.send(await productManager.updateProduct(req.params.id, nuevo.data));
    } catch (e) {
      res.status(400).send(e.message);
    }
});

router.post("/imagenes/:id", uploader.single("file"), async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .send({ status: "error", mensaje: "No se adjunto archivo." });
  }

  try {
    res.send(
      await productManager.uploadThumbByID(
        parseInt(req.params.id),
        req.file.path
      )
    );
  } catch (e) {
    res.status(500).send(e.message);
  }
});
export default router;
