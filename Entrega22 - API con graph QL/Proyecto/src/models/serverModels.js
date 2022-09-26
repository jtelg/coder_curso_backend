import dotenv from "../utils/dotenvUtils.js";
import SessionMidle from "../middlewares/sessionCtrl.js";
import Contenedor from "../DAOs/index.js";
const funcProd = new Contenedor("productos", process.env.DATABASE_USE);
const funcCart = new Contenedor("carrito", process.env.DATABASE_USE);

const modelServer = {
  setHomePage: async (req) => {
    const arr_prods = await funcProd.getAll();
    const carro =
      (await funcCart.getxCampo("iduser", req.session.iduser)) || false;

    if (carro) {
      arr_prods.forEach((prod) => {
        prod.check = false;
        if (carro?.productos?.find((e) => e.id === prod.id)) {
          prod.check = true;
        }
      });
    }
    const user = {
      nombre: req.session?.passport?.user,
      admin: SessionMidle.dataAdmin(req),
      iduser: req.session.iduser,
    };
    return { arr_prods, carro, user };
  },
  setInfoPage: (req) => {
    const lista = {
      ArgumentosEntrada: process.argv.slice(2),
      SistemaOperativo: process.platform,
      VersionNode: process.version,
      MemoriaReservada: process.memoryUsage.rss(),
      PathEjecucion: process.execPath,
      ProcessID: process.pid,
      CarpetaProyecto: process.cwd()
    };
    return { lista };
  },
};

export default modelServer;
