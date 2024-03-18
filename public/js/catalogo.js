const storage =
  localStorage.getItem("windward") && localStorage.getItem("windward");
const CARRITO = document.querySelector("#carritoEnCatalogo");
CARRITO.innerHTML = storage
  ? `Hay un carrito abierto con ID ${storage} <a href="/carrito/${storage}">👉</a>`
  : "";

const botonesAgregar = document.querySelectorAll(".agregar");
botonesAgregar.forEach((boton) => {
  boton.addEventListener("click", async (e) => {
    e.preventDefault();
    let cid;
    if (!storage) {
      const newCart = await fetch("/api/carts", {
        method: "POST",
        headers: { "Content-type": "application/json" },
      });
      const data = await newCart.json();
      console.log("data", data);
      cid = data._id;
      localStorage.setItem("windward", cid);
    } else {
      cid = storage;
    }

    productID = e.target.id;

    const agregar = await fetch(`/api/carts/${cid}/product/${productID}`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
    });
    console.log("se agregó el producto", agregar);
    Swal.fire({
      title: "👌",
      text: "El producto se agregó con éxito al carrito",
    }).then((result) => {
      location.reload(true);
    });
  });
});
