import cartDAO from "../utils/factory.js";
import productDAO from "../utils/factory.js";
import { BadRequestError } from "../utils/errors.js";
import { validateId } from "../utils/product.validator.js";
class CartManager {
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
  //obtener carrito con id determinado
  getCartByID = async (id) => {
    if (!validateId(id)) {
      throw new BadRequestError(`El id ${id} no corresponde a un id válido`);
    }
    return await cartDAO.findByID(id);
  };
  updateCart = async (id, nuevoCarrito) => {
    if (!validateId(id)) {
      throw new BadRequestError(`El id ${id} no corresponde a un id válido`);
    }
    const existe = await cartDAO.findById(id);
    if (!existe) {
      throw new BadRequestError(`No existe ningún carrito con el id ${id}`);
    }
    return await cartDAO.update(id, nuevoCarrito);
  };

  //agregar producto a un carrito específico
  addProductToCartID = async (id, productID) => {
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
    console.log("en add product to cart");

    let carritoBuscado = await cartDAO.findById(id);
    if (!carritoBuscado) {
      throw new BadRequestError(`No se encontró ningún carrito con id ${id}`);
    }
    const producto = await productDAO.findById(productID);

    //para verificar que exista un producto con ese id
    if (!producto) {
      console.log("adentro de if producto ");
      throw new BadRequestError(
        `No existe ningún producto con id ${productID}`
      );
    }

    const productIndex = carritoBuscado.cart.findIndex(
      (productItem) => productItem.product._id.toString() === productID
    );

    if (productIndex === -1) {
      carritoBuscado.cart.push({ product: productID, qty: 1 });
    } else {
      carritoBuscado.cart[productIndex].qty++;
    }

    return await cartDAO.update(id, carritoBuscado);
  };

  //borrar carrito
  deleteFullCartByID = async (id) => {
    if (!validateId(id)) {
      throw new BadRequestError(
        `El id ${id} del carrito buscado no corresponde a un id válido`
      );
    }
    const carritoBuscado = cartDAO.findById(id);
    if (!carritoBuscado) {
      throw new BadRequestError("El carrito buscado no existe");
    }
    return await cartDAO.deleteOne(id);
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
    let carritoBuscado = await cartDAO.findById(id);

    if (!carritoBuscado) {
      throw new BadRequestError("Carrito no encontrado");
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
  deleteOneProduct = async (id, productID) => {
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
    let carritoBuscado = await cartDAO.findById(id);

    if (!carritoBuscado) {
      throw new BadRequestError("Carrito no encontrado");
    }

    const productIndex = carritoBuscado.cart.findIndex(
      (productItem) => productItem.product._id.toString() === productID
    );

    if (productIndex === -1) {
      throw new BadRequestError("el producto indicado no existe en el carrito");
    }
    carritoBuscado.cart[productIndex].qty--;

    return await cartDAO.update(id, carritoBuscado);
  };

  purchase = async (cartID, user) => {
    const carritoComprado = await this.cartDAO
      .findById(cartID)
      .populate("cart.product", ["stock", "price"]);

    if (!carritoComprado) {
      throw new BadRequestError("No se encontró el carrito");
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
      const carritoActualizado = await this.cartDAO.updateCart(
        cartID,
        carritoRemanente
      );
    } else {
      console.log("lo que mando al user manager", user);
      const filter = "userCartID";
      const value = [];
      await this.userDAO.update(user, filter, value);
      await this.cartDAO.delete(cartID);
    }

    const ticket = {
      order: order,
      amount: amount,
      purchaser: user.email,
      code: uuidv4(),
    };

    console.log(pc.bgRed("ticket a enviar"));

    const ticketCreado = await this.ticketDAO.createTicket(ticket);
    return ticketCreado;
  };
}

export default CartManager;
