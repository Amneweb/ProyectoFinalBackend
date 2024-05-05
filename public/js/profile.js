function llamarApi() {
  console.log("Llamando api users.");

  fetch("api/users/currentUser", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  }).then((result) => {
    if (result.status === 200) {
      result
        .json()
        .then((json) => {
          console.log("resultado en llamando api", json);
          const plantilla = document.getElementById("info");
          plantilla.innerHTML = `<p><strong>Nombre:</strong> ${json.payload.name}</p>
        <p><strong>Email:</strong> ${json.payload.email}</p>
        <p><strong>Edad:</strong> ${json.payload.age}</p>
        <p><strong>Rol:</strong> ${json.payload.role}</p>`;
        })
        .then((json) => {
          //me fijo si el usuario tiene un carrito armado
          fetch("api/users/email/").then((result) => {
            console.log("dentro del fetch de email");
            console.log(result);
            result.json().then((json) => {
              if (json.userCartID.length > 0) {
                plantilla.innerHTML += `<p><strong>Carrito guardado:</strong> ${json.userCartID[0]}</p>`;
              }
            });
          });
        });
    } else if (result.status === 401) {
      console.log(result);
      alert("Credenciales invalidas, debes loguearte de nuevo.");
      window.location.replace("/users/login");
    } else if (result.status === 403) {
      console.log(result);
      alert("Usuario no autorizado, revisa tus accesos.");
      window.location.replace("/users/login");
    }
  });
}
llamarApi();
const deslogueo = document.querySelector("#logout");
deslogueo.addEventListener("click", (e) => {
  e.preventDefault();

  if (localStorage.getItem("USER_ID")) localStorage.removeItem("USER_ID");
  if (localStorage.getItem("authToken")) localStorage.removeItem("authToken");

  fetch("/api/users/logout", {
    method: "GET",
    headers: { "Content-type": "application/json" },
  });
  Swal.fire({
    icon: "success",
    text: "Te deslogueaste de forma exitosa",
  }).then((result) => {
    window.location.replace("/users/login");
  });
});

const carrito = document.querySelector(".carrito");
const carritoExistente = localStorage.getItem("windwardCart");
if (carritoExistente) {
  carrito.innerHTML = `<p>Tenés un carrito sin guardar. <a href="/carrito/${carritoExistente}">Miralo acá 👉</a></p>`;
}
