const verPassword = document.querySelector("#verPassword");
const userPassword = document.querySelector("#userPassword");
verPassword.addEventListener("click", (e) => {
  e.preventDefault();
  userPassword.type = userPassword.type === "password" ? "text" : "password";
});

const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = new FormData(registerForm);

  const obj = {};
  data.forEach((value, key) => (obj[key] = value));

  fetch("/api/users/register", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((result) => {
    if (result.status === 201) {
      window.location.replace("/users/login");
    }
  });
});
