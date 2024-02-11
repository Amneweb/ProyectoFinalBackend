import { Router } from "express";
import { uploader } from "../../utils.js";
import ProductManager from "../scripts/ProductManager.js";
const router = Router();

let productManager = new ProductManager();
router.get("/", async (req, res) => {
  let limite = req.query.limit;
  if (limite) {
    const productosObtenidos = await productManager.getProducts();
    res.send(productosObtenidos.slice(0, limite));
  } else {
    const productosObtenidos = await productManager.getProducts();
    res.send(productosObtenidos);
  }
});
router.get("/:id", async (req, res) => {
  res.send(await productManager.getProductByID(parseInt(req.params.id)));
});

router.post("/", async (req, res) => {
  const { title, price, code, stock, description, status, category, thumb } =
    req.body;
  console.log(title, price, code, stock, description, status, category, thumb);

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
});

router.delete("/:id", async (req, res) => {
  res.send(await productManager.deleteProductByID(parseInt(req.params.id)));
});

router.put("/:id", async (req, res) => {
  let propiedad = req.body.propiedad;
  let valor = req.body.valor;
  res.send(
    await productManager.updateProductByID(
      parseInt(req.params.id),
      propiedad,
      valor
    )
  );
});

router.post("/imagenes/:id", uploader.single("file"), async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .send({ status: "error", mensaje: "No se adjunto archivo." });
  }

  res
    .status(200)
    .send(
      await productManager.uploadThumbByID(
        parseInt(req.params.id),
        req.file.path
      )
    );
});
export default router;
