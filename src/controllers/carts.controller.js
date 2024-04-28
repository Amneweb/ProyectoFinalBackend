import CartManager from "../services/daos/carts/carts.service.js";

export default class CartController {
  #cartManager;
  constructor() {
    this.#cartManager = new CartManager();
  }
  getOne = async (req, res) => {
    try {
      res.send(await this.#cartManager.getCartByID(req.params.cid));
    } catch (e) {
      res.status(404).send(e.message);
    }
  };

  postOne = async (req, res) => {
    const carritoCreado = await this.#cartManager.addCart();
    res.send(carritoCreado);
  };

  addToCart = async (req, res) => {
    const cartID = req.params.cid;
    const prodID = req.params.pid;

    try {
      res.send(await this.#cartManager.addProductToCartID(cartID, prodID));
    } catch (e) {
      throw e;
    }
  };
  deleteCart = async (req, res) => {
    res.send(await this.#cartManager.deleteFullCartByID(req.params.id));
  };
  deleteProduct = async (req, res) => {
    const cartID = req.params.cid;
    const prodID = req.params.pid;

    try {
      res.send(await this.#cartManager.deleteProductFromCart(cartID, prodID));
    } catch (e) {
      throw e;
    }
  };
}
