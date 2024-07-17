import productModel from "./products.model.js";

class ProductDAO {
  #model;
  constructor() {
    this.#model = productModel;
  }

  find = async (options, conditions) => {
    const products = await this.#model.paginate(conditions, {
      ...options,
      lean: true,
    });
    return products;
  };

  create = async ({ ...arg }) => {
    return await this.#model.create({
      ...arg,
    });
  };
  findByID = async (id) => {
    return await this.#model.findById(id).lean();
  };
  findOne = async (filters) => {
    return await this.#model.findOne(filters).lean();
  };
  delete = async (id) => {
    const result = await this.#model.deleteOne({ _id: id });
    return result;
  };
  replace = async (id, nuevo) => {
    const result = await this.#model.replaceOne({ _id: id }, nuevo, {
      new: true,
    });

    return result;
  };
  update = async (id, filters) => {
    return await this.#model.findOneAndUpdate(
      {
        _id: id,
      },
      { $set: { ...filters } },
      { new: true }
    );
  };
}
export default ProductDAO;
