import Contenedor from "../DAOs/index.js";
const funcUser = new Contenedor("mensajes", process.env.DATABASE_USE);

const getByIdMensaje = async (id) => {
  return await funcUser.getById(id);
};
const getAllMensaje = async () => {
  return await funcUser.getAll();
};
const getxCampoMensaje = async (name, value) => {
  return await funcUser.getxCampo(name, value);
};
const saveMensaje = async (mensaje) => {
  return await funcUser.save(mensaje);
};
const updatexCampoMensaje = async (id, name, value) => {
  return await funcUser.updatexCampo(id, name, value);
};
const deleteByIdMensaje = async (id) => {
  return await funcUser.deleteById(id);
};

export default {
  getByIdMensaje,
  getAllMensaje,
  getxCampoMensaje,
  saveMensaje,
  updatexCampoMensaje,
  deleteByIdMensaje,
};
