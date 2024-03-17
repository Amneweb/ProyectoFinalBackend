const botonesAgregar = document.querySelectorAll(".agregar");
botonesAgregar.forEach((boton) => {
  boton.addEventListener("click", async (e) => {
    e.preventDefault();
    const cid = "65ee498a6350cf4da720e896";
    productID = e.target.id;

    const agregar = await fetch(`/api/carts/${cid}/product/${productID}`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
    });
    console.log("se agregó el producto", agregar);
    Swal.fire({
      title: "👌",
      text: "El producto se agregó con éxito al carrito",
    });
  });
});
