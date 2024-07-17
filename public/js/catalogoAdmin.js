const contenedorProductos = document.querySelector(".principal");
const deshabilitarVacios = (form) => {
  for (let i = 0; i < form.elements.length; i++) {
    if (form.elements[i].value == "") form.elements[i].disabled = true;
  }
};

const agregarProducto = document.querySelector("#agregar");
agregarProducto.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    deshabilitarVacios(agregarProducto);

    const bodyData = new FormData(agregarProducto);

    const valores = Object.fromEntries(bodyData.entries());
    console.log("valores");

    console.log(valores);

    const fetchAgregar = await fetch(`/api/products/`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(valores),
    });
    const agregar = await fetchAgregar.json();

    if (agregar.error) {
      throw new Error(agregar.error);
    }
    dibujarNuevoProducto(agregar.payload);
    Swal.fire({
      title: "👍",
      text: "El producto se agregó con éxito",
      position: "center",
    });
  } catch (e) {
    Swal.fire({
      title: "Oops",
      text: `No se pudo agregar el producto: ${e.message}`,
      position: "center",
    });
  }
});

const borrarProducto = document.querySelectorAll(".borrarProducto");
borrarProducto.forEach((boton) => {
  boton.addEventListener("click", async (e) => {
    e.preventDefault();
    const productID = e.target.id;
    try {
      const fetchBorrar = await fetch(`/api/products/${productID}`, {
        method: "DELETE",
        headers: { "Content-type": "application/json" },
      });
      const borrar = await fetchBorrar.json();

      if (borrar.error) {
        throw new Error(borrar.error);
      }
      Swal.fire({
        title: "👍",
        text: "El producto se borró con éxito",
        position: "center",
        timer: 1500,
        showConfirmButton: false,
      });
      const productoBorrado = document.querySelector(`#li_${productID}`);
      contenedorProductos.removeChild(productoBorrado);
    } catch (e) {
      Swal.fire({
        title: "Oops",
        text: `No pudimos borrar el producto ${e.message} `,
        position: "center",
      });
    }
  });
});

const dibujarNuevoProducto = (producto) => {
  const nuevaLi = document.createElement("li");
  nuevaLi.id = `li_${producto._id}`;
  const ulinterna = document.createElement("ul");
  ulinterna.classList.add("interna");
  ulinterna.innerHTML = `<li><a
              href="/admin/producto/${producto._id}"
              id="${producto._id}"
              class="boton-nombre"
              name="${producto.title}"
            >${producto.title}</a></li>
          <li> ${producto._id}</li>
          <li> ${producto.price}</li>
          <li>${producto.description} </li>
          <li>${producto.code}</li>
          <li>${producto.stock}</li>
          <li>
          </li><li><button
              id="${producto._id}"
              class="borrarProducto"
            >🗑️</button></li>
        </ul>
      </li>`;
  nuevaLi.append(ulinterna);
  contenedorProductos.append(nuevaLi);
};

const agregarCategoria = document.querySelector("#agregarCategorias");
console.log(agregarCategoria);
agregarCategoria.addEventListener("submit", async (e) => {
  e.preventDefault();
  const newCate = { cate: agregarCategoria.newcate.value };
  console.log("categoria a agregar ", newCate);
  try {
    const fetchCate = await fetch(`/api/categories/`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(newCate),
    });

    const parsedCate = await fetchCate.json();
    console.log("cate parseada", parsedCate);
    if (parsedCate.error) throw new Error(parsedCate.error);
    Swal.fire({
      title: "👍",
      text: "La categoría se agregó con éxito",
      position: "center",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (e) {
    Swal.fire({
      title: "OOops",
      text: `No se pudo agregar la categoría: ${e.message}`,
      position: "center",
      timer: 1500,
      showConfirmButton: false,
    });
  }
});
