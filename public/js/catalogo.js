let storage =
  localStorage.getItem("windwardCart") && localStorage.getItem("windwardCart");
const CARRITO = document.querySelector("#carritoEnCatalogo");
CARRITO.innerHTML = storage
  ? `Hay un carrito borrador abierto <a href="/localstorage">VER 👉</a>`
  : "";
const botonesAgregar = document.querySelectorAll(".agregar");
//verifico si el usuario está logueado

botonesAgregar.forEach((boton) => {
  boton.addEventListener("click", async (e) => {
    e.preventDefault();
    const current = await fetch("api/users/currentUser");

    try {
      console.log("logueado o no", current.status);
      if (current.status === 200) {
        /* 
  ==========================================================================
  SI EL USUARIO ESTA LOGUEADO Y TIENE UN CARRITO EN LA BDD, GUARDO EN LA BDD
  ==========================================================================
  */

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
        console.log("por el lado de usuario sin loguear");
        let newCart;
        if (!storage) {
          newCart = [];
          console.log("new cart cuando NO existe el storage ", newCart);
        } else {
          newCart = JSON.parse(storage);
          console.log("new cart cuando existe el storage ", newCart);
        }

        const productID = e.target.id;
        console.log("id que llega por el boton " + productID);
        let newProduct = {};
        /*const pos = newCart.findIndex((producto) => {
          console.log("producto en for each " + producto.product);
          producto.product === productID;
        });


        console.log("pos ", pos);

        if (pos < 0) {
          newProduct = { product: productID, qty: 1 };
        } else {
          const cantidadExistente = newCart[pos].qty;
          newCart.splice(pos, 1);
          newProduct = { product: productID, qty: cantidadExistente + 1 };
        }*/
        for (let i = 0; i <= newCart.lenght; i++) {
          console.log(
            pc.bgRed(
              "id en el array " +
                newCart[i].product +
                "productID que viene del botón " +
                productID
            )
          );
          if (newCart[i].product === productID) {
            const cantidadExistente = newCart[i].qty;
            newCart.splice(i, 1);
            newProduct = { product: productID, qty: cantidadExistente + 1 };
            return newCart;
          } else {
            newProduct = { product: productID, qty: 1 };
          }
        }
        console.log("nueva entrada en carrito", newProduct);
        newCart.push(newProduct);
        localStorage.setItem("windwardCart", JSON.stringify(newCart));
        Swal.fire({
          title: "👌",
          text: "El producto se agregó con éxito al carrito",
        }).then((result) => {
          location.reload(true);
        });
      }
    } catch (error) {
      error: error;
    }
  });
});

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
