import { validarProducto } from "../validate/validate.factory.js.js";
import { daoProductos } from "../daos/daos.factory.js";

export default class ApiProductos {
  constructor() {
    this.productosDao = daoProductos;
  }

  async post(producto) {
    const { result, error } = validarProducto(producto);
    if (result) {
      try {
        const nuevoProducto = { ...producto, id: generarId() };
        await this.productosDao.create(nuevoProducto);
        console.info("Nuevo producto agregado");
        return nuevoProducto;
      } catch (error) {
        new Error(`Error al agregar un nuevo producto ${error}`);
      }
    } else {
      throw new Error(error);
    }
  }

  async get(query = {}) {
    try {
      const productos = await this.productosDao.find(query);
      return productos;
    } catch (error) {
      throw new Error(`Error en la lectura de productos ${error}`);
    }
  }
}
