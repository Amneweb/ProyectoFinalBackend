function llamarApi() {
  console.log("Llamando api users.");

  const promise1 = fetch("api/users/currentUser", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      /*Authorization: `Bearer ${localStorage.getItem("authToken")}`,*/
    },
  });
  //me fijo si el usuario tiene un carrito armado
  const promise2 = ""; //fetch("api/users/email/");
  Promise.all([promise1, promise2]).then((results) => {
    console.log("resultados de promesas");
    console.log("0", results[0]);
    console.log("1", results[1]);
    if (results[0].status === 200) {
      results[0].json().then((json) => {
        console.log("resultado en llamando api", json);
        const plantilla = document.getElementById("info");

        plantilla.innerHTML = `<p><strong>Nombre:</strong> ${json.payload.name}</p>
          <p><strong>Email:</strong> ${json.payload.email}</p>
          <p><strong>Edad:</strong> ${json.payload.age}</p>
          <p><strong>Rol:</strong> ${json.payload.role}</p>`;
      });
    } else if (results[0].status === 401) {
      console.log(results[0]);
      alert("Credenciales invalidas, debes loguearte de nuevo.");
      window.location.replace("/users/login");
    } else if (results[0].status === 403) {
      console.log(results[0]);
      alert("Usuario no autorizado, revisa tus accesos.");
      window.location.replace("/users/login");
    }
    //results[1].json().then((json) => {
    // if (json.userCartID.length > 0) {
    //   const plantillaCarrito = document.getElementById("carritoBDD");
    //   plantillaCarrito.innerHTML += `<p><strong>Carrito guardado:</strong><a href="/carrito/${json.userCartID[0]}">${json.userCartID[0]}</a></p>`;
    // }
    // });
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
  carrito.innerHTML = `<p>Tenés un carrito sin guardar. <a href="/localstorage">Miralo acá 👉</a></p>`;
}
