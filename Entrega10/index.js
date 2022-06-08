const express = require("express");
const app = express();

const Contenedor = require("./utils/data_utils");
const funcProd = new Contenedor("productos", "ultimo", 'MariaDB');
const funcChat = new Contenedor("mensajes", "primero", 'SqliteDB');
const funcCart = new Contenedor("carrito", '', 'JSON');

//Archivos estaticos
app.use(express.static(__dirname + "/public"));
app.use(express.json());
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
const Handlebars = require("handlebars");
// setea handlebars para enviar un objeto como parametro desde html a js
Handlebars.registerHelper("json", function (context) {
  return JSON.stringify(context);
});

//Server
const http = require("http");
const port = process.PORT || 8080;
const server = http.createServer(app);

const routerProd = require("./routes/productos");
const routerCart = require("./routes/carrito");
//Socket
const { Server } = require("socket.io");
const io = new Server(server);

app.set("socketio", io);

//Coneccion Socket
io.on("connection", async (socket) => {
  // Funciones del chat de administradores
  socket.emit("mensage_back", await funcChat.getAll());
  socket.on("dataMsn", async (data) => {
    await funcChat.save(data);
    io.sockets.emit("mensage_back", await funcChat.getAll());
  });
});

app.get("/", async (req, res) => {
  let proditem_view = false;
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
  if (req.query.admin) proditem_view = true;
  res.render("index", {
    altaProd: false,
    arr_prods,
    arr_prodscart,
    proditem_view,
  });
});

app.use("/productos", routerProd);
app.use("/carrito", routerCart);

server.listen(port, () => {
  console.log("Server run in http://localhost:" + port);
});
