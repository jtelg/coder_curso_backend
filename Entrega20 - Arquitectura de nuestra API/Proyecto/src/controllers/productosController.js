import modelProds from "../models/productosModels.js";

const ctrlProductos = {
  setProductoPage: async (req, res) => {
    const { user, arr_prods, carro } = await modelProds.setProductoPage(req);
    return res.render("index", {
      altaProd: true,
      user,
      arr_prods,
      carro,
    });
  },
  addNewProduct: async (req, res) => {
    try {
      modelProds.addNewProduct(req);
      res.end();
    } catch (error) {
      res.send({ error: "error al cargar producto " + error });
    }
  },
  deleteProductxID: async (req, res) => {
    const re = await modelProds.deleteProductxID(req);
    if (re) {
      res.status(200).send("Producto eliminado con exito");
    } else {
      res.send({
        error: -3,
        descripcion: "Producto no encontrado",
      });
    }
  },
  updProduct: async (req, res) => {
    modelProds.updProduct(req);
    res.send("Producto Modificado");
  },
  getProductxID: async (req) => {
    const { arr } = await modelProds.getProductxID(req);
    if (arr) {
      res.send({ arr });
    } else {
      res.send({ error: "Producto no encontrado" });
    }
  },
};

export default ctrlProductos;
