import express from "express";
const { Router } = express;
const router = Router();
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: __dirname + "/../../.env" });
import passport from "../utils/passport.js";
import logger from "../utils/logger.js";
import sendMail from "../utils/mailer/sendMail.js";
router.use(passport.initialize());
router.use(passport.session());

import Contenedor from "../utils/DB/DB_functions.js";
const funcUser = new Contenedor("usuarios", process.env.DATABASE_USE);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/image/users");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}.jpg`);
  },
});
const upload = multer({ storage: storage });

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

router.get("/perfil", async (req, res, next) => {
  
  const user = await funcUser.getxCampo('email', req.session.user)
  return res.render("index", {
    altaProd: false,
    perfilUser: true,
    user
  });
});

router.get("/login", async (req, res) => {
  res.render("index", {
    session: true,
  });
});

router.post("/login", passport.authenticate("auth"), async (req, res) => {
  req.session.user = req.user?.email;
  req.session.password = req.user?.password;
  req.session.iduser = req.user?.id;
  req.session.admin = false;
  if (dataAdmin(req)) {
    req.session.admin = true;
  }
  res.redirect("/");
  // res.send({ data: "save" });
});

router.get("/logout", (req, res) => {
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
    // return res.redirect("/session/login");
  });
});

router.get("/register", (req, res) => {
  res.render("index", {
    session: true,
    register: true,
  });
});

router.post(
  "/register",
  upload.single("thumbnail"),
  passport.authenticate("register", {
    failureRedirect: "/session/login",
  }),
  async (req, res) => {
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
  }
);



router.use((error, req, res, next) => {
  logger.warn(`redirect "/session/login/?Mesage=" + error.message`);
  res.redirect("/session/login/?Mesage=" + error.message);
});

export default router;
