import Contenedor from "../DAOs/DB_functions.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import dotenv from "dotenv";
dotenv.config({ path: __dirname + "/../../.env" });
const funcProd = new Contenedor("productos", process.env.DATABASE_USE);
const funcCart = new Contenedor("carrito", process.env.DATABASE_USE);

const ctrlProductos = {
  setProductoPage: async (req, res) => {
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
    return res.render("index", {
      altaProd: true,
      user,
      arr_prods,
      carro,
    });
  },
  addNewProduct: async (req, res) => {
    const io = req.app.get("socketio");
    try {
      await funcProd.save(req.body);
      io.sockets.emit("productlist_back", await funcProd.getAll());
      res.end();
    } catch (error) {
      res.send({ error: "error al cargar producto " + error });
    }
  },
  deleteProductxID: async (req, res) => {
    const io = req.app.get("socketio");
    const id = req.params.id;
    if (id) {
      await funcProd.deleteById(id);
      io.sockets.emit("productlist_back", await funcProd.getAll());
      res.status(200).send("Producto eliminado con exito");
    } else {
      res.send({
        error: -3,
        descripcion: "Producto no encontrado",
      });
    }
  },
  updProduct: async (req, res) => {
    const id = +req.params.id;
    const prods = await funcProd.getAll();
    const prodindex = prods.findIndex((p) => p.id === id);
    prods[prodindex] = req.body;
    funcProd.escribirArchivo(prods);
    res.send("Producto Modificado");
  },
  getProductxID: async (req, res) => {
    const id = +req.params.id;
    const prods = await funcProd.getAll();
    arr = prods.find((p) => p.id === id);
    if (arr) {
      res.send({ arr });
    } else {
      res.send({ error: "Producto no encontrado" });
    }
  },
};

export default ctrlProductos;
