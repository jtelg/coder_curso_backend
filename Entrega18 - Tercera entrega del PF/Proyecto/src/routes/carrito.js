import express from "express";

const { Router } = express;
const router = Router();

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import dotenv from "dotenv";
dotenv.config({ path: __dirname + "/../../.env" });

import Contenedor from "../utils/DB/DB_functions.js";
const funcCart = new Contenedor("carrito", process.env.DATABASE_USE);
const funcProd = new Contenedor("productos", process.env.DATABASE_USE);
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

router.get("/", async (req, res, next) => {
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
  return res.render("index", {
    altaProd: false,
    user,
    arr_prods,
    carro,
    carroView: true,
  });
});

// crea un nuevo carrito
router.post("/", async (req, res, next) => {
  const newCarro = {
    iduser: req.body.iduser,
    estado: "Abierto",
  };
  try {
    const resp = await funcCart.save(newCarro);
    res.json(resp).end();
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

router.put("/:id/productos", dataUser, async (req, res, next) => {
  const idcarro = req.params.id;
  const carro = req.body;
  try {
    const ret = await funcCart.updatexCampo(
      idcarro,
      "productos",
      carro.productos
    );
    res.end();
  } catch (error) {
    const errorprod = new Error("Error al cargar el producto" + error);
    error.httpStatusCode = 400;
    return next(errorprod);
  }
});

export default router;
