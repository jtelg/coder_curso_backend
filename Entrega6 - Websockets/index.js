const express = require("express");
const app = express();
const router = require("./routes/productos");

const Contenedor = require("./utils/funcProds");
const funcProd = new Contenedor("productos", "ultimo");
const funcChat = new Contenedor("mensajes", "primero");

//Archivos estaticos
app.use(express.static(__dirname + "/public"));

// Coneccion y configuracion al motor de plantillas handlebars
const { engine } = require("express-handlebars");
app.set("view engine", "hbs");
app.set("views", "./views");
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "main.hbs",
    LayoutsDir: __dirname + "/views/layouts/",
    partialsDir: __dirname + "/views/components/",
  })
);

//Server
const http = require("http");
const port = process.PORT || 8080;
const server = http.createServer(app);

//Data
const msn = [];
let prods = [];

//Socket
const { Server } = require("socket.io");
const { render } = require("express/lib/response");
const io = new Server(server);

//Coneccion Socket
io.on("connection", (socket) => {
  // Funciones del chat
  //Envio de array de mensajes al cliente
  socket.emit("mensage_back", funcChat.getAll());
  //Escuchar mensaje de conexion
  socket.on("message_client", (data) => {});
  //Escuchar chat con el cliente
  socket.on("dataMsn", (data) => {
    // msn.push(data);
    funcChat.save(data);
    io.sockets.emit("mensage_back", funcChat.getAll());
  });
  // Funciones del producto
  //Envio de array de mensajes al cliente
  socket.emit("productlist_back", funcProd.getAll());
  //Escuchar mensaje de conexion
  socket.on("productlist_client", (data) => {});
  socket.on("addProds", (data) => {
    funcProd.save(data);
    io.sockets.emit("productlist_back", funcProd.getAll());
    
    const prodret = funcProd.getAll();
    const lenghtcero = prodret.length > 0 ? true : false;
    render("index", { listProds: prodret, lenghtcero });
  });
  socket.on("deleteProds", (id) => {
    funcProd.deleteById(id);
    io.sockets.emit("productlist_back", funcProd.getAll());
  });
});

app.get("/", (req, res) => {
  // res.render("index", { viewForm: true });
  res.redirect(301, "/productos");
});

app.use("/productos", router);

server.listen(port, () => {
  console.log("Server run on port " + port);
});
