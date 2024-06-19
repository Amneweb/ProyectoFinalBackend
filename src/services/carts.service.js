import { cartDAO, productDAO } from "../utils/factory.js";
import TicketDAO from "./daos/mongo/tickets/tickets.mongo.dao.js";
import { BadRequestError } from "../utils/errors.js";
import { v4 as uuidv4 } from "uuid";
import { validateId, validateCartOwnership } from "./validators.service.js";
import { cartsLogger as logger } from "../config/logger.config.js";
import UserDAO from "./daos/mongo/users/users.mongo.dao.js";
import MailingService from "./emails.service.js";
import pc from "picocolors";
class CartManager {
  constructor() {
    this.ticketDAO = new TicketDAO();
    this.userDAO = new UserDAO();
    this.mailer = new MailingService();
  }

  //carrito vacío
  addCart = async () => {
    let newCarrito = {
      products: [],
    };
    return await cartDAO.create(newCarrito);
  };
  //obtener carritos
  getCarts = async () => {
    return await cartDAO.findAll();
  };
  //obtener carrito con id determinado, sólo para ADMIN o usuarios que son dueños del carrito
  getCartByID = async (id, user) => {
    if (!validateId(id)) {
      throw new BadRequestError(`El id ${id} no corresponde a un id válido`);
    }
    if (user.role.toUpperCase() != "ADMIN") {
      const validatedCart = await validateCartOwnership(id, user.email);

      if (!validatedCart) {
        throw new BadRequestError(
          `El usuario con email ${user.email} no es propietario del carrito con id ${id}`
        );
      }
    }
    return await cartDAO.findByID(id);
  };
  updateCart = async (id, nuevoCarrito) => {
    if (!validateId(id)) {
      throw new BadRequestError(`El id ${id} no corresponde a un id válido`);
    }
    const existe = await cartDAO.findByID(id);
    if (!existe) {
      throw new BadRequestError(`No existe ningún carrito con el id ${id}`);
    }

    return await cartDAO.update(id, nuevoCarrito);
  };

  //agregar producto a un carrito específico
  addProductToCartID = async (cid, pid, user) => {
    logger.debug(
      "En carts service | Id de carrito: %s, Id de producto: %s",
      cid,
      pid
    );
    if (user.role.toUpperCase() != "ADMIN") {
      const validatedCart = await validateCartOwnership(cid, user.email);

      if (!validatedCart) {
        throw new BadRequestError(
          `El usuario con email ${user.email} no es propietario del carrito con id ${cid}`
        );
      }
    }
    if (!validateId(cid)) {
      throw new BadRequestError(
        `El id ${pid} del carrito buscado no corresponde a un id válido`
      );
    }
    if (!validateId(pid)) {
      throw new BadRequestError(
        `El id ${pid} del producto buscado no es válido`
      );
    }

    let carritoBuscado = await cartDAO.findByID(cid);

    if (!carritoBuscado) {
      throw new BadRequestError(`No se encontró ningún carrito con id ${cid}`);
    }
    const producto = await productDAO.findByID(pid);

    //para verificar que exista un producto con ese id
    if (!producto) {
      console.log("adentro de if producto ");
      throw new BadRequestError(`No existe ningún producto con id ${pid}`);
    }
    if (user.role.toUpperCase() === "PREMIUM" && producto.owner) {
      const userData = await this.userDAO.findOne(user.email);
      const userID = userData && userData._id;
      console.log("ID de usuario", userID);
      console.log("owner de producto ", producto.owner);
      if (producto.owner.toString() === userID.toString())
        throw new BadRequestError(
          `El usuario con email ${user.email} es dueño del producto con SKU ${producto.code} y por lo tanto no lo puede comprar`
        );
    }
    const mapeado = carritoBuscado.cart.map((item) => item.product.toString());

    const equalsPid = (element) => element === pid.toString();
    const productIndex = mapeado.findIndex(equalsPid);

    console.log("product index", productIndex);
    if (productIndex === -1) {
      carritoBuscado.cart.push({ product: pid, qty: 1 });
    } else {
      carritoBuscado.cart[productIndex].qty++;
    }
    logger.debug(
      "carrito buscado luego de la transformacion %j",
      carritoBuscado
    );

    return await cartDAO.update(cid, carritoBuscado.cart);
  };

  //borrar carrito
  deleteFullCartByID = async (id, user) => {
    if (!validateId(id)) {
      throw new BadRequestError(
        `El id ${id} del carrito buscado no corresponde a un id válido`
      );
    }
    const carritoBuscado = await cartDAO.findByID(id);
    if (!carritoBuscado) {
      throw new BadRequestError("El carrito buscado no existe");
    }
    if (user.role.toUpperCase() != "ADMIN") {
      const validatedCart = await validateCartOwnership(id, user.email);

      if (!validatedCart) {
        throw new BadRequestError(
          `El usuario con email ${user.email} no es propietario del carrito con id ${id}`
        );
      }
    }
    return await cartDAO.delete(id);
  };

