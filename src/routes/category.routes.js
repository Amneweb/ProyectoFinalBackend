import CategoryManager from "../services/categories.service.js";
import CustomRouter from "./custom/custom.router.js";
export default class CategoriesRouter extends CustomRouter {
  init() {
    const categoryManager = new CategoryManager();
    this.get("/", async (req, res) => {
      try {
        const categorias = await categoryManager.getCategories();

        return res.send(categorias);
      } catch (e) {
        res.status(500).send(e.message);
      }
    });

    this.post("/", async (req, res) => {
      const nuevaCate = req.body.cate;

      try {
        await categoryManager.addCategory(nuevaCate);
        res.send("<p>La categoría se agregó con éxito</p>");
      } catch (e) {
        res.status(500).send(e.message);
      }
    });
  }
}
