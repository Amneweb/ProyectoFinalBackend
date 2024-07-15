const populateCategories = async () => {
  try {
    const categorias = await fetch("/api/categories", {
      method: "GET",
      headers: { "Content-type": "application/json" },
    });
    const listaCategorias = await categorias.json();

    if (!listaCategorias) {
      throw new Error("problema interno, no se puede mostrar las categorías");
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
    console.log(
      "error al tratar de mostrar el listado de categorias ",
      e.message
    );
  }
};
populateCategories();
