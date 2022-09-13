import modelServer from "../models/serverModels.js";

const ctrlServer = {
  setHomePage: async (req, res) => {
    const { arr_prods, carro, user } = await modelServer.setHomePage(req);
    res.render("index", {
      altaProd: false,
      arr_prods,
      carro,
      user,
    });
  },
  setInfoPage: async (req, res) => {
    const { lista } = await modelServer.setInfoPage(req);
    res.json(lista);
    res.end();
  },
};

export default ctrlServer;
