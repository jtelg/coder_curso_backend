
import sendMail from "../utils/mailer/sendMail.js";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: __dirname + "/../../.env" });

import Contenedor from "../DAOs/DB_functions.js";
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

const ctrlSession = {
  setPerfilPage: async (req, res) => {
    const carro =
      (await funcCart.getxCampo("iduser", req.session.iduser)) || false;
    const user = await funcUser.getxCampo("email", req.session.user);
    user.nombreReal = user.nombre;
    user.nombre = user.email;
    return res.render("index", {
      altaProd: false,
      perfilUser: true,
      user,
      carro,
    });
  },
  setLogoutPage: async (req, res) => {
    const user = {
      nombre: req.session?.passport?.user,
      admin: req.session?.admin,
    };
    req.session.destroy((err) => {
      if (err) {
        return res.json({ status: "Logout error", body: err });
      }
      res.render("index", {
        session: true,
        logout: true,
        user,
      });
    });
  },
  setRegisterPage: async (req, res) => {
    res.render("index", {
      session: true,
      register: true,
    });
  },
  setLoginPage: async (req, res) => {
    res.render("index", {
      session: true,
    });
  },
  authUserLogin: async (req, res) => {
    req.session.user = req.user?.email;
    req.session.password = req.user?.password;
    req.session.iduser = req.user?.id;
    req.session.admin = false;
    if (dataAdmin(req)) {
      req.session.admin = true;
    }
    res.redirect("/");
    // res.send({ data: "save" });
  },
  addNewUser: async (req, res) => {
    req.session.user = req.user?.email;
    req.session.password = req.user?.password;
    req.session.admin = false;
    req.session.iduser = req.user?.id;
    if (dataAdmin(req)) {
      req.session.admin = true;
    }
    res.redirect("/");
    sendMail.nuevoRegistro(req);
    return res.end();
  },
};

export default ctrlSession;
