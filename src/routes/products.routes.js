import { Router } from "express";
import { uploader } from "../../utils.js";
import ProductManager from "../scripts/ProductManager.js";
const router = Router();

let productManager = new ProductManager();
router.get("/", async (req, res) => {
  let limite = req.query.limit;

  try {
    if (limite) {
      if (limite < 0 || isNaN(limite)) {
        return res
          .status(400)
          .send(
            "el valor límite de productos a mostrar debe ser un número mayor a 0"
          );
      }
      const productosObtenidos = await productManager.getProducts();
      res.send(productosObtenidos.slice(0, limite));
    } else {
      const productosObtenidos = await productManager.getProducts();
      res.send(productosObtenidos);
    }
  } catch (e) {
    res.status(500).send(e.message);
  }
});
router.get("/:id", async (req, res) => {
  try {
    res.send(await productManager.getProductByID(parseInt(req.params.id)));
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post("/", uploader.single("thumb"), async (req, res) => {
  const { title, price, code, description, category } = req.body;
  const status = JSON.parse(req.body.status);
  const stock = JSON.parse(req.body.stock);
  let thumb = new Array();
  req.file && thumb.push(req.file.path.replaceAll(" ", "%20"));
  if (!title || !price || !code || !stock || !description || !status) {
    let msj = `Al producto con nombre ${title} le faltan uno o más datos y no será agregado \n`;
    return res.status(400).send(msj);
  }
  try {
    res.send(
      await productManager.addProduct(
        title,
        price,
        code,
        stock,
        description,
        status,
        category,
        thumb
      )
    );
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    res.send(await productManager.deleteProductByID(parseInt(req.params.id)));
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.put("/:id", async (req, res) => {
  let propiedad = req.body.propiedad;
  let valor = req.body.valor;
  try {
    res.send(
      await productManager.updateProductByID(
        parseInt(req.params.id),
        propiedad,
        valor
      )
    );
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
