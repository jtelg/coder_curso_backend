import express from "express";

const { Router } = express;
const router = Router();

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import dotenv from "dotenv";
dotenv.config({ path: __dirname + "/../../.env" });

import Contenedor from "../utils/DB_functions.js";
const funcCart = new Contenedor("carrito", "JSON");
const funcProd = new Contenedor("productos", process.env.DATABASE_USE);

const returnProdscheck = async () => {
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
  return arr_prods;
};
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
  const id = req.params.id;
  if (id) {
    funcCart.deleteById(id);
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
  const io = req.app.get("socketio");
  const idcarro = req.params.id;
  try {
    funcCart.saveProds_xcarro(idcarro, req.body);
    // io.sockets.emit("prodsHome_back", await returnProdscheck());
    res.status(200).send("Producto agregado al carrito");
  } catch (error) {
    const errorprod = new Error("Error al cargar el producto" + error);
    error.httpStatusCode = 400;
    return next(errorprod);
  }
});

router.delete("/:id/productos/:id_prod", async (req, res) => {
  const io = req.app.get("socketio");
  const id = req.params.id;
  const idprod = req.params.id_prod;
  if (id && idprod) {
    funcCart.deleteProd_xcarro(id, idprod);
    // io.sockets.emit("prodsHome_back", await returnProdscheck());
    res.status(200).send("Producto eliminado con exito del carrito");
  } else {
    res.send({
      error: -3,
      descripcion: "Producto no encontrado",
    });
  }
});

export default router;
