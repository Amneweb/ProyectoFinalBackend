const carrito = JSON.parse(localStorage.getItem("windwardCart"));
console.log("carrito ", carrito);

async () => {
  await fetch("/api/carts", {
    method: "POST",
    //credentials: "include",
    headers: { "Content-type": "application/json" },
  });
  const data = await fetched.json();

  if (data.error) {
    throw new Error(data.error);
  }
  const cid = data.payload.userCartID;

  carrito.forEach(async (item) => {
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
  await fetch(`/api/carts/${cid}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((result) => {
    if (result.status === 200) {
      result.json().then((json) => {
        // compile the template
        const usersScriptHTML =
          document.querySelector("#contenedorCarrito").innerHTML;
        var template = Handlebars.compile(usersScriptHTML);
        // execute the compiled template and print the output to the console
        var compiledData = template(json);
        console.log(compiledData);
        document.querySelector(".contenedorCarrito").innerHTML = compiledData;
      });
    } else {
      console.log(result);
      alert("Error al conectar con el API.");
    }
  });
};
