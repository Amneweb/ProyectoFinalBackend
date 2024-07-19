const populateCategories = async () => {
  try {
    const categorias = await fetch("/api/categories", {
      method: "GET",
      headers: { "Content-type": "application/json" },
    });
    const listaCategorias = await categorias.json();

    if (listaCategorias.error) {
      throw new Error("Problema interno, no se pudieron cargar las categorías");
    }
    const html = listaCategorias
      .map(
        (cate) =>
          `<a href='/catalogo/category/${cate.category}'>${cate.category}</a>`
      )
      .join("");
    document.querySelector("#categorias").innerHTML = html;
    if (document.querySelector(".footercate")) {
      document.querySelector(".footercate").innerHTML = html;
    }
  } catch (e) {
    document.querySelector("#categorias").innerHTML = e.message;
    if (document.querySelector(".footercate")) {
      document.querySelector(".footercate").innerHTML = e.message;
    }
  }
};
populateCategories();
