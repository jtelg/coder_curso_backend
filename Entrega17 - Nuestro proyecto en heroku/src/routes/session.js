import express from "express";
const { Router } = express;
const router = Router();
import path from "path";
import { fileURLToPath } from "url";
import Contenedor from "../utils/DB_functions.js";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: __dirname + "/../../.env" });
import passport from "../utils/passport.js";
import logger from '../utils/logger.js'
router.use(passport.initialize());
router.use(passport.session());

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

router.get("/login", async (req, res) => {
  logger.info(`${req.method} ${req.url}`)
  res.render("index", {
    session: true,
  });
});

router.post("/login", passport.authenticate('auth'), async (req, res) => {
  logger.info(`${req.method} ${req.url}`)
  req.session.user = req.user?.email;
  req.session.password = req.user?.password;
  req.session.admin = false;
  if (dataAdmin(req)) {
    req.session.admin = true;
  }
  res.redirect("/");
  // res.send({ data: "save" });
});

router.get("/logout", (req, res) => {
  logger.info(`${req.method} ${req.url}`)
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
  logger.info(`${req.method} ${req.url}`)
  res.render("index", {
    session: true,
    register: true,
  });
});

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/session/login",
  }),
  async (req, res) => {
    logger.info(`${req.method} ${req.url}`)
    req.session.user = req.user?.email;
    req.session.password = req.user?.password;
    req.session.admin = false;
    if (dataAdmin(req)) {
      req.session.admin = true;
    }
    res.redirect("/");
    return res.end();
  }
);

router.use((error, req, res, next) => {
  logger.warn(`redirect "/session/login/?Mesage=" + error.message`)
  res.redirect("/session/login/?Mesage=" + error.message);
});

export default router;
