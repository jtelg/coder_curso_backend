import express from "express";
import multer from "multer";
import Contenedor from "../utils/DB_functions.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import dotenv from "dotenv";
dotenv.config({ path: __dirname + "/../../.env" });
const funcProd = new Contenedor("productos", process.env.DATABASE_USE);
const funcCart = new Contenedor("carrito", "JSON");
const { Router } = express;
const router = Router();

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/image");
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });
// const upload = multer({ storage: storage });

const AuthAdmin = (req, res, next) => {
  const error = ctrlUser(req);
  if (error === true) return next();
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
  // UserAuth(req, res);
  const user = { nombre: req.session?.passport?.user, admin: true };
  const arr_prods = await funcProd.getAll();
  const arr_prodscart = await funcCart.getProds_xcarro(601);
  const io = req.app.get("socketio");
  //Coneccion Socket
  io.on("connection", async (socket) => {
    socket.emit("productlist_back", arr_prods);
  });
  if (arr_prodscart.length > 0) {
    arr_prods.forEach((prod) => {
      prod.check = false;
      if (arr_prodscart.find((e) => e.id === prod.id)) {
        prod.check = true;
      }
    });
  }
  return res.render("index", {
    altaProd: true,
    user,
    arr_prods,
    arr_prodscart,
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
