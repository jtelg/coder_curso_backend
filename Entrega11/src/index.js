import express from "express";
import { faker } from "@faker-js/faker";
import normalizr from "normalizr";
const normalize = normalizr.normalize;
const denormalize = normalizr.denormalize;
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

import util from "util";
function print(objeto) {
  console.log(util.inspect(objeto, false, 12, true));
}
//Coneccion Socket
io.on("connection", async (socket) => {
  const msjs = await funcChat.getAll();
  const userSchema = new normalizr.schema.Entity("users", undefined, {
    idAttribute: (value) => value.author.id,
    processStrategy: (value) => ({
      id: value.author.id,
      nombre: value.author.nombre,
      apellido: value.author.apellido,
      edad: value.author.edad,
      alias: value.author.alias,
      avatar: value.author.avatar,
      color: value.author.color,
      text: value.text
    }),
  });
  const msgSchema = new normalizr.schema.Entity("mensajes", undefined, {
    idAttribute: "",
    processStrategy: (value) => ({
      id: value.author.id,
      msg: value.text,
    }),
  });

  const dataSchema = new normalizr.schema.Entity("data", {
    author: [userSchema],
    mensajes: [msgSchema],
  });

  const dataListSchema = [{dataSchema}];
  const normalizedData = normalize(msjs, dataListSchema);
  // print(normalizedData);

  // const denormData = denormalize(
  //   normalizedData.result,
  //   dataListSchema,
  //   normalizedData.entities
  // );
  // print(denormData);

  // Funciones del chat de administradores
  socket.emit("mensage_back", normalizedData);
  socket.on("dataMsn", async (data) => {
    await funcChat.save(data);
    io.sockets.emit("mensage_back", await funcChat.getAll());
  });
  socket.emit("prodsHome_back", arr_prods);
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

let arr_data = [];

const createMoks = (cantidad = 5) => {
  arr_data = [];
  for (let x = 0; x < cantidad; x++) {
    arr_data.push({
      nombre: faker.commerce.productName(),
      price: faker.commerce.price(),
      image: faker.image.avatar(),
    });
  }
};

app.get("/api/productos-test", (req, res) => {
  createMoks();
  res.status(200).send(`
  <pre style="font-family: Courier;background: #f4f4f4;border: solid 1px #e1e1e1;float: left;width: 100%;">
    ${JSON.stringify(arr_data, null, " ").replace("[", "").replace("]", "")}
  </pre>`);
});

server.listen(port, () => {
  console.log("Server run in http://localhost:" + port);
});
