
import { Server } from "socket.io";
import modelSocket from "../models/socketModels.js";
const ctrlSocket = {
  initialize: async (server, app, sessMiddle) => {
    //Socket
    const io = new Server(server);
    app.set("socketio", io);
    // productos y chats
    const wrap = (middleware) => (socket, next) => {
      middleware(socket.request, {}, next);
    };
    io.use(wrap(sessMiddle));
    // only allow authenticated users
    io.use((socket, next) => {
      const session = socket.request.session;
      if (session) {
        next();
      } else {
        next(new Error("unauthorized"));
      }
    });
    //Coneccion Socket
    io.on("connection", async (socket) => {
      modelSocket.SocketMessage(io, socket);
      // socket.emit("prodsHome_back", arr_prods);
    });
  },
};
export default ctrlSocket;
