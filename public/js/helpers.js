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

  deshabilitarVacios(modificarProducto);

  const bodyData = new FormData(modificarProducto);

  const valores = Object.fromEntries(bodyData.entries());

  try {
    const fetchModificar = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(valores),
    });
    const parsedModificar = await fetchModificar.json();
    if (parsedModificar.error) throw new Error(parsedModificar.error);
    Swal.fire({
      title: "👍",
      text: "El producto se modificó con éxito",
      position: "center",
      timer: 1500,
      showConfirmButton: false,
    }).then((result) => location.reload(true));
  } catch (e) {
    Swal.fire({
      title: "Oops",
      text: `Hubo un error al tratar de modificar el producto: ${e.message}`,
      position: "top-end",
      timer: 1500,
      showConfirmButton: false,
    });
  }
});

const borrarCategoria = document.querySelectorAll(".borrarCate");

borrarCategoria.forEach((boton) => {
  boton.addEventListener("click", async (e) => {
    e.preventDefault();
    const productID = e.target.name;
    const categoria = e.target.id;
    try {
      const modificado = await fetch(
        `/api/products/${productID}/categoria/${categoria}`,
        {
          method: "PUT",
          headers: { "Content-type": "application/json" },
        }
      );
      const parseado = await modificado.json();

      if (parseado.error) {
        throw new Error(parseado.error);
      }
      await Swal.fire({
        title: "👍",
        text: "La categoría se borró con éxito",
        position: "center",
        timer: 1500,
        showConfirmButton: false,
      });

      const categorias = parseado.payload.category;

      const bannerCategorias = document.getElementById("asignadas");
      const nuevoHTML = categorias
        .map(
          (cadauno) =>
            "<button class='badge borrarCate' name='" +
            productID +
            "' id='" +
            cadauno +
            "'>" +
            cadauno +
            " ❌</button>"
        )
        .join("");

      bannerCategorias.innerHTML = nuevoHTML;
    } catch (e) {
      Swal.fire({
        title: "Oops",
        text: `La categoría no se pudo borrar debido a ${e.message}`,
        position: "center",
        showConfirmButton: true,
      });
    }
  });
});

const bannerExistentes = document.querySelector("#existentes");

bannerExistentes.addEventListener("click", async (e) => {
  const productID = e.target.name;
  const categoria = e.target.id;
  try {
    const modificado = await fetch(
      `/api/products/${productID}/categoria/${categoria}`,
      {
        method: "PUT",
        headers: { "Content-type": "application/json" },
      }
    );
    const parseado = await modificado.json();

    if (parseado.error) {
      throw new Error(parseado.error);
    }
    await Swal.fire({
      title: "👍",
      text: "La categoría se agregó con éxito",
      position: "center",
      timer: 1500,
      showConfirmButton: false,
    });

    const categorias = parseado.payload.category;

    const nuevoHTML = categorias
      .map(
        (cadauno) =>
          "<button class='badge borrarCate' name='" +
          productID +
          "' id='" +
          cadauno +
          "'>" +
          cadauno +
          " ❌</button>"
      )
      .join("");
    const bannerAsignadas = document.querySelector("#asignadas");

    bannerAsignadas.innerHTML = nuevoHTML;
  } catch (e) {
    Swal.fire({
      title: "Oops",
      text: `La categoría no se pudo agregar debido a ${e.message}`,
      position: "center",
      showConfirmButton: true,
    });
  }
});

const bannerAsignadas = document.querySelector("#asignadas");

bannerAsignadas.addEventListener("click", async (e) => {
  const productID = e.target.name;
  const categoria = e.target.id;
  try {
    const modificado = await fetch(
      `/api/products/${productID}/categoria/${categoria}`,
      {
        method: "PUT",
        headers: { "Content-type": "application/json" },
      }
    );
    const parseado = await modificado.json();

    if (parseado.error) {
      throw new Error(parseado.error);
    }
    await Swal.fire({
      title: "👍",
      text: "La categoría se borró con éxito",
      position: "center",
      timer: 1500,
      showConfirmButton: false,
    });

    const categorias = parseado.payload.category;

    const nuevoHTML = categorias
      .map(
        (cadauno) =>
          "<button class='badge borrarCate' name='" +
          productID +
          "' id='" +
          cadauno +
          "'>" +
          cadauno +
          " ❌</button>"
      )
      .join("");
    const bannerAsignadas = document.querySelector("#asignadas");

    bannerAsignadas.innerHTML = nuevoHTML;
  } catch (error) {
    Swal.fire({
      title: "Oops",
      text: `La categoría no se pudo borrar debido a ${error.message}`,
      position: "center",
      showConfirmButton: true,
    });
  }
});

const subirImagen = document.querySelector("#subirImagen");
subirImagen.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.querySelector("#idproducto").innerHTML;

  const bodyData = new FormData(subirImagen);

  try {
    const response = await fetch(`/api/products/${id}/imagenes`, {
      method: "PUT",
      body: bodyData,
    });
    const parsed = await response.json();
    if (parsed.error) throw new Error(parsed.error);

    Swal.fire({
      title: "👍",
      text: "La imagen se cargó existosamente",
      position: "center",
      showConfirmButton: true,
    });
  } catch (e) {
    Swal.fire({
      title: "Oops",
      text: "Hubo un error y no se pudo cargar la imagen",
      position: "center",
      showConfirmButton: true,
    });
  }
});
