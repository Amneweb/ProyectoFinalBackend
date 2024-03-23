import { Router } from "express";
import CategoryManager from "../services/db/categories.db.service.js";
const router = Router();
let categoryManager = new CategoryManager();
router.get("/", async (req, res) => {
  try {
    const categorias = await categoryManager.getCategories();

    return res.send(categorias);
  } catch (e) {
    res.status(500).send(e.message);
  }
});

router.post("/", async (req, res) => {
  const nuevaCate = req.body.cate;
  console.log("nuevaCate en router", nuevaCate);
  try {
    await categoryManager.addCategory(nuevaCate);
    res.send("<p>La categoría se agregó con éxito</p>");
  } catch (e) {
    res.status(500).send(e.message);
  }
});
export default router;
