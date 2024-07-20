import { Server } from "socket.io";
import messageModel from "../services/daos/mongo/mensajes/messages.model.js";

const messagehandler = (httpServer) => {
  const socketServer = new Server(httpServer);

  socketServer.on("connection", async (socket) => {
    let messages = await messageModel.find();

    socketServer.emit("messageLogs", messages);

    socket.on("message", async (data) => {
      try {
        const newMessage = await messageModel.create(data);
        messages = await messageModel.find();

        socketServer.emit("messageLogs", messages);
      } catch (error) {
        console.error("Error guardando en la base de datos:", error);
      }
    });

    socket.on("userConnected", (data) => {
      socket.broadcast.emit("userConnected", data.user);
    });

    socket.on("closeChat", (data) => {
      if (data.close === "close") socket.disconnect();
    });
  });
};

export default messagehandler;
