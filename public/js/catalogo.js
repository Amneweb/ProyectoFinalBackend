let storage =
  localStorage.getItem("windwardCart") && localStorage.getItem("windwardCart"); //guarda el ID del carrito
const CARRITO = document.querySelector("#carritoEnCatalogo");
console.log("storage");
console.log(storage);
let carrito;
if (storage) {
  carrito = JSON.parse(storage);
  CARRITO.innerHTML = `Hay un carrito borrador abierto <a href="/localstorage">VER 👉</a>`;
  console.log("carrito existente");
  console.log(carrito);
} else {
  carrito = [];
  console.log("carrito nuevo");
  console.log(carrito);
}

const botonesAgregar = document.querySelectorAll(".agregar");
//verifico si el usuario está logueado

botonesAgregar.forEach((boton) => {
  boton.addEventListener("click", async (e) => {
    e.preventDefault();
    if (!storage) {
      crearCarrito();
    }
    const productID = e.target.id;
    //si está logueado, uso esta función
    //await productoAlCarrito(productID);
    //si no está logueado uso esta
    productoAlStorage(productID);
  });
});

const crearCarrito = () => {
  console.log("en crear Carrito");
  localStorage.setItem("windwardCart", JSON.stringify(carrito));
};

const productoAlStorage = (productID) => {
  try {
    console.log("en productos al storage");
    const existe = carrito.findIndex((item) => item.product === productID);
    console.log("verificación existencia producto");
    console.log(existe);
    if (existe < 0) {
      carrito.push({
        product: productID,
        qty: 1,
      });
    } else {
      const qty = carrito[existe].qty;
      carrito.splice(existe, 1);
      carrito.push({
        product: productID,
        qty: qty + 1,
      });
    }
    localStorage.setItem("windwardCart", JSON.stringify(carrito));

    Swal.fire({
      title: "👌",
      text: "El producto se agregó con éxito al carrito",
      position: "top-end",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (e) {
    console.log("error ", e.message);
    Swal.fire({
      title: "Oops",
      text: "No pudimos agregar el producto",
      position: "top-end",
      timer: 1500,
      showConfirmButton: false,
    });
  }
};
const productoAlCarrito = async (producto, cid) => {
  try {
    const guardarProducto = await fetch(
      `/api/carts/${cid}/product/${producto.product}?qty=1`,
      {
        method: "POST",
        headers: { "Content-type": "application/json" },
      }
    );
    const fetchResult = await guardarProducto.json();

    if (!fetchResult) {
      throw new Error("Error interno de comunicación con la base de datos");
    }
    Swal.fire({
      title: "👌",
      text: "El producto se agregó con éxito al carrito",
      position: "top-end",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (e) {
    Swal.fire({
      title: "Oops",
      text: "El producto se agregó con éxito al carrito",
      position: "top-end",
      timer: 1500,
      showConfirmButton: false,
    });
    throw new Error("Error al tratar de guardar el producto ", e.message);
  }
};

const visualizacion = document.querySelector("#visualizacion");
visualizacion.addEventListener("submit", (e) => {
  e.preventDefault();

  const criterio = visualizacion.criterio.value || "nombre";
  const cantidad = visualizacion.cantidad.value || 100;
  const sentido = visualizacion.sentido.value || -1;
  const ruta = `/catalogo/?limit=${cantidad}&criterio=${criterio}&sentido=${sentido}`;

  window.location.replace(ruta);
});

if (document.querySelector("#logout")) {
  const deslogueo = document.querySelector("#logout");
  deslogueo.addEventListener("click", (e) => {
    e.preventDefault();
    fetch("api/users/logout", {
      method: "GET",
      headers: { "Content-type": "application/json" },
    });
    Swal.fire({
      icon: "success",
      text: "Te deslogueaste de forma exitosa",
    }).then((result) => {
      location.reload(true);
    });
  });
}
const contarCantidades = () => {
  const valor = carrito
    .map((item) => item.qty)
    .reduce((acum, item) => acum + item);
  let cantidad = document.querySelector("#contador");
  console.log(valor);
  cantidad.innerHTML = valor || 0;
};
contarCantidades();
