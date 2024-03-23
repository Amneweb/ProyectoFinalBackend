import categoriesModel from "./models/categories.model.js";
import pc from "picocolors";

export default class CategoryManager {
  constructor() {
    console.log(pc.blue("Dentro del controlador de las categorías"));
  }
  getCategories = async () => {
    const categories = await categoriesModel.find().lean();
    return categories;
  };

  addCategory = async (category) => {
    console.log("dentro del manager ", category);
    let categoriaNueva = await categoriesModel.create({ category });
    console.log("dentro del manager después del await", categoriaNueva);
    return categoriaNueva;
  };

  deleteCategory = async (id) => {
    let result = await categoriesModel.deleteOne({ _id: id });
    return result;
  };
}
