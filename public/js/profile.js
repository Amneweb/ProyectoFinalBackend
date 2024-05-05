function llamarApi() {
  console.log("Llamando api users.");

  const promise1 = fetch("api/users/currentUser", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });
  //me fijo si el usuario tiene un carrito armado
  const promise2 = fetch("api/users/email/");
  Promise.all([promise1, promise2]).then((results) => {
    console.log("resultados de promesas");
    console.log("0", results[0]);
    console.log("1", results[1]);
    results[0].json().then((json) => {
      console.log("0", json);
    });
    results[1].json().then((json) => console.log("1", json));
  });

  /*.then((json) => {
  if (json.userCartID.length > 0) {
    plantilla.innerHTML += `<p><strong>Carrito guardado:</strong> ${json.userCartID[0]}</p>`;
  }
});
});

de la primera parte 
.then((result) => {
    if (result.status === 200) {
      result.json();
    } else if (result.status === 401) {
      console.log(result);
      alert("Credenciales invalidas, debes loguearte de nuevo.");
      window.location.replace("/users/login");
    } else if (result.status === 403) {
      console.log(result);
      alert("Usuario no autorizado, revisa tus accesos.");
      window.location.replace("/users/login");
    }

*/
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
