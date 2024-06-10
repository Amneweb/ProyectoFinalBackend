import productModel from "./products.model.js";

class ProductDAO {
  #model;
  constructor() {
    this.#model = productModel;
  }

  findAll = async (options) => {
    const products = await this.#model.paginate(
      {},
      {
        ...options,
        lean: true,
      }
    );

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
  deleteByID = async (id) => {
    const result = await this.#model.deleteOne({ _id: id });
    return result;
  };
  update = async (id, nuevo) => {
    const result = await this.#model.findOneAndUpdate({ _id: id }, nuevo, {
      new: true,
    });

    return result;
  };
}
export default ProductDAO;
