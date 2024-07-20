const formRestablecer = document.getElementById("restablecer");

formRestablecer.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(formRestablecer);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));

  try {
    const result = await fetch("/api/users/newpassword", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const parsed = await result.json();

    if (!parsed.error) {
      await Swal.fire({
        title: "👍",
        text: "Ya restableciste tu contraseña, podés loguearte nuevamente",
      }).then((result) => {
        window.location.replace("/users/login");
      });
    } else {
      throw new Error(`Ha habido un error: ${parsed.error}`);
    }
  } catch (e) {
    await Swal.fire({
      icon: "error",
      text: e.message,
    });
  }
});

const contarCantidades = () => {
  let valor;
  const carrito =
    localStorage.getItem("windwardCart") &&
    JSON.parse(localStorage.getItem("windwardCart"));
  if (carrito) {
    valor = carrito.map((item) => item.qty).reduce((acum, item) => acum + item);
  } else {
    valor = 0;
  }
  let cantidad = document.querySelector("#contador");

  cantidad.innerHTML = valor;
};
contarCantidades();
