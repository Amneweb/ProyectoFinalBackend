const socket = io();
let user;
const chatBox = document.querySelector("#chatBox");

Swal.fire({
  icon: "info",
  title: "Bienvenido a nuestro chatbot",
  input: "text",
  text: "Para empezar, por favor ingresá tu nombre",
  color: "#cc33cc",
  inputValidator: (value) => {
    if (!value) {
      return "Necesitas escribir tu username para continuar!!";
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
      console.log("mensaje emitido por el usuario");
      console.log({ user: user, message: chatBox.value });
      chatBox.value = "";
    } else {
      Swal.fire({
        icon: "warning",
        title: "Alert",
        text: "El mensaje debe tener algo de texto",
      });
    }
  }
});

socket.on("messageLogs", (data) => {
  console.log("conjunto de mensajes emitidos por el servidor");
  console.log(data);
  const messageLogs = document.querySelector("#messageLogs");
  let logs = "";
  data.forEach((log) => {
    logs += `<b>${log.user}</b> dice: ${log.message}<br/>`;
  });
  messageLogs.innerHTML = logs;
});

// 2da - parte
// Aqui escuchamos los nuevos usuarios que se conectan al chat\
socket.on("userConnected", (data) => {
  let message = `Nuevo usuario conectado ${data}`;
  Swal.fire({
    icon: "info",
    title: "Démosle la bienvenida al nuevo usuario",
    text: message,
    toast: true,
    color: "#cc33cc",
  });
});

// close chatBox
const closeChatBox = document.querySelector("#closeChatBox");
closeChatBox.addEventListener("click", (event) => {
  alert("Gracias por usar este chat, Adios!!");
  socket.emit("closeChat", { close: "close" });
  messageLogs.innerHTML = "";
});
