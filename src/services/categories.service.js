import CategoriesDAO from "./daos/mongo/categories/categories.mongo.dao.js";

export default class CategoryManager {
  constructor() {
    this.categoriesDAO = new CategoriesDAO();
  }
  getCategories = async () => {
    return await this.categoriesDAO.findAll();
  };

  addCategory = async (category) => {
    return await this.categoriesDAO.create(category);
  };

  deleteCategory = async (id) => {
    return await this.categoriesDAO.delete(id);
  };
}
