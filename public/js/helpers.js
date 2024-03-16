function formatear(amount) {
  const formateado = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(amount);
  return formateado;
}
const deshabilitarVacios = (form) => {
  for (let i = 0; i < form.elements.length; i++) {
    if (form.elements[i].value == "") form.elements[i].disabled = true;
    console.log(i, form.elements[i].value, form.elements[i].disabled);
  }
};

const modificarProducto = document.querySelector("#modificar");
modificarProducto.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.querySelector('input[name="IDproductoModificar"]').value;
  console.log("id ", id);

  deshabilitarVacios(modificarProducto);
  console.log("datos después del deshabilitar ", modificarProducto.elements);
  const bodyData = new FormData(modificarProducto);
  console.log("body data ", bodyData.entries());
  for (const [key, value] of bodyData) {
    console.log(`${key}: ${value}\n`);
  }
  const valores = Object.fromEntries(bodyData.entries());
  console.log("lo que mando al fetch", valores);
  const respuesta = await fetch(`/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(valores),
  });

  console.log("respuesta del fetch", respuesta);
});
