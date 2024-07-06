const carrito = JSON.parse(localStorage.getItem("windwardCart"));
console.log("carrito ", carrito);
const divProductos = document.querySelector(".contenedorCarrito");

const fetches = carrito.forEach((producto) => {
  fetch(`/api/products/${producto.product}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
    })
    .then((result) => {
      const datos = { ...result, qty: producto.qty };
      const divProducto = document.createElement("div");
      divProducto.classList.add("producto");
      divProducto.innerHTML =
        datos.thumb != ""
          ? `<div class="producto_imagen">
      <img
        src="${datos.thumb}"
        alt="${datos.title}"
      />`
          : `<div class="producto_imagen">
      <img
        src="/img/sinfoto.jpg"
        alt="Imagen no disponible"
      />
  </div>`;
      divProducto.innerHTML += `<div class="producto_nombre"><p>${datos.title}</p></div>
  <div class="producto_cantidad"><p>${datos.qty}</p></div>
  <div class="producto_borrar"><button
      id="${datos._id}"
      class="borrar"
      name="${datos._id}"
    >🗑️</button></div></div>
`;
      divProductos.append(divProducto);
    });
});
const guardar = document.querySelector("#guardar");
guardar.addEventListener("click", async (e) => {
  e.preventDefault();

  const newCart = await fetch("/api/carts", {
    method: "POST",
    headers: { "Content-type": "application/json" },
  });
  const data = await newCart.json();

  const cid = data._id;

  carrito.forEach(async (producto) => {
    const agregar = await fetch(
      `/api/carts/${cid}/product/${producto.product}?qty=${producto.qty}`,
      {
        method: "POST",
        headers: { "Content-type": "application/json" },
      }
    );
  });

  const addCartToUser = await fetch(`/api/users/cart/${cid}`, {
    method: "PUT",
    headers: { "Content-type": "application/json" },
  });
  const dataCart = await addCartToUser._id;

  if (dataCart) {
    Swal.fire({
      title: "👌",
      text: "El carrito se ha guardado correctamente. Podés seguir agregando productos o terminar la compra",
    }).then((result) => {
      location.replace("/catalogo");
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
