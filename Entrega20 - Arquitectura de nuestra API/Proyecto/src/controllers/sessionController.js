import modelSession from "../models/sessionModels.js";

const ctrlSession = {
  setPerfilPage: async (req, res) => {
    const { user, carro } = await modelSession.setPerfilPage(req);
    return res.render("index", {
      altaProd: false,
      perfilUser: true,
      user,
      carro,
    });
  },
  setLogoutPage: async (req, res) => {
    const { user } = await modelSession.setLogoutPage(req);
    res.render("index", {
      session: true,
      logout: true,
      user,
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
    modelSession.authUserLogin(req);
    res.redirect("/");
    // res.send({ data: "save" });
  },
  addNewUser: async (req, res) => {
    modelSession.addNewUser(req);
    res.redirect("/");
    return res.end();
  },
};

export default ctrlSession;
