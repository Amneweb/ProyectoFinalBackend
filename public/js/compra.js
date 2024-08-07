const carrito = JSON.parse(localStorage.getItem("windwardCart"));

const deslogueo = document.querySelector("#logout");
const loaderContainer = document.querySelector(".loader-container");
const displayLoading = () => {
  loaderContainer.style.display = "block";
};

const hideLoading = () => {
  loaderContainer.style.display = "none";
};
deslogueo.addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    await fetch("/api/users/logout", {
      method: "GET",
      headers: { "Content-type": "application/json" },
    });

    await Swal.fire({
      title: "Chau",
      text: "Te deslogueaste de forma exitosa",
    }).then((result) => {
      window.location.replace("/users/login");
    });
  } catch (e) {
    await Swal.fire({
      icon: "error",
      text: `Lo sentimos, hubo un error al desloguearte. Volvé a intentarlo. ${e.message} `,
    });
  }
});

const compra = async () => {
  try {
    const fetched = await fetch("/api/carts", {
      method: "POST",
      //credentials: "include",
      headers: { "Content-type": "application/json" },
    });
    const data = await fetched.json();

    if (data.error) {
      throw new Error(data.error);
    }
    const cid = data.payload.userCartID;

    const guardarProductos = async function () {
      try {
        for (let i = 0; i < carrito.length; i++) {
          const ruta = `/api/carts/${cid[0]}/product/${carrito[i].product}/?qty=${carrito[i].qty}`;
          const guardarProducto = await fetch(ruta, {
            method: "POST",
            headers: { "Content-type": "application/json" },
          });
          const fetchResult = await guardarProducto.json();

          if (fetchResult.error) {
            throw new Error(fetchResult.error);
          }
        }
      } catch (e) {
        await Swal.fire({
          icon: "error",
          text: `Error al tratar de procesar el carrito: ${e.message} `,
        }).then((result) => {
          window.location.replace("/users/login");
        });
      }
    };

    await guardarProductos();

    const fetchedCart = await fetch(`/api/carts/${cid[0]}/populate`);
    if (fetchedCart.status != 200) {
      throw new Error("no se pudo  traer la información del carrito elegido");
    }

    await dibujarCarrito(fetchedCart);

    const pagar = document.querySelector("#pagar");
    pagar.addEventListener("click", async (e) => {
      e.preventDefault();
      displayLoading();
      try {
        const comprar = await fetch(`/api/carts/${cid[0]}/purchase`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const resultadoCompra = await comprar.json();

        if (!resultadoCompra.error) {
          hideLoading();
          window.location.replace(
            `/users/tickets/?ticket_code=${resultadoCompra.payload.code} `
          );
        } else throw new Error(resultadoCompra.error);
      } catch (e) {
        await Swal.fire({
          icon: "error",
          text: `Lo sentimos, hubo un error al tratar de procesar la compra. ${e.message} `,
        });
      }
    });
  } catch (e) {
    return new Error("no se pudo guardar el carrito ", e.message);
  }
};

const dibujarCarrito = async function (fetchedCart) {
  const parsedCart = await fetchedCart.json();
  hideLoading();
  if (!parsedCart) {
    throw new Error("no se pudo  traer la información del carrito elegido");
  }

  const contenedor = document.querySelector(".contenedorCarrito");
  const iterables = parsedCart.payload.cart;

  let totalGeneral = 0;
  iterables.forEach((iterable) => {
    const cardProducto = document.createElement("div"); //contenedor exterior de cada cart
    cardProducto.classList.add("producto");
    const imagen = document.createElement("div");
    imagen.classList.add("producto_imagen");

    imagen.innerHTML =
      iterable.product.thumb && iterable.product.thumb != ""
        ? `<img
src="/uploads/img/products/${iterable.product.thumb}"
alt=${iterable.product.title}
/>`
        : `<img
src="/uploads/img/products/sinfoto.jpg"
alt="Imagen no disponible"
/>`;

    const nombre = document.createElement("div");
    nombre.classList.add("producto_nombre");
    nombre.innerHTML = `<p>${iterable.product.title}</p>`;

    const cantidad = document.createElement("div");
    cantidad.classList.add("producto_cantidad");
    cantidad.innerHTML = `<p>${iterable.qty}</p>`;
    const precioUnitario = document.createElement("div");
    precioUnitario.innerHTML = `<p>${iterable.product.price}</p>`;
    const totalRenglon = document.createElement("div");
    const subtotal = iterable.product.price * iterable.qty;
    totalGeneral += subtotal;

    totalRenglon.innerHTML = `<p>${subtotal}</p>`;
    cardProducto.append(imagen, nombre, cantidad, precioUnitario, totalRenglon);
    contenedor.append(cardProducto);
  });
  const contenedorTotal = document.querySelector(".grandTotal");
  contenedorTotal.innerHTML = `<p>${totalGeneral}</p>`;
};
compra();
const contarCantidades = () => {
  const valor = carrito
    .map((item) => item.qty)
    .reduce((acum, item) => acum + item);
  let cantidad = document.querySelector("#contador");

  cantidad.innerHTML = valor;
};
contarCantidades();
