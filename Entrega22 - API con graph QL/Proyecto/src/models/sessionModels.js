import sendMail from "../utils/mailer/sendMail.js";
import dotenv from "../utils/dotenvUtils.js";
import Contenedor from "../DAOs/index.js";
const funcUser = new Contenedor("usuarios", process.env.DATABASE_USE);
const funcCart = new Contenedor("carrito", process.env.DATABASE_USE);

const dataAdmin = (req) => {
  if (
    req.session?.user?.toLowerCase() === "admin" ||
    req.session?.passport?.user?.toLowerCase() === "admin" ||
    req.session?.admin ||
    req.query.admin
  ) {
    return true;
  }
  return false;
};

const modelSession = {
  setPerfilPage: async (req) => {
    const carro =
      (await funcCart.getxCampo("iduser", req.session.iduser)) || false;
    const user = await funcUser.getxCampo("email", req.params.id || req.session.user);
    user.nombreReal = user.nombre;
    user.nombre = user.email;
    return { user, carro };
  },
  setLogoutPage: async (req) => {
    const user = {
      nombre: req.session?.passport?.user,
      admin: req.session?.admin,
    };
    req.session.destroy((err) => {});
    return { user };
  },
  authUserLogin: async (req) => {
    req.session.user = req.user?.email;
    req.session.password = req.user?.password;
    req.session.iduser = req.user?.id;
    req.session.admin = false;
    if (dataAdmin(req)) {
      req.session.admin = true;
    }
    return true;
    // res.send({ data: "save" });
  },
  addNewUser: async (req) => {
    req.session.user = req.user?.email;
    req.session.password = req.user?.password;
    req.session.admin = false;
    req.session.iduser = req.user?.id;
    if (dataAdmin(req)) {
      req.session.admin = true;
    }
    sendMail.nuevoRegistro(req);
    return true;
  },
};

export default modelSession;
