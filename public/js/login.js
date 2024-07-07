const verPassword = document.querySelector("#verPassword");
const userPassword = document.querySelector("#userPassword");
verPassword.addEventListener("click", (e) => {
  e.preventDefault();
  userPassword.type = userPassword.type === "password" ? "text" : "password";
});

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(loginForm);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));

  fetch("/api/users/login", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((result) => {
    if (result.status === 200) {
      result.json().then((json) => {
        //FIXME: modificar el alert y transformarlo en sweet alert
        alert("Login realizado con exito! ");
        window.location.replace("/users/currentUser");
      });
    } else if (result.status === 401) {
      console.log("resultado de un login invalido", result);
      alert("Login invalido revisa tus credenciales!");
    }
  });
});
