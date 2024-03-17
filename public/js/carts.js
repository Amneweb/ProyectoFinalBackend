const botonesBorrarCarrito = document.querySelectorAll(".borrarCarrito");
botonesBorrarCarrito.forEach((boton) => {
  boton.addEventListener("click", async (e) => {
    e.preventDefault();
    const cartID = e.target.id;

    const borrar = await fetch(`/api/carts/${cartID}`, {
      method: "DELETE",
      headers: { "Content-type": "application/json" },
    });
    console.log("se borró el carrito", borrar);
    const storage = localStorage.getItem("windward");
    if (cartID === storage) {
      localStorage.removeItem("windward");
    }
    Swal.fire({
      title: "👍",
      text: "El carrito se borró con éxito",
    }).then((result) => {
      location.reload(true);
    });
  });
});

const botonesBorrarProducto = document.querySelectorAll(".borrar");
botonesBorrarProducto.forEach((boton) => {
  boton.addEventListener("click", async (e) => {
    e.preventDefault();
    const cartID = e.target.name;
    const productID = e.target.id;
    console.log(cartID, productID);
    const borrar = await fetch(`/api/carts/${cartID}/product/${productID}`, {
      method: "DELETE",
      headers: { "Content-type": "application/json" },
    });
    console.log("se borró el producto", borrar);
    Swal.fire({
      title: "👍",
      text: "El producto se borró con éxito",
    }).then((result) => {
      location.reload(true);
    });
  });
});