  //borrar producto de un carrito específico (cualquiera sea la cantidad)
  deleteProductFromCart = async (id, productID) => {
    if (!validateId(id)) {
      throw new BadRequestError(
        `El id ${id} del carrito buscado no corresponde a un id válido`
      );
    }
    if (!validateId(productID)) {
      throw new BadRequestError(
        `El id ${productID} del producto buscado no es válido`
      );
    }
    let carritoBuscado = await cartDAO.findByID(id);

    if (!carritoBuscado) {
      throw new BadRequestError("Carrito no encontrado");
    }
    if (user.role.toUpperCase() != "ADMIN") {
      const validatedCart = await validateCartOwnership(id, user.email);

      if (!validatedCart) {
        throw new BadRequestError(
          `El usuario con email ${user.email} no es propietario del carrito con id ${id}`
        );
      }
    }
    const productIndex = carritoBuscado.cart.findIndex(
      (productItem) => productItem.product._id.toString() === productID
    );

    if (productIndex === -1) {
      throw new BadRequestError("el producto indicado no existe en el carrito");
    }
    carritoBuscado.cart.splice(productIndex, 1);

    return await cartDAO.update(id, carritoBuscado);
  };

  //borrar producto de un carrito específico (uno por uno)
  deleteOneProduct = async (cid, pid, qty, user) => {
    if (!validateId(cid)) {
      throw new BadRequestError(
        `El id ${cid} del carrito buscado no corresponde a un id válido`
      );
    }
    if (!validateId(pid)) {
      throw new BadRequestError(
        `El id ${pid} del producto buscado no es válido`
      );
    }
    let carritoBuscado = await cartDAO.findByID(cid);

    if (!carritoBuscado) {
      throw new BadRequestError("Carrito no encontrado");
    }
    const validatedCart = await validateCartOwnership(cid, user.email);

    if (!validatedCart) {
      throw new BadRequestError(
        `El usuario con email ${user.email} no es propietario del carrito con id ${cid}`
      );
    }

    const productIndex = carritoBuscado.cart.findIndex(
      (productItem) => productItem.product.toString() === pid
    );

    if (productIndex === -1) {
      throw new BadRequestError("el producto indicado no existe en el carrito");
    }

    const inCartQty = carritoBuscado.cart[productIndex].qty;
    console.log("productIndex ", productIndex);
    console.log("inCartQty ", inCartQty);
    console.log("qty ", qty);
    if (qty != "" && qty < inCartQty && qty > 0) {
      carritoBuscado.cart[productIndex].qty = inCartQty - qty;

      console.log("newQty ", carritoBuscado.cart[productIndex].qty);
    } else {
      carritoBuscado.cart.splice(productIndex, 1);
    }
    console.log("nuevo carrito");
    console.log(carritoBuscado);
    return await cartDAO.update(cid, carritoBuscado.cart);
  };

  purchase = async (user, cid) => {
    const carritoComprado = await cartDAO.findAndPopulate(cid);
    logger.debug("carrito comprado luego del populate %j", carritoComprado);
    if (!carritoComprado) {
      logger.error("no se encontró el carrito buscado");
      throw new BadRequestError("No se encontró el carrito buscado");
    }
    if (user.role.toUpperCase() != "ADMIN") {
      const validatedCart = await validateCartOwnership(cid, user.email);

      if (!validatedCart) {
        throw new BadRequestError(
          `El usuario con email ${user.email} no es propietario del carrito con id ${cid}`
        );
      }
    }
    let carritoRemanente = [];

    //verificamos stock, creamos el array "order" y calculamos el total
    let order = [];
    let amount = 0;

    console.log("carrito comprado ", carritoComprado.cart);

    carritoComprado.cart.forEach((producto) => {
      const stock = producto.product.stock;
      const precio = producto.product.price;
      const compra = producto.qty;
      if (stock < compra) {
        carritoRemanente.push({
          product: producto._id,
          qty: compra - stock,
        });
        order.push({ product: producto._id, qty: stock });
        amount += stock * precio;
      } else {
        order.push({ product: producto._id, qty: compra });
        amount += precio * compra;
      }
    });

    if (carritoRemanente.length > 0) {
      const carritoActualizado = await cartDAO.update(cid, carritoRemanente);
    } else {
      console.log("lo que mando al user manager", user.email);

      await this.userDAO.update(user.email);
      await cartDAO.delete(cid);
    }

    const ticket = {
      order: order,
      amount: amount,
      purchaser: user.email,
      code: uuidv4(),
    };

    console.log(pc.bgRed("ticket a enviar"));

    const ticketCreado = await this.ticketDAO.create(ticket);

    const html = `<div><h3> Código de tu compra: ${ticketCreado.code} </h3><p>Total de la compra: ${ticketCreado.amount}</p><p>Fecha de compra: ${ticketCreado.purchase_datetime} </p></div>`;
    const mailOptions = {
      to: ticketCreado.purchaser,
      subject: "Gracias por comprar en Baterías Windward",
      html: html,
      attachments: [],
    };

    await this.mailer.sendEmail({ ...mailOptions });
    return ticketCreado;
  };
}

export default CartManager;
