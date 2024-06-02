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

  findByID = async (id) => {
    console.log("en dao find by id");
    return await this.#model.findById(id).lean();
  };
  update = async (id, nuevoCarrito) => {
    return await this.#model.updateOne(
      { _id: id },
      { $set: { cart: nuevoCarrito } }
    );
  };

  delete = async (id) => {
    return await this.#model.deleteOne({ _id: id });
  };
}

export default CartDAO;
