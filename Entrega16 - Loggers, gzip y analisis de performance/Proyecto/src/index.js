import express from "express";
const app = express();

import compresion from "compression";
import logger from "./utils/logger.js";

//Server
import { createServer } from "http";
const server = createServer(app);

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import dotenv from "dotenv";
dotenv.config({ path: __dirname + "/../.env" });

import cluster from "cluster";
import os from "os";

const numeroCpus = os.cpus().length;
const port = process.env.PORT || Number(process.argv[2]) || 8080;

//Socket
import { Server } from "socket.io";
const io = new Server(server);
app.set("socketio", io);

// data ssession
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import config from "../DB/config/config.js";
const advancedOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const sessMiddle = session({
  store: MongoStore.create({
    mongoUrl: config.mongodb.cnxStr,
    mongoOptions: advancedOptions,
  }),
  cookie: {
    path: "/",
    httpOnly: true,
    secure: false,
    maxAge: 600000,
  },
  secret: "usersession",
  resave: false,
  saveUninitialized: true,
  rolling: true,
});
// Archivos estaticos
app.use(cookieParser());
app.use(sessMiddle);

import routerProd from "./routes/productos.js";
import routerCart from "./routes/carrito.js";
import routerSession from "./routes/session.js";
import routerRandom from "./routes/randoms.js";

app.use("/productos", routerProd);
app.use("/carrito", routerCart);
app.use("/session", routerSession);
app.use("/randoms", routerRandom);

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

const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

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
  logger.info(`SOCKET CONECTION`);
  // Funciones del chat de administradores
  socket.emit("mensage_back", await funcChat.getAll());
  socket.on("dataMsn", async (data) => {
    const session = socket.request.session;
    if (session && new Date(session?.cookie.expires) >= new Date()) {
      logger.info(`POST MESSAGE IN SOCKET`);
      await funcChat.save(data);
      io.sockets.emit("mensage_back", await funcChat.getAll());
    } else {
      logger.warn("POST MESSAGE - Tiempo de sesion expirado");
      io.sockets.emit("mensage_back", { error: "Tiempo de sesion expirado" });
    }
  });
  socket.emit("prodsHome_back", arr_prods);
});

const AuthUser = (req, res, next) => {
  if (dataUser(req)) return next();
  logger.warn("Permiso denegado, redireccionando");
  return res.redirect(301, "/session/login");
};

const dataUser = (req) => {
  if (
    req.session?.passport?.user &&
    req.session?.passport?.user !== "" &&
    new Date(req.session?.cookie.expires) >= new Date()
  )
    return true;
  logger.warn("Permiso denegado, redireccionando");
  return false;
};

const dataAdmin = (req) => {
  if (
    req.session?.passport?.user?.toLowerCase() === "admin" ||
    req.session?.admin ||
    req.query.admin
  ) {
    return true;
  }
  logger.warn("Permiso denegado, redireccionando");
  return false;
};

app.get("/", AuthUser, async (req, res) => {
  logger.info(`${req.method} ${req.url}`)
  const user = { nombre: req.session?.passport?.user, admin: dataAdmin(req) };
  res.render("index", {
    altaProd: false,
    arr_prods,
    arr_prodscart,
    user,
  });
});

app.get("/info", (req, res) => {
  logger.info(`${req.method} ${req.url}`);
  const lista = {
    ArgumentosEntrada: process.argv.slice(2),
    SistemaOperativo: process.platform,
    VersionNode: process.version,
    MemoriaReservada: process.memoryUsage.rss(),
    PathEjecucion: process.execPath,
    ProcessID: process.pid,
    CarpetaProyecto: process.cwd(),
    ProcessNumber: numeroCpus,
  };
  res.json(lista);
  res.end();
});


app.use(function (req, res) {
  logger.warn(`${req.method} ${req.url} - RUTA INEXISTENTE`);
  return res.redirect(301, "/");
});

server.listen(port, (error) => {
  if (error) {
    logger.error("Error al iniciar el servidor");
    process.exit();
  }
  // console.table("Server run in http://localhost:" + port);
});


// if (cluster.isMaster) {
//   for (let i = 0; i < numeroCpus; i++) {
//     cluster.fork();
//   }
//   cluster.on("exit", (worker) => {
//     console.log(`Proceso worker con PID ${worker.process.pid} salio`);
//     cluster.fork();
//   });
// } else {
//   app.get("/info", (req, res) => {
//     logger.info(`${req.method} ${req.url}`);
//     const lista = {
//       ArgumentosEntrada: process.argv.slice(2),
//       SistemaOperativo: process.platform,
//       VersionNode: process.version,
//       MemoriaReservada: process.memoryUsage.rss(),
//       PathEjecucion: process.execPath,
//       ProcessID: process.pid,
//       CarpetaProyecto: process.cwd(),
//       ProcessNumber: numeroCpus,
//     };
//     res.json(lista);
//     res.end();
//   });

//   app.get("/infoGzip", compresion(), (req, res) => {
//     logger.info(`${req.method} ${req.url}`);
//     const lista = {
//       ArgumentosEntrada: process.argv.slice(2),
//       SistemaOperativo: process.platform,
//       VersionNode: process.version,
//       MemoriaReservada: process.memoryUsage.rss(),
//       PathEjecucion: process.execPath,
//       ProcessID: process.pid,
//       CarpetaProyecto: process.cwd(),
//       ProcessNumber: numeroCpus,
//     };
//     res.json(lista);
//     res.end();
//   });

//   app.use(function (req, res) {
//     logger.warn(`${req.method} ${req.url} - RUTA INEXISTENTE`);
//     return res.redirect(301, "/info");
//   });
//   server.listen(port, (error) => {
//     if (error) {
//       logger.error("Error al iniciar el servidor");
//       process.exit();
//     }
//     // console.table("Server run in http://localhost:" + port);
//   });
// }

