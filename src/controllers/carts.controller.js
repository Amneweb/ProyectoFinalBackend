import CartManager from "../services/daos/carts/carts.service.js";
import ProductManager from "../services/daos/products/products.service.js";
import TicketManager from "../services/daos/tickets/tickets.service.js";
import UserManager from "../services/daos/users/users.service.js";
import { sendEmail } from "../../utils.js";
import pc from "picocolors";
import { v4 as uuidv4 } from "uuid";
export default class CartController {
  #cartManager;
  #productManager;
  #ticketManager;
  #userManager;
  constructor() {
    this.#cartManager = new CartManager();
    this.#productManager = new ProductManager();
    this.#ticketManager = new TicketManager();
    this.#userManager = new UserManager();
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
    await this.#cartManager.addCart().then(async (result) => {
      const filter = "userCartID";
      const value = result._id;
      await this.#userManager.update(req.user, filter, value);
      res.send({ status: "success", payload: value });
    });
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
    const one = parseInt(req.query.qty) === 1 ? true : false;
    try {
      if (one) {
        res.send(await this.#cartManager.deleteOneProduct(cartID, prodID));
      } else {
        res.send(await this.#cartManager.deleteProductFromCart(cartID, prodID));
      }
    } catch (e) {
      throw e;
    }
  };
  purchase = async (req, res) => {
    const user = req.user;
    console.log("req completo ", req.params);
    console.log("en controller purchase");
    console.log(pc.bgGreen("req user " + req.user.email));
    console.log(pc.bgYellow("req id" + req.params.cid));
    try {
      await this.#cartManager
        .getCartByID(req.params.cid)
        .then(async (result) => {
          console.log(pc.bgGreen("carrito encontrado" + result));
          if (!result.success) {
            return res.send({ message: "no se encontró el carrito" });
          }

          let carritoRemanente = [];

          //verificamos stock, creamos el array "order" y calculamos el total
          let order = [];
          let amount = 0;
          console.log("carrito.data.cart");
          console.log(result.data.cart);

          await Promise.all(
            result.data.cart.map(async (producto) => {
              await this.#productManager
                .getProductByID(producto.product._id)
                .then((info) => {
                  const stock = info.stock;
                  const precio = info.price;
                  const compra = producto.qty;
                  console.log(
                    "dentro de map " + stock + " " + precio + " " + compra
                  );
                  if (stock < compra) {
                    carritoRemanente.push({
                      product: producto.product._id,
                      qty: compra - stock,
                    });
                    order.push({ product: producto.product._id, qty: stock });
                    amount += stock * precio;
                  } else {
                    order.push({ product: producto.product._id, qty: compra });
                    amount += precio * compra;
                  }
                });
            })
          )
            .then(async () => {
              let promise1;
              let promise2;
              if (carritoRemanente.length > 0) {
                promise1 = await this.#cartManager.updateCart(
                  req.params.cid,
                  carritoRemanente
                );
                promise2 = "";
              } else {
                console.log("lo que mando al user manager", user);
                const filter = "userCartID";
                const value = [];
                promise1 = this.#userManager.update(user, filter, value);
                promise2 = this.#cartManager.deleteFullCartByID(req.params.cid);
              }
              await Promise.all([promise1, promise2]);
            })
            .then(async () => {
              const ticket = {
                order: order,
                amount: amount,
                purchaser: user.email,
                code: uuidv4(),
              };
              console.log(pc.bgRed("ticket a enviar"));

              await this.#ticketManager
                .createTicket(ticket)
                .then(async (result) => {
                  sendEmail(result);
                  res.status(201).send({ status: "success", payload: result });
                });
            });
        });
    } catch (e) {}
  };
}
