import Contenedor from "../DAOs/index.js";
const funcUser = new Contenedor("usuarios", process.env.DATABASE_USE);

const getByIdUsuario = async (id) => {
  return await funcUser.getById(id);
};
const getAllUsuario = async () => {
  return await funcUser.getAll();
};
const getxCampoUsuario = async (name, value) => {
  return await funcUser.getxCampo(name, value);
};
const getUserLogin = async (email, password) => {
    return await funcUser.getUserLogin(email, password);
  };
const saveUsuario = async (usuario) => {
  return await funcUser.save(usuario);
};
const updatexCampoUsuario = async (id, name, value) => {
  return await funcUser.updatexCampo(id, name, value);
};
const deleteByIdUsuario = async (id) => {
  return await funcUser.deleteById(id);
};

export default {
  getByIdUsuario,
  getAllUsuario,
  getxCampoUsuario,
  getUserLogin,
  saveUsuario,
  updatexCampoUsuario,
  deleteByIdUsuario,
};
