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
import sendMail from "../utils/mailer/sendMail.js";
import twiClient from "../utils/mailer/twilio/twilio.js";
const funcCart = new Contenedor("carrito", process.env.DATABASE_USE);
const funcUser = new Contenedor("usuarios", process.env.DATABASE_USE);
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
  const carro =
    (await funcCart.getxCampo("iduser", req.session.iduser)) || false;
  const user = {
    nombre: req.session?.passport?.user,
    admin: req.session.admin,
    iduser: req.session.iduser,
  };
  return res.render("index", {
    altaProd: false,
    user,
    prodsCarro: carro.productos,
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

router.put("/", dataUser, async (req, res, next) => {
  try {
    const ret = await funcCart.updatexCampo(
      req.body.id,
      req.body.key,
      req.body.value
    );
    req.body.user = await funcUser.getxCampo("email", req.body.user.nombre);
    sendMail.nuevaCompra(req);
    twiClient.sendMessage(
      "Su pedido fue recibido y se encuentra en proceso ¡Gracias!",
      req.body.user.telefono
    );
    twiClient.sendWhatsapp(
      `Nuevo pedido de ${req.body.user.nombre} - ${req.body.user.email}`,
      req.body.user.telefono
    );
    res.end();
  } catch (error) {
    const errorprod = new Error("Error al cargar el producto" + error);
    error.httpStatusCode = 400;
    return next(errorprod);
  }
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
