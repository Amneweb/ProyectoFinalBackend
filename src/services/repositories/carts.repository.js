import { cartDAO } from "../factory.js";
class CartRepository {
  constructor() {}

  updateFullCart = async (id, nuevoCarrito) => {
    const filter = { cart: nuevoCarrito };
    return await cartDAO.update(id, filter);
  };

  updateAndChangeDate = async (id, nuevoCarrito) => {
    const filter = {
      cart: nuevoCarrito,
      createdAt: new Date(date.setMonth(date.getMonth() + 1)),
    };
    return await cartDAO.update(id, filter);
  };
  findAndPopulate = async (id) => {
    const paths = ["stock", "price", "title", "thumb"];
    return await cartDAO.findAndPopulate(id, "cart.product", paths);
  };
  findAndPopulateAll = async () => {
    const paths = ["title", "price", "stock"];
    return await cartDAO.findAndPopulateAll("cart.product", paths);
  };
}

export default CartRepository;
