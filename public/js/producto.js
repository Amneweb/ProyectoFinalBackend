const carrito = JSON.parse(localStorage.getItem("windwardCart"));
const contarCantidades = () => {
  const valor = carrito
    .map((item) => item.qty)
    .reduce((acum, item) => acum + item);
  let cantidad = document.querySelector("#contador");
  console.log(valor);
  cantidad.innerHTML = valor;
};
contarCantidades();
