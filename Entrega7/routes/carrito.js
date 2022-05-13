const express = require("express");

const { Router } = express;
const router = Router();

const Contenedor = require("../utils/data_utils");
const funcCart = new Contenedor("carrito");

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

router.get("/:id/productos", (req, res) => {
  res.render("index");
});

router.post("/:id/productos", (req, res) => {
  // const io = req.app.get("socketio");
  const idcarro = +req.params.id;
  console.log(req.body);
  try {
    funcCart.saveProds_xcarro(idcarro, req.body);
    const arr_prods = funcProd.getAll();
    const arr_prodscart = funcCart.getProds_xcarro(601);
    if (arr_prodscart.length > 0) {
      arr_prods.forEach((prod) => {
        prod.check = false;
        if (arr_prodscart.find((e) => e.id === prod.id)) {
          prod.check = true;
        }
      });
    }
    io.sockets.emit("productcart_back", arr_prods);
    res.status(200).send("Producto agregado al carrito");
  } catch (error) {
    const errorprod = new Error("Error al cargar el producto" + error);
    error.httpStatusCode = 400;
    return next(errorprod);
  }
});

router.delete("/:id/productos/:id_prod", (req, res) => {
  if (+req.params.id > 0 && +req.params.id_prod) {
    funcCart.deleteProd_xcarro(+req.params.id, +req.params.id_prod);
    const arr_prods = funcProd.getAll();
    const arr_prodscart = funcCart.getProds_xcarro(601);
    if (arr_prodscart.length > 0) {
      arr_prods.forEach((prod) => {
        prod.check = false;
        if (arr_prodscart.find((e) => e.id === prod.id)) {
          prod.check = true;
        }
      });
    }
    io.sockets.emit("productcart_back", arr_prods);
    res.status(200).send("Producto eliminado con exito del carrito");
  } else {
    res.send({
      error: -3,
      descripcion: "Producto no encontrado",
    });
  }
});

module.exports = router;
