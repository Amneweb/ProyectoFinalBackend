import CategoryManager from "../services/categories.service.js";
import CustomRouter from "./custom/custom.router.js";
export default class CategoriesRouter extends CustomRouter {
  init() {
    const categoryManager = new CategoryManager();
    this.get("/", ["PUBLIC"], async (req, res) => {
      try {
        const categorias = await categoryManager.getCategories();

        return res.send(categorias);
      } catch (e) {
        res.status(500).send(e.message);
      }
    });

    this.post("/", ["ADMIN"], async (req, res) => {
      const nuevaCate = req.body.cate;

      try {
        const agregada = await categoryManager.addCategory(nuevaCate);

        if (agregada) {
          res.sendSuccess(agregada);
        } else {
          throw new Error(
            `Tuvimos problemas para agregar la categoría ${error.message}`
          );
        }
      } catch (e) {
        res.status(500).send(e.message);
      }
    });
  }
}
