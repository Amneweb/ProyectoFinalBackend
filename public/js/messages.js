const carrito =
  JSON.parse(localStorage.getItem("windwardCart")) &&
  JSON.parse(localStorage.getItem("windwardCart"));
const socket = io();
let user;
const chatBox = document.querySelector("#chatBox");

Swal.fire({
  title: "👋 ¡Bienvenido!",
  input: "text",
  text: "Gracias por usar nuestro chat. Para empezar, por favor ingresá tu nombre.",
  inputValidator: (value) => {
    if (!value) {
      return "¡Necesitás ingresar tu nombre de usuario para continuar!";
    } else {
      socket.emit("userConnected", { user: value });
    }
  },
  allowOutsideClick: false,
}).then((result) => {
  user = result.value;

  // Cargamos Nombre en el Navegador
  const nombreUsuario = document.querySelector("#nombreUsuario");
  nombreUsuario.innerHTML = user;
});

chatBox.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    if (chatBox.value.trim().length > 0) {
      socket.emit("message", { user: user, message: chatBox.value });

      chatBox.value = "";
    } else {
      Swal.fire({
        title: "Oops",
        text: "El mensaje debe tener algo de texto",
      });
    }
  }
});

socket.on("messageLogs", (data) => {
  const messageLogs = document.querySelector("#messageLogs");
  let logs = "";
  data.forEach((log) => {
    logs += `<p class="messageuser">${log.user}:</p> <p class="messagebox">${log.message}</p>`;
  });
  messageLogs.innerHTML = logs;
});

// 2da - parte
// Aqui escuchamos los nuevos usuarios que se conectan al chat\
socket.on("userConnected", (data) => {
  let message = `Nuevo usuario conectado: ${data.toUpperCase()}`;
  Swal.fire({
    title: message,
    text: "🤩 Démosle la bienvenida",
    toast: true,
  });
});

// close chatBox
const closeChatBox = document.querySelector("#closeChatBox");
closeChatBox.addEventListener("click", (event) => {
  Swal.fire({
    title: "Hasta la próxima",
    text: "Gracias por usar nuestro chat, nos vemos pronto",
    toast: true,
  });
  socket.emit("closeChat", { close: "close" });
  messageLogs.innerHTML = "";
});

const contarCantidades = () => {
  const valor = carrito
    .map((item) => item.qty)
    .reduce((acum, item) => acum + item);
  let cantidad = document.querySelector("#contador");

  cantidad.innerHTML = valor;
};
if (carrito) {
  contarCantidades();
}
