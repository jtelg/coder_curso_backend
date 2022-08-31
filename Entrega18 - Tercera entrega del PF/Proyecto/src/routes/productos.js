import express from "express";
import Contenedor from "../utils/DB/DB_functions.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import dotenv from "dotenv";
dotenv.config({ path: __dirname + "/../../.env" });
const funcProd = new Contenedor("productos", process.env.DATABASE_USE);
const funcCart = new Contenedor("carrito", process.env.DATABASE_USE);
const { Router } = express;
const router = Router();

import logger from '../utils/logger.js'


const AuthAdmin = (req, res, next) => {
  const error = ctrlUser(req);
  if (error === true) return next();
  logger.warn("Permiso denegado, redireccionando " + error);
  return res.redirect("/session/login/?Mesage=" + error);
};

const ctrlUser = (req) => {
  let error = "";
  if (new Date(req.session?.cookie.expires) >= new Date()) {
    if (
      req.session?.passport?.user?.toLowerCase() === "admin" ||
      req.session?.user?.admin ||
      req.query.admin
    ) {
      return true;
    }
    
    error = "No posee autorizacion";
  } else {
    error = "Tiempo de sesion expirado";
  }
  logger.warn(error);
  return error;
};

// const UserAuth = (req, res) => {
//   if (!req.query.admin)
//     return res.send({
//       error: -1,
//       descripcion: "Ruta 'x' método 'y' no autorizada",
//     });
// };
router.get("/", AuthAdmin, async (req, res) => {
  const arr_prods = await funcProd.getAll();
  const carro =
    (await funcCart.getxCampo("iduser", req.session.iduser)) || false;

  if (carro) {
    arr_prods.forEach((prod) => {
      prod.check = false;
      if (carro?.productos?.find((e) => e.id === prod.id)) {
        prod.check = true;
      }
    });
  }
  const user = {
    nombre: req.session?.passport?.user,
    admin: req.session.admin,
    iduser: req.session.iduser,
  };
  const io = req.app.get("socketio");
  //Coneccion Socket
  io.on("connection", async (socket) => {
    io.sockets.emit("productlist_back", arr_prods);
  });
  return res.render("index", {
    altaProd: true,
    user,
    arr_prods,
    carro
  });
});

// router.get("/alta", (req, res) => {
//   res.render("components/form", { viewForm: true });
// });

router.get("/:id", async (req, res) => {
  
  const id = +req.params.id;
  const prods = await funcProd.getAll();
  arr = prods.find((p) => p.id === id);
  if (arr) {
    res.send({ arr });
  } else {
    res.send({ error: "Producto no encontrado" });
  }
});

router.post("/", AuthAdmin, async (req, res) => {
  
  const io = req.app.get("socketio");
  try {
    await funcProd.save(req.body);
    io.sockets.emit("productlist_back", await funcProd.getAll());
    res.end();
  } catch (error) {
    res.send({ error: "error al cargar producto " + error });
  }
});

router.delete("/:id", AuthAdmin, async (req, res) => {
  // UserAuth(req, res);
  
  const io = req.app.get("socketio");
  const id = req.params.id;
  if (id) {
    await funcProd.deleteById(id);
    io.sockets.emit("productlist_back", await funcProd.getAll());
    res.status(200).send("Producto eliminado con exito");
  } else {
    res.send({
      error: -3,
      descripcion: "Producto no encontrado",
    });
  }
});

router.put("/:id", AuthAdmin, async (req, res) => {
  // UserAuth(req, res);
  
  const id = +req.params.id;
  const prods = await funcProd.getAll();
  const prodindex = prods.findIndex((p) => p.id === id);
  prods[prodindex] = req.body;
  funcProd.escribirArchivo(prods);
  res.send("Producto Modificado");
});

export default router;
