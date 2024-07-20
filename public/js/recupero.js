const loaderContainer = document.querySelector(".loader-container");
const displayLoading = () => {
  loaderContainer.style.display = "block";
};

const hideLoading = () => {
  loaderContainer.style.display = "none";
};

hideLoading();
const formRecuperacion = document.getElementById("recuperacion");

formRecuperacion.addEventListener("submit", async (e) => {
  e.preventDefault();
  displayLoading();
  const data = new FormData(formRecuperacion);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));

  try {
    const result = await fetch("/api/email/recupero", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const parsed = await result.json();

    if (!parsed.error) {
      hideLoading();
      await Swal.fire({
        title: "👍",
        text: "Te va a llegar un email",
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
