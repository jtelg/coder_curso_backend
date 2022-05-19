const express = require("express");

const { Router } = express;
const router = Router();

const Contenedor = require("../utils/data_utils");
const funcCart = new Contenedor("carrito", "", "JSON");
const funcProd = new Contenedor("productos", "ultimo", 'MariaDB');
// crea un nuevo carrito
router.post("/", (req, res, next) => {
  try {
    funcCart.save({ productos: [] });
    res.status(200).send("Carro creado y listo para cargar productos!");
  } catch (error) {
    const errorprod = new Error("Error al cargar el producto " + error);
    error.httpStatusCode = 400;
    return next(errorprod);
  }
});

// vacia carrito
router.delete("/:id", (req, res) => {
  res.render("index");
});

router.delete("/:id", (req, res) => {
  const id = +req.params.id;
  if (id > 0) {
    funcCart.deleteById(+req.params.id);
    res.status(200).send("Producto del carro eliminado con exito");
  } else {
    res.send({
      error: -3,
      descripcion: "Producto no encontrado",
    });
  }
});

router.get("/:id/productos", async (req, res) => {
  res.send(JSON.stringify(funcCart.getProds_xcarro(+req.params.id)));
});

router.post("/:id/productos", async (req, res, next) => {
  // const io = req.app.get("socketio");
  const idcarro = +req.params.id;
  try {
    funcCart.saveProds_xcarro(idcarro, req.body);
    res.status(200).send("Producto agregado al carrito");
  } catch (error) {
    const errorprod = new Error("Error al cargar el producto" + error);
    error.httpStatusCode = 400;
    return next(errorprod);
  }
});

router.delete("/:id/productos/:id_prod", async (req, res) => {
  if (+req.params.id > 0 && +req.params.id_prod) {
    funcCart.deleteProd_xcarro(+req.params.id, +req.params.id_prod);
    res.status(200).send("Producto eliminado con exito del carrito");
  } else {
    res.send({
      error: -3,
      descripcion: "Producto no encontrado",
    });
  }
});

module.exports = router;
