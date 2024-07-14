import { formatear } from "./hb-helpers.js";
const html = (source) => {
  let css = `<style>
  .contenedorCarrito {
  display: flex;
  flex-direction: column;
  justify-content: stretch;
    gap:1rem;
    width:100%;
    max-width:1000px;
}
.producto {
  display: grid;
  grid-template-columns: 1fr 10% 20% 25%;
  justify-content: space-between;
  border: #91a3b0 solid 1px;
  border-radius: 5px;
  background-color: white;
  align-items: center;

}
.producto img {
  max-width: 100%;
}
  div.min {
  font-size: 0.7rem;
  margin-top: 0.7rem;
}
.producto div {
  margin: 0 0.7rem 0.7rem 0.7rem;
}
  </style>`;
  let html = `<div class="container">
  <h1>Confirmación de compra</h1>
  <p>
    Gracias por comprar en Windward. Acá te dejamos los detalles de tu compra.
  </p>
  <p><strong>Código:</strong>${source.ticket.code} </p>
  <p><strong>
      Fecha:
    </strong>${source.fecha}
  </p>
  <p><strong>Total:</strong> ${formatear(source.ticket.amount)} </p>
  <h3>Estos son los productos que compraste</h3>
  <div class="contenedorCarrito">`;

  const cards = source.carrito
    .map((item) => {
      let texto = "";
      texto += `<div class="producto">

  <div class="min">Nombre producto</div>
  <div class="min">Cantidad</div>
  <div class="min">Precio unitario</div>
  <div class="min">Total producto</div>
 `;

      texto += `<div class="producto_nombre">
      <p>${item.product.title} </p>
    </div>
    <div class="producto_cantidad">
      <p>${item.qty} </p>
    </div>
    <div><p>${formatear(item.product.price)}</p> </div>
    <div class="total">`;
      const subtotal = formatear(item.product.price * item.qty);
      texto += `<p>${subtotal}</p>
    </div></div>`;
      return texto;
    })
    .join("");
  html += `${css}${cards}</div></div>`;
  return html;
};
export default html;
