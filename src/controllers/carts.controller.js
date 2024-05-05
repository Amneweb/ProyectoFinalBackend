import CartManager from "../services/daos/carts/carts.service.js";
import ProductManager from "../services/daos/products/products.service.js";
import TicketManager from "../services/daos/tickets/tickets.service.js";
import pc from "picocolors";
import { v4 as uuidv4 } from "uuid";
export default class CartController {
  #cartManager;
  #productManager;
  #ticketManager;
  constructor() {
    this.#cartManager = new CartManager();
    this.#productManager = new ProductManager();
    this.#ticketManager = new TicketManager();
  }
  getOne = async (req, res) => {
    try {
      res.send(await this.#cartManager.getCartByID(req.params.cid));
    } catch (e) {
      res.status(404).send(e.message);
    }
  };
  getCarts = async (req, res) => {
    try {
      res.send(await this.#cartManager.getCarts());
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
  purchase = async (req, res) => {
    console.log("adentro de purchase controller");
    const user = req.user;
    console.log(pc.yellow("user " + user.email));
    console.log(pc.green("id del carrito a comprar " + req.params.cid));
    try {
      const carrito = await this.#cartManager.getCartByID(req.params.cid);
      console.log(pc.red("carrito encontrado " + carrito.cart));
      const carritoRemanente = [...carrito.cart];
      console.log(pc.blue("carrito remanente " + carritoRemanente));
      //verificamos stock, creamos el array "order" y calculamos el total
      const order = [];
      const amount = 0;
      carrito.cart.forEach(async (producto) => {
        const stock = await this.#productManager.getProductByID(
          producto.product
        ).stock;
        console.log(pc("stock de cada producto en el carrito " + stock));
        if (stock < producto.qty) {
          const pos = carritoRemanente.findIndex(
            (elemento) => elemento.product === producto.product
          );
          carritoRemanente.splice(pos, 1);
          carritoRemanente.push({
            product: producto.product,
            qty: producto.qty - stock,
          });
          order.push({ product: producto.product, qty: stock });
          amount += stock * producto.price;
        } else {
          order.push({ product: producto.product, qty: producto.qty });
          amount += producto.price * producto.qty;
        }
      });
      const newCarrito = await carritoRemanente.save();
      console.log(newCarrito);
      const ticket = {
        order: order,
        amount: amount,
        purchaser: user.email,
        code: uuidv4(),
      };
      res.send(await this.#ticketManager.createTicket(ticket));
    } catch (e) {}
  };
}
