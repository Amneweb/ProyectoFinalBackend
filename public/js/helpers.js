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
  }
};

const modificarProducto = document.querySelector("#modificar");
modificarProducto.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.querySelector("#idproducto").innerHTML;

  console.log("id sale del span del h3", id);

  deshabilitarVacios(modificarProducto);

  const bodyData = new FormData(modificarProducto);

  const valores = Object.fromEntries(bodyData.entries());

  await fetch(`/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(valores),
  });

  Swal.fire({
    title: "👍",
    text: "El producto se modificó con éxito",
  }).then((result) => {
    location.reload(true);
  });
});

const borrarProducto = document.querySelectorAll(".borrarProducto");
borrarProducto.forEach((boton) => {
  boton.addEventListener("click", async (e) => {
    e.preventDefault();
    const productID = e.target.id;
    await fetch(`/api/products/${productID}`, {
      method: "DELETE",
      headers: { "Content-type": "application/json" },
    });

    Swal.fire({
      title: "👍",
      text: "El producto se borró con éxito",
    }).then((result) => {
      location.reload(true);
    });
  });
});

/* const editarProducto = document.querySelectorAll(".boton-nombre");

editarProducto.forEach((boton) => {
  boton.addEventListener("click", (e) => {
    e.preventDefault();
    const productID = e.target.id;
    const productName = e.target.name;
    const modal = document.querySelector(".editar");
    document.querySelectorAll(".IDproductoModificar").forEach((contenedor) => {
      contenedor.value = productID;
    });
    document.querySelector(
      "#nombre-producto"
    ).innerHTML = `<span class="small">Modificar producto </span>${productName}`;

    modal.classList.add("active");
  });
});
const cerrarEditar = document.querySelector("#cerrar-editar");
cerrarEditar.addEventListener("click", (e) => {
  e.preventDefault();
  const modal = document.querySelector(".editar");
  modal.classList.remove("active");
});
*/
const agregarCategoria = document.querySelector("#agregarCategorias");
agregarCategoria.addEventListener("submit", async (e) => {
  e.preventDefault();
  const newCate = { cate: agregarCategoria.newcate.value };

  console.log("newCate", newCate);
  await fetch(`/api/categories/`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(newCate),
  });

  Swal.fire({
    title: "👍",
    text: "La categoría se agregó con éxito",
  }).then((result) => {
    location.reload(true);
  });
});
