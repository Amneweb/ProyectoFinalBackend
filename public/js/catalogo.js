let storage =
  localStorage.getItem("windwardCart") && localStorage.getItem("windwardCart"); //guarda el ID del carrito
const CARRITO = document.querySelector("#carritoEnCatalogo");
CARRITO.innerHTML = storage
  ? `Hay un carrito borrador abierto <a href="/localstorage">VER 👉</a>`
  : "";
const botonesAgregar = document.querySelectorAll(".agregar");
//verifico si el usuario está logueado

botonesAgregar.forEach((boton) => {
  boton.addEventListener("click", async (e) => {
    e.preventDefault();
    if (!storage) {
      await crearCarrito();
    }
    const productID = e.target.id;
    await productoAlCarrito(productID);
  });
});

const crearCarrito = async () => {
  try {
    const crearCarritoVacioSinDuenio = await fetch(
      `/api/carts/${cid}/product/${producto.product}?qty=1`,
      {
        method: "POST",
        headers: { "Content-type": "application/json" },
      }
    );
  } catch {}
};

const productoAlCarrito = async (producto, cid) => {
  try {
    const guardarProducto = await fetch(
      `/api/carts/${cid}/product/${producto.product}?qty=1`,
      {
        method: "POST",
        headers: { "Content-type": "application/json" },
      }
    );
    const fetchResult = await guardarProducto.json();

    if (!fetchResult) {
      throw new Error("Error interno de comunicación con la base de datos");
    }
    Swal.fire({
      title: "👌",
      text: "El producto se agregó con éxito al carrito",
      position: "top-end",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (e) {
    Swal.fire({
      title: "👌",
      text: "El producto se agregó con éxito al carrito",
      position: "top-end",
      timer: 1500,
      showConfirmButton: false,
    });
    throw new Error("Error al tratar de guardar el producto ", e.message);
  }
};

const visualizacion = document.querySelector("#visualizacion");
visualizacion.addEventListener("submit", (e) => {
  e.preventDefault();

  const criterio = visualizacion.criterio.value || "nombre";
  const cantidad = visualizacion.cantidad.value || 100;
  const sentido = visualizacion.sentido.value || -1;
  const ruta = `/catalogo/?limit=${cantidad}&criterio=${criterio}&sentido=${sentido}`;

  window.location.replace(ruta);
});

if (document.querySelector("#logout")) {
  const deslogueo = document.querySelector("#logout");
  deslogueo.addEventListener("click", (e) => {
    e.preventDefault();
    fetch("api/users/logout", {
      method: "GET",
      headers: { "Content-type": "application/json" },
    });
    Swal.fire({
      icon: "success",
      text: "Te deslogueaste de forma exitosa",
    }).then((result) => {
      location.reload(true);
    });
  });
}
/*   const current = await fetch("api/users/currentUser");

     try {
      console.log("logueado o no", current.status);
      if (current.status === 200) {
        
  ==========================================================================
  SI EL USUARIO ESTA LOGUEADO Y TIENE UN CARRITO EN LA BDD, GUARDO EN LA BDD
  ==========================================================================
 

        let cid;
        if (!storage) {
          const newCart = await fetch("/api/carts", {
            method: "POST",
            headers: { "Content-type": "application/json" },
          });
          const data = await newCart.json();

          cid = data._id;
          localStorage.setItem("windwardCart", cid);
        } else {
          cid = storage;
        }

        productID = e.target.id;

        const agregar = await fetch(`/api/carts/${cid}/product/${productID}`, {
          method: "POST",
          headers: { "Content-type": "application/json" },
        });

        Swal.fire({
          title: "👌",
          text: "El producto se agregó con éxito al carrito",
        }).then((result) => {
          location.reload(true);
        });
      } else {
        /* 
  =======================================================================================
  SI EL USUARIO NO ESTA LOGUEADO O NO TIENE UN CARRITO EN LA BDD, GUARDO EN LOCAL STORAGE
  =======================================================================================
  */
