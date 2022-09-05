import Contenedor from "../DAOs/DB_functions.js";
import sendMail from "../utils/mailer/sendMail.js";
import twiClient from "../utils/twilio.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import dotenv from "dotenv";
dotenv.config({ path: __dirname + "/../../.env" });

const funcCart = new Contenedor("carrito", process.env.DATABASE_USE);
const funcUser = new Contenedor("usuarios", process.env.DATABASE_USE);
const ctrlCarrito = {
  setCarritoPage: async (req, res) => {
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
  },
  postNewCart: async (req, res) => {
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
  },
  deleteCart: async (req, res) => {
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
  },
  setNewSale: async (req, res) => {
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
  },
  AddNewProduct: async (req, res, next) => {
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
  },
  getListProducts: async (req, res) => {
    res.send(JSON.stringify(funcCart.getProds_xcarro(+req.params.id)));
  },
};

export default ctrlCarrito;
