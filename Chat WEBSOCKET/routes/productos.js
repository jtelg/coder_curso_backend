const express = require("express");
const multer = require("multer");
const Contenedor = require("../utils/funcProds");
const funcProd = new Contenedor("productos");

const { Router } = express;
const router = Router();

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

router.get("/", (req, res) => {
  res.render("index");
});

// router.get("/alta", (req, res) => {
//   res.render("index", { viewForm: true });
// });

router.get("/:id", (req, res) => {
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

router.post("/", upload.single("thumbnail"), (req, res, next) => {
  const file = req.file;
  if (!file || !req.body) {
    const error = new Error("Error al cargar la imagen");
    error.httpStatusCode = 400;
    return next(error);
  }
  try {
    const obj = {
      title: req.body.title,
      price: req.body.price,
      imageurl: req.body.imageurl,
      thumbnail: file.path,
    };
    funcProd.save(obj);
    req.io.sockets.emit("productlist_back", funcProd.getAll());
    res.redirect(301, "/productos");
  } catch (error) {
    const errorprod = new Error("Error al cargar el producto" + error);
    error.httpStatusCode = 400;
    return next(errorprod);
  }
});

router.put("/:id", (req, res) => {
  const id = +req.params.id;
  const prodindex = arrtemp.findIndex((p) => p.id === id);
  arrtemp[prodindex] = req.body;
});

// router.delete("/:id", (req, res) => {
//   const id = +req.params.id;
//   arr = arr.filter((p) => p.id !== id);
//   res.send({ data: `Producto ${id} eliminado` });
// });

module.exports = router;

// const express = require("express");

// const { Router } = express;

// const router = new Router();

// router.get("/", (req, res) => {
//   res.sendFile("public/index.html", { root: "." });
// });

// module.exports = router;
