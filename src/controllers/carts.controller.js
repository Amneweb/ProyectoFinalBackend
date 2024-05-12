import CartManager from "../services/daos/carts/carts.service.js";
import ProductManager from "../services/daos/products/products.service.js";
import TicketManager from "../services/daos/tickets/tickets.service.js";
import UserManager from "../services/daos/users/users.service.js";
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
          ).then(async () => {
            const ticket = {
              order: order,
              amount: amount,
              purchaser: user.email,
              code: uuidv4(),
            };
            console.log(pc.bgRed("ticket a enviar"));

            res.send(await this.#ticketManager.createTicket(ticket));
          });
        });
    } catch (e) {}
  };

  purchasePrueba = async (req, res) => {
    const user = req.user;
    console.log("req completo ", req.params);
    console.log("en controller purchase");
    console.log(pc.bgGreen("req user " + req.user.email));
    console.log(pc.bgYellow("req id" + req.params.cid));
    try {
      const carrito = await this.#cartManager.getCartByID(req.params.cid);
      console.log(pc.bgGreen("carrito con toArray" + carrito));
      if (carrito.success) {
      } else {
        throw new Error("no se encontró ningún carrito guardado en la bdd");
      }
      let carritoRemanente = [];

      //verificamos stock, creamos el array "order" y calculamos el total
      let order = [];
      let amount = 0;
      console.log("carrito.data.cart");
      console.log(carrito.data.cart);
      carrito.data.cart.forEach(async (producto) => {
        console.log(pc.bgWhite("dentro del for each " + producto.product._id));
        const stock = await this.#productManager.getProductByID(
          producto.product._id
        );
        console.log(pc.yellow("stock de cada producto en el carrito "));
        console.log(stock.stock);
        console.log(pc.red("cantidad a comprar"));
        console.log(producto.qty);
        if (stock.stock < producto.qty) {
          carritoRemanente.push({
            product: producto.product._id,
            qty: producto.qty - stock.stock,
          });
          order.push({ product: producto.product._id, qty: stock.stock });
          amount += stock.stock * stock.price;
        } else {
          order.push({ product: producto.product._id, qty: producto.qty });
          amount += stock.price * producto.qty;
          console.log("amount " + amount);
          console.log(
            "precio " + stock.price + " producto.qty " + producto.qty
          );
          console.log(pc.bgWhite("a la orden"));
          console.log(order);
        }
      });
      if (carritoRemanente.length > 0) {
        await this.#cartManager.updateCart(req.params.cid, carritoRemanente);
      } else {
        const filter = "userCartID";
        const value = [];
        this.#cartManager.deleteFullCartByID(req.params.cid);
        this.#userManager.update(user, filter, value);
      }
      const ticket = {
        order: order,
        amount: amount,
        purchaser: user.email,
        code: uuidv4(),
      };
      console.log(pc.bgRed("ticket a enviar"));
      console.dir(ticket);
      res.send(await this.#ticketManager.createTicket(ticket));
    } catch (e) {}
  };
}
