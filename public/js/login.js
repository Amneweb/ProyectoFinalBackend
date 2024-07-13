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

  const result = await fetch("/api/users/login", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(result);
  const parsed = await result.json();
  console.log(parsed);
  if (!parsed.error) {
    await Swal.fire({
      title: "👍",
      text: "Te logueaste existosamente",
    }).then((result) => {
      window.location.replace("/users/currentUser");
    });
  } else {
    await Swal.fire({
      icon: "error",
      text: parsed.error,
    }).then((result) => {
      window.location.replace("/users/login");
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
