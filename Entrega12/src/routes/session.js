import express from "express";

const { Router } = express;
const router = Router();

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import dotenv from "dotenv";
dotenv.config({ path: __dirname + "/../../.env" });

// productos y chats
// import Contenedor from "./utils/DB_functions.js";
// const funcProd = new Contenedor("productos", process.env.DATABASE_USE);
// const funcCart = new Contenedor("carrito", "JSON");

const dataAdmin = (req) => {
  if (
    req.session?.user?.toLowerCase() === "admin" ||
    req.session?.admin ||
    req.query.admin
  ) {
    return true;
  }
  return false;
};

router.get("/login", async (req, res) => {
  res.render("index", {
    session: true,
  });
});

router.post("/login", async (req, res) => {
  const { nombre } = req.body;
  if (nombre === "") {
    return res.redirect("/session/login/?Mesage=Usuario incorrecto");
  }
  req.session.user = nombre;
  req.session.admin = false;
  if (dataAdmin(req)) {
    req.session.admin = true;
  }
  res.redirect("/");
  // res.send({ data: "save" });
});

router.get("/logout", (req, res) => {
  const user = { nombre: req.session?.user, admin: req.session?.admin };
  req.session.destroy((err) => {
    if (err) {
      return res.json({ status: "Logout error", body: err });
    }
    res.render("index", {
      session: true,
      logout: true,
      user
    });
    // return res.redirect("/session/login");
  });
});

export default router;
