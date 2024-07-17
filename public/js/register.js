const verPassword = document.querySelector("#verPassword");
const userPassword = document.querySelector("#userPassword");
verPassword.addEventListener("click", (e) => {
  e.preventDefault();
  userPassword.type = userPassword.type === "password" ? "text" : "password";
});

const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(registerForm);

  const obj = {};
  data.forEach((value, key) => (obj[key] = value));
  try {
    const result = await fetch("/api/users/register", {
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
        text: "Te registraste existosamente",
      }).then((result) => {
        window.location.replace("/users/login");
      });
    } else {
      throw new Error(
        `Error al tratar de registrar al usuario: ${parsed.error}`
      );
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
