import Contenedor from "../DAOs/index.js";
const funcProd = new Contenedor("productos", process.env.DATABASE_USE);

const getByIdProducto = async (id) => {
  return await funcProd.getById(id);
};
const getAllProducto = async () => {
  return await funcProd.getAll();
};
const getxCampoProducto = async (name, value) => {
  return await funcProd.getxCampo(name, value);
};
const saveProducto = async (producto) => {
  return await funcProd.save(producto);
};
const updatexCampoProducto = async (id, name, value) => {
  return await funcProd.updatexCampo(id, name, value);
};
const deleteByIdProducto = async (id) => {
  return await funcProd.deleteById(id);
};

export default {
  getByIdProducto,
  getAllProducto,
  getxCampoProducto,
  saveProducto,
  updatexCampoProducto,
  deleteByIdProducto,
};
