const deslogueo = document.querySelector("#logout");
deslogueo.addEventListener("click", (e) => {
  e.preventDefault();
  fetch("/sessions/logout", {
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
