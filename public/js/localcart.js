const carrito = JSON.parse(localStorage.getItem("windwardCart"));
console.log("carrito ", carrito);

const htmlScript = document.getElementById("contenedorCarrito").innerHTML;
let theTemplate = Handlebars.compile(htmlScript);
const compiledTemplate = theTemplate(carrito);
console.log(compiledTemplate);
document.getElementById("mostrarContenido").innerHTML = compiledTemplate;
