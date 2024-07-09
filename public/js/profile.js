const deslogueo = document.querySelector("#logout");
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
const botonCompra = document.querySelector(".botonCompra");
if (botonCompra) {
  botonCompra.addEventListener("click", (e) => {
    e.preventDefault();
    location.replace("/compra");
  });
}
const carritoExistente = JSON.parse(localStorage.getItem("windwardCart"));
const carrito = document.querySelector(".carrito");
if (carritoExistente && carrito) {
  const carrito = document.querySelector(".carrito");
  carrito.innerHTML = `<p>Tenés un carrito sin guardar. <a href="/localstorage">Miralo acá 👉</a></p>`;
}
