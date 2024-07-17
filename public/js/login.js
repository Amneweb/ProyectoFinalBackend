const verPassword = document.querySelector("#verPassword");
const userPassword = document.querySelector("#userPassword");
verPassword.addEventListener("click", (e) => {
  e.preventDefault();
  userPassword.type = userPassword.type === "password" ? "text" : "password";
});

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(loginForm);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));

  try {
    const result = await fetch("/api/users/login", {
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
        text: "Te logueaste existosamente",
      }).then((result) => {
        window.location.replace("/users/currentUser");
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
