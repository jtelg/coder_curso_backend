import modelsCarrito from "../models/carritoModels.js";

const ctrlCarrito = {
  setCarritoPage: async (req, res) => {
    const { user, carro } = await modelsCarrito.setCarritoPage(req);
    return res.render("index", {
      altaProd: false,
      user,
      prodsCarro: carro.productos,
      carro,
      carroView: true,
    });
  },
  postNewCart: async (req, res) => {
    try {
      const { resp } = await modelsCarrito.postNewCart(req);
      res.json(resp).end();
    } catch (error) {
      const errorprod = new Error("Error al cargar el producto " + error);
      error.httpStatusCode = 400;
      return next(errorprod);
    }
  },
  deleteCart: async (req, res) => {
    const { id } = await modelsCarrito.deleteCart(req);
    if (id) return res.end();
    return res.send({
      error: -3,
      descripcion: "Producto no encontrado",
    });
  },
  setNewSale: async (req, res) => {
    try {
      modelsCarrito.setNewSale(req);
      res.end();
    } catch (error) {
      const errorprod = new Error("Error al cargar el producto" + error);
      error.httpStatusCode = 400;
      return next(errorprod);
    }
  },
  AddNewProduct: async (req, res, next) => {
    try {
      modelsCarrito.AddNewProduct(req);
      res.end();
    } catch (error) {
      const errorprod = new Error("Error al cargar el producto" + error);
      error.httpStatusCode = 400;
      return next(errorprod);
    }
  },
  getListProducts: async (req, res) => {
    const { prods } = await modelsCarrito.getListProducts(req);
    res.send(JSON.stringify(prods));
  },
};

export default ctrlCarrito;
