import dotenv from "../utils/dotenvUtils.js";
import logger from "../utils/loggerUtils.js";
import Contenedor from "../DAOs/index.js";
const funcChat = new Contenedor("mensajes", process.env.DATABASE_USE);
const modelSocket = {
  SocketMessage: async (io, socket) => {
    logger.info(`SET > Conexion con io socket correcta - server.js:126`);
    // Funciones del chat de administradores
    socket.emit("mensage_back", await funcChat.getAll());
    socket.on("dataMsn", async (data) => {
      const session = socket.request.session;
      if (session && new Date(session?.cookie.expires) >= new Date()) {
        logger.info(`POST > Nuevo mensaje registrado - server.js:132`);
        await funcChat.save(data);
        io.sockets.emit("mensage_back", await funcChat.getAll());
      } else {
        logger.warn("REDIRECT > Tiempo de sesion expirado - server.js:136");
        io.sockets.emit("mensage_back", {
          error: "Tiempo de sesion expirado",
        });
      }
    });
  },
};

export default modelSocket;
