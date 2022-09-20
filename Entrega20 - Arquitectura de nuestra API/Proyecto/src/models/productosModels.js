import Contenedor from "../DAOs/index.js";
import dotenv from "../utils/dotenvUtils.js";
const funcCart = new Contenedor("carrito", process.env.DATABASE_USE);
const funcProd = new Contenedor("productos", process.env.DATABASE_USE);
const modelProds = {
  setProductoPage: async (req) => {
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
      admin: req.session.admin,
      iduser: req.session.iduser,
    };
    const io = req.app.get("socketio");
    //Coneccion Socket
    io.on("connection", async (socket) => {
      io.sockets.emit("productlist_back", arr_prods);
    });
    return { arr_prods, carro, user };
  },
  addNewProduct: async (req) => {
    const io = req.app.get("socketio");
    await funcProd.save(req.body);
    io.sockets.emit("productlist_back", await funcProd.getAll());
    return true;
  },
  deleteProductxID: async (req) => {
    const io = req.app.get("socketio");
    const id = req.params.id;
    if (id) {
      await funcProd.deleteById(id);
      io.sockets.emit("productlist_back", await funcProd.getAll());
      return true;
    } else {
      return false;
    }
  },
  updProduct: async (req) => {
    const id = +req.params.id;
    const prods = await funcProd.getAll();
    const prodindex = prods.findIndex((p) => p.id === id);
    prods[prodindex] = req.body;
    funcProd.escribirArchivo(prods);
    return true;
  },
  getProductxID: async (req) => {
    const id = +req.params.id;
    const prods = await funcProd.getAll();
    const arr = prods.find((p) => p.id === id);
    return { arr };
  },
};
export default modelProds;
