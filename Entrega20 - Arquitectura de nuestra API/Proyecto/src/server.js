import express from "express";
import logger from "./utils/loggerUtils.js";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import routerProd from "./routes/routesProductos.js";
import routerCart from "./routes/routesCarrito.js";
import routerSession from "./routes/routesSession.js";
import ctrlServer from "./controllers/serverController.js";
import ctrlSocket from "./controllers/socketController.js";
import SessionMidle from "./middlewares/sessionCtrl.js";
import sessionMidle from "./middlewares/sessionMidle.js";
import handleCli from "./utils/handlebarsUtils.js";
import dotenv from "./utils/dotenvUtils.js";
const port = process.env.PORT || Number(process.argv[2]) || 8080;

const ServerSET = () => {
  const app = express();
  //Server
  const server = createServer(app);
  // data ssession
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  app.use(express.static("public"));
  app.use(cookieParser());

  // setea sesion
  const sessMiddle = sessionMidle.initialize(app);
  // socket initialize
  ctrlSocket.initialize(server, app, sessMiddle);
  // handlebars initialize
  handleCli.initialize(app);
  // routes
  app.use("/productos", routerProd);
  app.use("/carrito", routerCart);
  app.use("/session", routerSession);


  // set home page
  app.get("/", SessionMidle.ctrlUser, async (req, res) => {
    ctrlServer.setHomePage(req, res);
  });

  // set info page
  app.get("/info", SessionMidle.ctrlUser, (req, res) => {
    ctrlServer.setInfoPage(req, res);
  });

  app.use(function (req, res) {
    logger.info(`${req.method} > ${req.url} - server.js:214`);
    return res.end();
  });

  app.use(function (req, res) {
    logger.warn(
      `REDIRECT > ${req.method} ${req.url} - RUTA INEXISTENTE - server.js:219`
    );
    return res.redirect(301, "/");
  });
  server.listen(port, (error) => {
    if (error) {
      logger.error("ERROR > Error al iniciar el servidor - server.js:225");
      process.exit();
    }
    logger.info(
      "SET > Server run in http://localhost:" + port + " - server.js:228"
    );
  });
};

export default ServerSET;
