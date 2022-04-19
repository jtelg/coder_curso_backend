const express = require("express");
const path = require("path");
const multer = require("multer");

const { Router } = express;

const app = express();
const routProd = Router();
const PORT = process.env.PORT || 8080;

const arrtemp = [];
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "routes/public/image");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

routProd.get("/", (req, res) => {
  res.send(arrtemp);
});

routProd.get("/:id", (req, res) => {
  const id = +req.params.id;
  arr = arrtemp.find((p) => p.id === id);
  if (arr) {
    res.send({ arr });
  } else {
    res.send({ error: "Producto no encontrado" });
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
    req.body.thumbnail = file.path;
    req.body.id = arrtemp.length;
    arrtemp.push(req.body);
    res.send({ arrtemp });
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

routProd.delete("/:id", (req, res) => {
  const id = +req.params.id;
  arr = arr.filter((p) => p.id !== id);
  res.send({data: `Producto ${id} eliminado`});
});

module.exports = routProd;
