import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import passport from "passport";
import passportLocal from "passport-local";
const LocalStrategy = passportLocal.Strategy;

import Contenedor from "../DAOs/DB_functions.js";
import logger from "./logger.js";
const funcUser = new Contenedor("usuarios", process.env.DATABASE_USE);

passport.use(
  "register",
  new LocalStrategy(
    {
      usernameField: "user",
      passwordField: "password",
      passReqToCallback: true,
    },
    async function (req, user, password, done) {
      const userRE = await funcUser.getxCampo("email", user);
      const file = req.file;
      if (userRE) {
        // elimina la imagen en caso de que se haya cargado
        if (file) fs.unlinkSync(file.path);
        return done(new Error("Usuario registrado"));
      }
      const passHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
      try {
        const objUser = {
          email: user,
          password: passHash,
          nombre: req.body.nombre,
          direccion: req.body.direccion,
          edad: req.body.edad,
          telefono: req.body.telefono,
        };
        const id = await funcUser.save(objUser);
        if (file) {
          const newPath = `public/image/users/${objUser.email}.jpg`;
          const oldPath = file.path;
          fs.renameSync(oldPath, newPath);
        }
        return done(null, objUser);
      } catch (error) {
        logger.error("ERROR > Error al agregar un usuario - passport.js:46");
        if (file) fs.unlinkSync(file.path);
        return done(new Error("Error al registrar"));
      }
    }
  )
);

passport.use(
  "auth",
  new LocalStrategy(
    {
      usernameField: "user",
      passwordField: "password",
    },
    async function (user, password, done) {
      const userRE = await funcUser.getxCampo("email", user);
      if (!userRE || !bcrypt.compareSync(password, userRE.password))
        return done(new Error("Usuario o password incorrecto"));
      return done(null, userRE);
    }
  )
);

passport.serializeUser((usuario, callback) => {
  callback(null, usuario.email);
});

passport.deserializeUser(async (user, callback) => {
  const userres = await funcUser.getxCampo("email", user);
  callback(null, userres);
});

export default passport;
