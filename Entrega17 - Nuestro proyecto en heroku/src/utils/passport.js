import bcrypt from "bcrypt";
import passport from "passport";
import passportLocal from "passport-local";
const LocalStrategy = passportLocal.Strategy;

import Contenedor from "./DB_functions.js";
const funcUser = new Contenedor("usuarios", process.env.DATABASE_USE);

passport.use(
  "register",
  new LocalStrategy(
    {
      usernameField: "user",
      passwordField: "password",
    },
    async function (user, password, done) {
      const userRE = await funcUser.getxCampo("email", user);
      if (userRE) return done(new Error("Usuario registrado"));
      const passHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
      const objUser = {
        email: user,
        password: passHash,
      };
      await funcUser.save(objUser);
      return done(null, objUser);
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
      console.log(password, userRE.password);
      if (!userRE || !bcrypt.compareSync(password, userRE.password)) return done(new Error("Usuario o password incorrecto"));
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
