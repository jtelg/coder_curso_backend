import Contenedor from "../DAOs/index.js";
import sendMail from "../utils/mailer/sendMail.js";
import twiClient from "../utils/twilioUtils.js";
import dotenv from "../utils/dotenvUtils.js";

const funcCart = new Contenedor("carrito", process.env.DATABASE_USE);
const funcUser = new Contenedor("usuarios", process.env.DATABASE_USE);
const modelsCarrito = {
  setCarritoPage: async (req, res) => {
    const carro =
      (await funcCart.getxCampo("iduser", req.session.iduser)) || false;
    const user = {
      nombre: req.session?.passport?.user,
      admin: req.session.admin,
      iduser: req.session.iduser,
    };
    return { user, carro };
  },
  postNewCart: async (req) => {
    const newCarro = {
      iduser: req.body.iduser,
      estado: "Abierto",
    };
    const resp = await funcCart.save(newCarro);
    return { resp };
  },
  deleteCart: async (req) => {
    const id = +req.params.id;
    if (id) {
      return funcCart.deleteById(id);
    }
    return false;
  },
  setNewSale: async (req) => {
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
    return true;
  },
  AddNewProduct: async (req) => {
    const idcarro = req.params.id;
    const carro = req.body;
    const ret = await funcCart.updatexCampo(
      idcarro,
      "productos",
      carro.productos
    );
    return true;
  },
  getListProducts: async (req, res) => {
    const prods = funcCart.getProds_xcarro(+req.params.id);
    return { prods };
  },
};

export default modelsCarrito;
