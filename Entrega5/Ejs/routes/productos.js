const express = require("express");
const path = require("path");
const multer = require("multer");
const Contenedor = require("../utils/funcProds");
const funcProd = new Contenedor("productos");

const { Router } = express;

const app = express();
const routProd = Router();
const PORT = process.env.PORT || 8080;

const arrtemp = [];
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/image");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

routProd.get("/", (req, res) => {
  const prodret = funcProd.getAll();
  const lenghtcero = prodret.length > 0 ? true : false;
  res.render("index", { viewForm: false, listProds: prodret, lenghtcero, viewProd: true });
  // res.send(funcProd.getAll());const id = +req.params.id;
});

routProd.get("/alta", (req, res) => {
  // res.render("index", { viewForm: true });
  res.render("index", {viewForm: true, listProds: [], lenghtcero: false, viewProd: false});
});

routProd.get("/:id", (req, res) => {
  const id = +req.params.id;
  switch (req.query._method) {
    case "DELETE":
      funcProd.deleteById(id);
      res.redirect(301, "/productos");
      break;
    default:

      arr = arrtemp.find((p) => p.id === id);
      if (arr) {
        res.send({ arr });
      } else {
        res.send({ error: "Producto no encontrado" });
      }
      break;
  }
});

routProd.post("/", upload.single("thumbnail"), (req, res, next) => {
  const file = req.file;
  if (!file || !req.body) {
    const error = new Error("Error al cargar la imagen");
    error.httpStatusCode = 400;
    return next(error);
  }
  try {
    const obj = {
      title: req.body.integration.title,
      price: req.body.integration.price,
      imageurl: req.body.integration.imageurl,
      thumbnail: file.path,
    };
    funcProd.save(obj);
    res.redirect(301, "/productos");
  } catch (error) {
    const errorprod = new Error("Error al cargar el producto" + error);
    error.httpStatusCode = 400;
    return next(errorprod);
  }
});

routProd.put("/:id", (req, res) => {
  const id = +req.params.id;
  const prodindex = arrtemp.findIndex((p) => p.id === id);
  arrtemp[prodindex] = req.body;
});

// routProd.delete("/:id", (req, res) => {
//   const id = +req.params.id;
//   arr = arr.filter((p) => p.id !== id);
//   res.send({ data: `Producto ${id} eliminado` });
// });

module.exports = routProd;
