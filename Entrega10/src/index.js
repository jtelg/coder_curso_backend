import express from "express";
const app = express();

//Server
import { createServer } from "http";
const port = process.PORT || 8080;
const server = createServer(app);

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import dotenv from "dotenv";
dotenv.config({ path: __dirname + "/../.env" });

//Socket
import { Server } from "socket.io";
const io = new Server(server);
app.set("socketio", io);

//Archivos estaticos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));


import routerProd from "./routes/productos.js";
import routerCart from "./routes/carrito.js";

app.use("/productos", routerProd);
app.use("/carrito", routerCart);


// Coneccion y configuracion al motor de plantillas handlebars
import { engine } from "express-handlebars";
app.set("view engine", "hbs");
app.set("views", "./src/views");
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "main.hbs",
    LayoutsDir: __dirname + "/views/layouts/",
    partialsDir: __dirname + "/views/components/",
  })
);
import Handlebars from "handlebars";
// setea handlebars para enviar un objeto como parametro desde html a js
Handlebars.registerHelper("json", function (context) {
  return JSON.stringify(context);
});


// productos y chats
import Contenedor from "./utils/DB_functions.js";
const funcProd = new Contenedor("productos", process.env.DATABASE_USE);
const funcChat = new Contenedor("mensajes", process.env.DATABASE_USE);
const funcCart = new Contenedor("carrito", "JSON");

const arr_prods = await funcProd.getAll();
const arr_prodscart = await funcCart.getProds_xcarro(601);
if (arr_prodscart.length > 0) {
  arr_prods.forEach((prod) => {
    prod.check = false;
    if (arr_prodscart.find((e) => e.id === prod.id)) {
      prod.check = true;
    }
  });
}

//Coneccion Socket
io.on("connection", async (socket) => {
  // Funciones del chat de administradores
  socket.emit("mensage_back", await funcChat.getAll());
  socket.on("dataMsn", async (data) => {
    await funcChat.save(data);
    io.sockets.emit("mensage_back", await funcChat.getAll());
  });
  socket.emit("prodsHome_back", arr_prods);

  // socket.emit("lenghtCard_back", arr_prodscart.length);
  // socket.on("lenghtCard_alta", async (data) => {
  //   io.sockets.emit("mensage_back", data);
  // });
});

app.get("/", async (req, res) => {
  const proditem_view = req.query.admin ? true : false;
  res.render("index", {
    altaProd: false,
    arr_prods,
    arr_prodscart,
    proditem_view,
  });
});

server.listen(port, () => {
  console.log("Server run in http://localhost:" + port);
});
