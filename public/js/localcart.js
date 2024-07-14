const carrito = JSON.parse(localStorage.getItem("windwardCart"));
console.log("carrito ", carrito);
const divProductos = document.querySelector(".contenedorCarrito");
const guardar = document.querySelector("#guardar");
const borrarCarrito = document.getElementById("borrarCarrito");
if (!carrito) {
  guardar.style.display = "none";
  borrarCarrito.style.display = "none";
}
if (!carrito)
  divProductos.innerHTML =
    "<h2 class='sinproductos'>Aun no agregaste productos a tu carrito. ¿Qué esperás para elegir? 🤭</h2>";

function formatear(amount) {
  const formateado = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(amount);
  return formateado;
}
const deslogueo = document.querySelector("#logout");
if (deslogueo) {
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
}
/*
========================================================================
BUSCAMOS INFO DE PRODUCTOS PARA DIBUJAR EL CARRITO DEL LOCALSTORAGE
========================================================================
*/
const dibujar = async () => {
  let TOTAL = 0;
  await carrito.forEach(async (producto) => {
    const datosProducto = await fetch(`/api/products/${producto.product}`);

    if (!datosProducto) throw new Error("No se ha podido cargar el producto");

    const itemCarrito = await datosProducto.json();

    dibujarCard(itemCarrito.payload, producto.qty);

    TOTAL += itemCarrito.payload.price * producto.qty;
    document.querySelector(".grandTotal").innerHTML = formatear(TOTAL);
  });
};
dibujar();
/*
========================================================================
INICIAMOS PROCESO DE COMPRA Y CREAMOS UNA COOKIE
========================================================================
*/

guardar.addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    const fetchUsuario = await fetch("/api/users/currentUser");

    const usuario = await fetchUsuario.json();

    logueado = usuario.error ? false : true;
    console.log("logueado ", logueado);
    await Swal.fire({
      title: "👌",
      text: "¿Tenés tu carrito completo? Una vez que inicies el proceso de compra ya no lo podrás modificar.",
      showCancelButton: true,
      confirmButtonText: "Terminar compra",
      cancelButtonText: "Agregar productos",
      reverseButtons: true,
      preConfirm: async () => {
        try {
          const response = await fetch("/api/purchase/comprainiciada");
          console.log(response);
          if (!response.ok) {
            return Swal.showValidationMessage(`
              ${JSON.stringify(await response.json())}
            `);
          }
          await response.json();
          return;
        } catch (error) {
          Swal.showValidationMessage(`
            Request failed: ${error}
          `);
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        if (logueado) {
          location.replace("/compra");
        } else {
          Swal.fire({
            title: "👤",
            text: "Vamos a pedirte que te loguees o registres antes de proceder con la compra",
          }).then((result) => location.replace("/users/login"));
        }
      } else {
        location.replace("/catalogo");
      }
    });
  } catch (e) {
    await Swal.fire({
      title: "Oops",
      text: `Lo sentimos, ha ocurrido un error ${e.message}. Volvé a intentarlo más tarde`,
    });
  }
});

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
  const total = datos.price * qty;
  divProducto.id = `div_${datos._id}`;

  divProducto.classList.add("producto");
  divProducto.innerHTML = `<div class="min"></div><div class="min"></div><div class="min"></div><div class="min">Precio unitario</div><div class="min">Total producto</div><div class="min"></div>`;
  divProducto.innerHTML +=
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
  <div class="producto_cantidad"><span class="invisible" id="stock_${datos._id}">${datos.stock}</span><span class="tooltip invisible" id="tool_${datos._id}"></span><button class="modificarQTY" id="godown_${datos._id}">&#9660</button><p class="qty${datos._id}">
    ${qty}</p>
  </input><button class="modificarQTY" id="goup_${datos._id}">&#9650</button></div>
  <div id="unitario_${datos._id}">${datos.price}</div><div class="total" id="total_${datos._id}">${total}</div>
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
  if (e.target.classList.contains("borrar")) {
    borrarProducto(e.target.id);
  } else {
    const operacion_id = e.target.id;

    const operacion = operacion_id.split("_")[0];
    const id = operacion_id.split("_")[1];
    modificarCarrito(id, operacion);
  }
});
const calcularTotal = () => {
  const todos = document.querySelectorAll(".total");
  let arrayTodos = [];
  todos.forEach((item) => {
    arrayTodos.push(parseInt(item.innerHTML));
  });
  console.log(arrayTodos);

  const grandTotal = arrayTodos.reduce((accum, item) => accum + item);
  return formatear(grandTotal);
};

const modificarCarrito = (id, operacion) => {
  try {
    const existe = carrito.findIndex((item) => item.product === id);

    if (existe < 0) {
      throw new Error(
        "error de lectura de datos, no se pudo modificar la cantidad"
      );
    } else {
      let precioUnitario = parseInt(
        document.querySelector(`#unitario_${id}`).innerHTML
      );
      let stock = parseInt(document.querySelector(`#stock_${id}`).innerHTML);
      let qty = parseInt(document.querySelector(`.qty${id}`).innerHTML);

      const newQty = operacion === "goup" ? qty + 1 : qty - 1;
      console.log("newQty", newQty);
      if (newQty >= 1 && newQty <= stock) {
        carrito.splice(existe, 1);
        carrito.push({
          product: id,
          qty: newQty,
        });
        document.querySelector(`.qty${id}`).innerHTML = newQty;
        document.querySelector(`#total_${id}`).innerHTML =
          precioUnitario * newQty;
        document.querySelector(".grandTotal").innerHTML = calcularTotal();
      } else {
        const tooltip = document.querySelector(`#tool_${id}`);
        setTimeout(function () {
          tooltip.classList.remove("visible");
          tooltip.classList.add("invisible");
        }, 2000);

        tooltip.innerHTML =
          newQty < 1
            ? "Para borrar este producto hacé click en el botón de la derecha"
            : "Llegaste al máximo de stock";
        tooltip.classList.remove("invisible");
        tooltip.classList.add("visible");
      }
    }

    localStorage.setItem("windwardCart", JSON.stringify(carrito));
    contarCantidades();
  } catch (e) {
    console.log("Error al tratar de modificar la cantidad ", e.message);
  }
};
const borrarProducto = function (id) {
  try {
    const lugar = carrito.findIndex((item) => item.product === id);
    carrito.splice(lugar, 1);
    localStorage.setItem("windwardCart", JSON.stringify(carrito));
    const divSeleccionada = document.querySelector(`#div_${id}`);
    divProductos.removeChild(divSeleccionada);
    document.querySelector(".grandTotal").innerHTML = calcularTotal();
    contarCantidades();
  } catch (e) {
    throw new Error(
      "error de lectura de datos, no se pudo modificar el carrito",
      e.message
    );
  }
};

const contarCantidades = () => {
  const valor = carrito
    .map((item) => item.qty)
    .reduce((acum, item) => acum + item);
  let cantidad = document.querySelector("#contador");
  console.log(valor);
  cantidad.innerHTML = valor;
};
contarCantidades();
