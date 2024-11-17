// socket.ts
import { io, Socket } from "socket.io-client";

export const initializeSocket = (name: string, token: string): Socket => {
  const socket = io(process.env.NEXT_PUBLIC_API_URL, {
    auth: {
      name,
      token,
    },
  });

  socket.on("connect", () => {
    console.log("Conectado al servidor Socket.io con ID:", socket.id);
  });

  socket.on("connect_error", (error) => {
    console.error("Error de conexión:", error);
  });

  socket.on("disconnect", (reason) => {
    console.log("Desconectado del servidor:", reason);
  });

  return socket;
};
