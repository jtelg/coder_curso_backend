import Contenedor from "../DAOs/index.js";
const funcCart = new Contenedor("carrito", process.env.DATABASE_USE);

const getByIdCarrito = async (id) => {
  const res = await funcCart.getById(id);
  res.forEach((item) => {
    item.productos = JSON.stringify(item.productos);
  });
  return res;
};
const getAllCarrito = async () => {
  const res = await funcCart.getAll();
  res.forEach((item) => {
    item.productos = JSON.stringify(item.productos);
  });
  return res;
};
const getxCampoCarrito = async (name, value) => {
  const res = await funcCart.getxCampo(name, value);
  res.forEach((item) => {
    item.productos = JSON.stringify(item.productos);
  });
  return res;
};
const getProds_xcarro = async (id) => {
  const res = await funcCart.getById(id);
  res.forEach((item) => {
    item.productos = JSON.stringify(item.productos);
  });
  return res;
};
const saveCarrito = async (producto) => {
  const res = await funcCart.save(producto);
  res.forEach((item) => {
    item.productos = JSON.stringify(item.productos);
  });
  return res;
};
const updatexCampoCarrito = async (id, name, value) => {
  const res = await funcCart.updatexCampo(id, name, value);
  res.forEach((item) => {
    item.productos = JSON.stringify(item.productos);
  });
  return res;
};
const deleteByIdCarrito = async (id) => {
  const res = await funcCart.deleteById(id);
  res.forEach((item) => {
    item.productos = JSON.stringify(item.productos);
  });
  return res;
};
const deleteProd_xcarro = async (id, idprod) => {
  const res = await funcCart.deleteById(id, idprod);
  res.forEach((item) => {
    item.productos = JSON.stringify(item.productos);
  });
  return res;
};

export default {
  getByIdCarrito,
  getAllCarrito,
  getxCampoCarrito,
  getProds_xcarro,
  saveCarrito,
  updatexCampoCarrito,
  deleteByIdCarrito,
  deleteProd_xcarro,
};
