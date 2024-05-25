import categoriesModel from "./categories.model.js";

export default class CategoryManager {
  constructor() {}
  getCategories = async () => {
    const categories = await categoriesModel.find().lean();
    return categories;
  };

  addCategory = async (category) => {
    let categoriaNueva = await categoriesModel.create({ category });

    return categoriaNueva;
  };

  deleteCategory = async (id) => {
    let result = await categoriesModel.deleteOne({ _id: id });
    return result;
  };
}
