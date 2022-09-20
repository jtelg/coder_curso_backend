import express from "express";
const { Router } = express;
const router = Router();
import multer from "multer";

import passport from "../utils/passportUtils.js";
import logger from "../utils/loggerUtils.js";
router.use(passport.initialize());
router.use(passport.session());

import ctrlSession from "../controllers/sessionController.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/image/users");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}.jpg`);
  },
});
const upload = multer({ storage: storage });

// set Perfil page
router.get("/perfil", async (req, res) => ctrlSession.setPerfilPage(req, res));
router.get("/perfil/:id", async (req, res) => ctrlSession.setPerfilPage(req, res));
// set Logout page
router.get("/logout", (req, res) => ctrlSession.setLogoutPage(req, res));
// set Register page
router.get("/register", (req, res) => ctrlSession.setRegisterPage(req, res));
// set Login page
router.get("/login", async (req, res) => ctrlSession.setLoginPage(req, res));
// auth user in login
router.post("/login", passport.authenticate("auth"), async (req, res) =>
  ctrlSession.authUserLogin(req, res)
);

router.post(
  "/register",
  upload.single("thumbnail"),
  passport.authenticate("register", {
    failureRedirect: "/session/login",
  }),
  async (req, res) => ctrlSession.addNewUser(req, res)
);

router.use((error, req, res, next) => {
  logger.warn(
    `REDIRECT > "/session/login/?Mesage=" ${error.message} - session.js:119`
  );
  res.redirect("/session/login/?Mesage=" + error.message);
});

export default router;
