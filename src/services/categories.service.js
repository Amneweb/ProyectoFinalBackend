import categoriesDAO from "./daos/mongo/categories/categories.mongo.dao.js";

export default class CategoryManager {
  constructor() {}
  getCategories = async () => {
    const categories = await categoriesDAO.findAll();
    return categories;
  };

  addCategory = async (category) => {
    let categoriaNueva = await categoriesDAO.create(category);

    return categoriaNueva;
  };

  deleteCategory = async (id) => {
    let result = await categoriesDAO.deleteOne(id);
    return result;
  };
}
