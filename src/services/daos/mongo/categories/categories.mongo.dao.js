import categoriesModel from "./categories.model.js";

class CategoryDAO {
  #model;
  constructor() {
    this.#model = categoriesModel;
  }
  findAll = async () => {
    return await this.#model.find().lean();
  };

  create = async (category) => {
    return await this.#model.create({ category });
  };

  delete = async (id) => {
    return await this.#model.deleteOne({ _id: id });
  };
}
export default CategoryDAO;
