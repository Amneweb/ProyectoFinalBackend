const botonesBorrarCarrito = document.querySelectorAll(".borrarCarrito");
const contenedorCarritos = document.querySelector(".container");
botonesBorrarCarrito.forEach((boton) => {
  boton.addEventListener("click", async (e) => {
    e.preventDefault();
    const cartID = e.target.id;
    try {
      const fetchBorrar = await fetch(`/api/carts/${cartID}`, {
        method: "DELETE",
        headers: { "Content-type": "application/json" },
      });
      const borrar = fetchBorrar.json();

      if (borrar) {
        Swal.fire({
          title: "👍",
          text: "El carrito se borró con éxito",
        });
        const ulCarrito = document.querySelector(`#ul_${cartID}`);
        contenedorCarritos.removeChild(ulCarrito);
      } else {
        throw new Error("no se pudo borrar el carrito", error);
      }
    } catch (e) {
      Swal.fire({
        title: "Oops",
        text: `Lo sentimos, no se pudo borrar el carrito: ${e.message}`,
      });
    }
  });
});
