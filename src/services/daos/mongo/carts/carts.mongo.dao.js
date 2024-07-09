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

  findAndPopulateAll = async () => {
    return await this.#model
      .find()
      .populate("cart.product", ["title", "price", "stock"])
      .lean();
  };

  findByID = async (id) => {
    return await this.#model.findById(id).lean();
  };
  findAndPopulate = async (id) => {
    return await this.#model
      .findById(id)
      .populate("cart.product", ["stock", "price", "title", "thumb"]);
  };

  update = async (id, nuevoCarrito) => {
    return await this.#model.updateOne(
      { _id: id },
      { $set: { cart: nuevoCarrito } },
      { new: true }
    );
  };

  delete = async (id) => {
    return await this.#model.deleteOne({ _id: id });
  };
}

export default CartDAO;
