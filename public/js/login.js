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
        console.log("mostramos el usuario después del login", json);
        localStorage.setItem("authToken", json.access_token);
        localStorage.setItem("USER_ID", json.id);
        alert(
          "Login realizado con exito! De acá se va a /users, que debería mostrar los datos del usuario en base al token"
        );
        window.location.replace("/users");
      });
    } else if (result.status === 401) {
      console.log("resultado de un login invalido", result);
      alert("Login invalido revisa tus credenciales!");
    }
  });
});
