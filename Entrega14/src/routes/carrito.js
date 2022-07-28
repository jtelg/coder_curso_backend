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

const dataUser = (req, res, next) => {
  if (
    req.session?.passport?.user &&
    req.session?.passport?.user !== "" &&
    new Date(req.session?.cookie.expires) >= new Date()
  ) {
    return next();
  }
    return res.redirect("/session/login/?Mesage=Tiempo de sesion expirado");
};

// crea un nuevo carrito
router.post("/", (req, res, next) => {
  try {
    funcCart.save({ productos: [] });
    res.write("Carro creado con exito").end();
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
    res.end();
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

router.post("/:id/productos", dataUser, async (req, res) => {
  const io = req.app.get("socketio");
  const idcarro = req.params.id;
  try {
    await funcCart.saveProds_xcarro(idcarro, req.body);
    res.end();
  } catch (error) {
    const errorprod = new Error("Error al cargar el producto" + error);
    error.httpStatusCode = 400;
    return next(errorprod);
  }
});

router.delete("/:id/productos/:id_prod", dataUser, async (req, res) => {
  const io = req.app.get("socketio");
  const id = req.params.id;
  const idprod = req.params.id_prod;
  if (id && idprod) {
    await funcCart.deleteProd_xcarro(id, idprod);
    res.end();
  } else {
    res.send({
      error: -3,
      descripcion: "Producto no encontrado",
    });
  }
});

export default router;
