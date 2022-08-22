const express = require("express");
const req = require("express/lib/request");
var app = express();
const multer = require("multer");
const Contenedor = require("../utils/data_utils");
const funcProd = new Contenedor("productos", "ultimo", 'MariaDB');
const funcCart = new Contenedor("carrito", '', 'JSON');

const { Router } = express;
const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/image");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

const UserAuth = (req, res) => {
  if (!req.query.admin)
    return res.send({
      error: -1,
      descripcion: "Ruta 'x' método 'y' no autorizada",
    });
};
router.get("/", async (req, res, next) => {
  UserAuth(req, res);
  const io = req.app.get("socketio");
  //Coneccion Socket
  io.on("connection", async (socket) => {
    // Funciones del producto
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
    socket.emit("productlist_back", await funcProd.getAll());
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
  return res.render("index", {
    altaProd: true,
    proditem_view: true,
    arr_prods,
    arr_prodscart,
  });
});

// router.get("/alta", (req, res) => {
//   res.render("components/form", { viewForm: true });
// });

router.get("/:id", async(req, res) => {
  const id = +req.params.id;
  const prods = await funcProd.getAll();
  arr = prods.find((p) => p.id === id);
  if (arr) {
    res.send({ arr });
  } else {
    res.send({ error: "Producto no encontrado" });
  }
});

router.post("/", upload.single("thumbnail"), async (req, res, next) => {
  UserAuth(req, res);
  const io = req.app.get("socketio");
  try {
    await funcProd.save(req.body);
    io.sockets.emit("productlist_back", await funcProd.getAll());
    res.status(200).send("Producto cargado con exito");
  } catch (error) {
    const errorprod = new Error("Error al cargar el producto" + error);
    error.httpStatusCode = 400;
    return next(errorprod);
  }
});

router.delete("/:id", async (req, res) => {
  UserAuth(req, res);
  const io = req.app.get("socketio");
  const id = +req.params.id;
  if (id > 0) {
    await funcProd.deleteById(+req.params.id);
    io.sockets.emit("productlist_back", await funcProd.getAll());
    res.status(200).send("Producto eliminado con exito");
  } else {
    res.send({
      error: -3,
      descripcion: "Producto no encontrado",
    });
  }
});

router.put("/:id", async(req, res) => {
  UserAuth(req, res);
  const id = +req.params.id;
  const prods = await funcProd.getAll();
  const prodindex = prods.findIndex((p) => p.id === id);
  prods[prodindex] = req.body;
  funcProd.escribirArchivo(prods);
  res.send("Producto Modificado");
});

module.exports = router;
