import { cartModel } from "./carts.model.js";

class CartDAO {
  #model;
  constructor() {
    this.#model = cartModel;
  }

  create = async (carrito) => {
    return await this.#model.create(carrito);
  };

  findAll = async () => {
    return await this.#model.find().lean();
  };

  findAndPopulateAll = async (property, paths) => {
    return await this.#model.find().populate(property, paths).lean();
  };

  findByID = async (id) => {
    return await this.#model.findById(id).lean();
  };
  findAndPopulate = async (id, property, paths) => {
    return await this.#model.findById(id).populate(property, paths);
  };

  update = async (id, filter) => {
    return await this.#model.updateOne(
      { _id: id },
      { $set: filter },
      { new: true }
    );
  };

  delete = async (id) => {
    return await this.#model.deleteOne({ _id: id });
  };
}

export default CartDAO;
