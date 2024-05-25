import productModel from "./products.model.js";

class ProductDAO {
  #model;
  constructor() {
    this.#model = productModel;
  }

  findAll = async (page, limit, sort) => {
    const products = await this.#model.paginate(
      {},
      {
        page,
        limit,
        sort,
        lean: true,
      }
    );

    return products;
  };

  create = async ({
    title,
    description,
    code,
    price,
    category,
    thumb,
    status,
    stock,
  }) => {
    return await this.#model.create({
      title,
      description,
      code,
      price,
      category,
      thumb,
      status,
      stock,
    });
  };
  findByID = async (id) => {
    return await this.#model.findByID(id).lean();
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
