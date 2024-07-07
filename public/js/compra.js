const carrito = JSON.parse(localStorage.getItem("windwardCart"));
const compraIniciada = JSON.parse(localStorage.getItem("WWcompraIniciada"));
console.log("carrito ", carrito);
console.log("compraIniciada", compraIniciada);
const newCart = await fetch("/api/carts", {
  method: "POST",
  //credentials: "include",
  headers: { "Content-type": "application/json" },
});
const data = await newCart.json();

if (data.error) {
  throw new Error(data.error);
}
const cid = data.payload.userCartID;

const actualizado = JSON.parse(localStorage.getItem("windwardCart"));
actualizado.forEach(async (item) => {
  const guardarProducto = await fetch(
    `/api/carts/${cid}/product/${item.product}?qty=${item.qty}`,
    {
      method: "POST",
      headers: { "Content-type": "application/json" },
    }
  );
  const fetchResult = await guardarProducto.json();
  if (!fetchResult) {
    throw new Error(
      "Error interno de comunicación con la base de datos al tratar de cargar el producto"
    );
  }
});
