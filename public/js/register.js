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

  const result = await fetch("/api/users/register", {
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
      text: "Te registraste existosamente",
    }).then((result) => {
      window.location.replace("/users/login");
    });
  } else {
    await Swal.fire({
      icon: "error",
      text: parsed.error,
    });
  }
});
