const carrito = JSON.parse(localStorage.getItem("windwardCart"));
console.log("carrito ", carrito);
const divProductos = document.querySelector(".contenedorCarrito");
const botonAgregar =
  document.querySelector(".agregar") && document.querySelector(".agregar");

/*
========================================================================
BUSCAMOS INFO DE PRODUCTOS PARA DIBUJAR EL CARRITO DEL LOCALSTORAGE
========================================================================
*/

const fetches = carrito.forEach(async (producto) => {
  const datosProducto = await fetch(`/api/products/${producto.product}`);

  if (!datosProducto) throw new Error("No se ha podido cargar el producto");

  const itemCarrito = await datosProducto.json();

  dibujarCard(itemCarrito.payload, producto.qty);
});

/*
========================================================================
GUARDAMOS EL CARRITO DEL LOCAL EN LA BDD
========================================================================
*/

const guardar = document.querySelector("#guardar");
guardar.addEventListener("click", async (e) => {
  e.preventDefault();
  let logueado;
  try {
    const fetchUsuario = await fetch("/api/users/currentUser");
    const usuario = await fetchUsuario.json();

    logueado = usuario.error ? false : true;

    await Swal.fire({
      title: "👌",
      text: "¿Tenés tu carrito completo? Una vez que inicies el proceso de compra ya no lo podrás modificar.",
      showCancelButton: true,
      confirmButtonText: "Agregar productos",
      cancelButtonText: "Terminar compra",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        location.replace("/catalogo");
      } else {
        const compraIniciada = true;
        localStorage.setItem(
          "WWcompraIniciada",
          JSON.stringify(compraIniciada)
        );
        if (logueado) {
          location.replace("/users/CurrentUser");
        } else {
          location.replace("/users/login");
        }
      }
    });
  } catch (e) {
    await Swal.fire({
      title: "Oops",
      text: `Lo sentimos, ha ocurrido un error ${e.message}. Volvé a intentarlo más tarde`,
    });
  }
});

const borrarCarrito = document.getElementById("borrarCarrito");
borrarCarrito.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("windwardCart");
  Swal.fire({
    title: "👍",
    text: "El carrito se borró con éxito",
  }).then((result) => {
    location.replace("/catalogo");
  });
});

const dibujarCard = (datos, qty) => {
  const divProducto = document.createElement("div");
  divProducto.classList.add("producto");
  divProducto.innerHTML =
    datos.thumb != ""
      ? `<div class="producto_imagen">
      <img
        src="/uploads/img/products/${datos.thumb}"
        alt="${datos.title}"
      />`
      : `<div class="producto_imagen">
      <img
        src="/uploads/img/products/sinfoto.jpg"
        alt="Imagen no disponible"
      />
  </div>`;
  divProducto.innerHTML += `<div class="producto_nombre"><p>${datos.title}</p></div>
  <div class="producto_cantidad"><button class="modificarQTY" id="godown_${datos._id}">&#9660</button><p class="qty${datos._id}">
    ${qty}</p>
  </input><button class="modificarQTY" id="goup_${datos._id}">&#9650</button></div>
  <div class="producto_borrar"><button
      id="${datos._id}"
      class="borrar"
      name="${datos._id}"
    >🗑️</button></div></div>
`;
  divProductos.append(divProducto);
};

divProductos.addEventListener("click", (e) => {
  e.preventDefault();
  const operacion_id = e.target.id;

  const operacion = operacion_id.split("_")[0];
  const id = operacion_id.split("_")[1];
  modificarCarrito(id, operacion);
});

const modificarCarrito = (id, operacion) => {
  try {
    const existe = carrito.findIndex((item) => item.product === id);

    if (existe < 0) {
      throw new Error(
        "error de lectura de datos, no se pudo modificar la cantidad"
      );
    } else {
      let qty = parseInt(document.querySelector(`.qty${id}`).innerHTML);
      carrito.splice(existe, 1);
      carrito.push({
        product: id,
        qty: operacion === "goup" ? qty + 1 : qty - 1,
      });
      document.querySelector(`.qty${id}`).innerHTML =
        operacion === "goup" ? qty + 1 : qty - 1;
    }
    localStorage.setItem("windwardCart", JSON.stringify(carrito));
  } catch (e) {
    console.log("Error al tratar de modificar la cantidad ", e.message);
  }
};
