const fs = require("fs");
const knex_mariaDB = require("../DB/config/mariaDB");
const knex_sqliteDB = require("../DB/config/sqliteDB");
const ContenedorFirebase = require("./contenedor/ContenedorFirebase");
const ProductosAPI_firebase = new ContenedorFirebase("productos");
// const ContenedorCarro = require("./contenedor/ContenedorMongoDb");
// const CarritoAPI_mnogoDB = new ContenedorCarro();
// const ProductosCRRO_firebase =
class Contenedor {
  constructor(nombre, posicion, DB) {
    this._DB = DB;
    if (this._DB !== "JSON") {
      this.tablename = nombre;
    } else {
      this.pathname = `./public/data/${nombre}.json`;
      this.posicion = posicion;
      // recupera los datos del txt y lo convierte en un array de objetos
      try {
        this.json = JSON.parse(fs.readFileSync(this.pathname, "utf-8"));
      } catch (error) {
        this.json = null;
      }
    }
  }

  async save(obj) {
    obj.timestamp = Date.now();
    obj.feccarga = new Date()
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "")
      .replace(/-/g, "/");
    switch (this._DB) {
      case "SqliteDB":
        return await knex_sqliteDB(this.tablename).insert(obj);

      case "MariaDB":
        return await knex_mariaDB(this.tablename).insert(obj);
      case "JSON":
        obj.id = Date.now();
        // lee el archivo, si existe recupera un array con objetos y le agrega el nuevo.
        if (this.json) {
          if (this.posicion === "ultimo") {
            this.json.unshift(obj);
          } else {
            this.json.push(obj);
          }
          this.escribirArchivo(this.json);
          return obj.id;
        }

      case "Firebase":
        ProductosAPI_firebase.guardar();
        break;
      case "MongoDB":
        CarritoAPI_mnogoDB.guardar();
        break;
    }
  }
  async getById(id) {
    if (this._DB !== "JSON") {
      if (this._DB === "SqliteDB") {
      }
    }
    switch (this._DB) {
      case "SqliteDB":
        return await knex_sqliteDB(this.tablename)
          .select("*")
          .where({ id: id });

      case "MariaDB":
        return await knex_mariaDB(this.tablename).select("*").where({ id: id });
      case "JSON":
        const obj = this.json.find((e) => e.id === id);
        if (obj) return obj;
      case "Firebase":
        ProductosAPI_firebase.listar(id);
        break;
      case "MongoDB":
        // CarritoAPI_mnogoDB.listar(id);
        break;
    }
    return null;
  }

  async getAll() {
    console.log(this._DB);
    switch (this._DB) {
      case "SqliteDB":
        return await knex_sqliteDB(this.tablename).select("*");
      case "MariaDB":
        return await knex_mariaDB(this.tablename).select("*");
      case "JSON":
        const obj = this.json;
        if (obj) return obj;
        break;
      case "Firebase":
        ProductosAPI_firebase.listarAll();
        break;
      case "MongoDB":
        // CarritoAPI_mnogoDB.listarAll();
        break;
    }
    return this.json ? this.json : [];
  }

  async deleteById(id) {
    switch (this._DB) {
      case "SqliteDB":
        return await knex_sqliteDB(this.tablename).where({ id: id }).del();
      case "MariaDB":
        return await knex_mariaDB(this.tablename).where({ id: id }).del();
      case "JSON":
        this.json = this.json.filter((e) => e.id !== id);
        this.escribirArchivo(this.json);
      case "Firebase":
        ProductosAPI_firebase.borrar(ids);
        break;
      case "MongoDB":
        CarritoAPI_mnogoDB.borrar(id);
        break;
    }
  }

  deleteAll() {
    this.escribirArchivo("");
  }

  escribirArchivo(dato) {
    dato = dato ? JSON.stringify(dato) : "";
    try {
      fs.writeFileSync(this.pathname, `${dato}`);
    } catch (error) {
      return `Error al escribir el archivo: ${error}`;
    }
  }

  // Funciones exclusivas de manejo de productos en el carro

  async saveProds_xcarro(idcarro, prod) {
    const list_carros = await this.getAll();
    const indexCarro = list_carros.findIndex((e) => e.id === idcarro);
    list_carros[indexCarro].productos.push(prod);
    this.escribirArchivo(list_carros);
  }
  async getProds_xcarro(idcarro) {
    const list_carros = await this.getAll();
    let obj_carro = {
      productos: [],
    };
    if (list_carros.length > 0) {
      obj_carro = list_carros.find((e) => e.id === +idcarro);
    }

    return obj_carro ? obj_carro.productos : [];
  }
  async deleteProd_xcarro(idcarro, id_prod) {
    const list_carros = await this.getAll();
    const obj_carro = list_carros.find((e) => e.id === idcarro);
    obj_carro.productos = obj_carro?.productos.filter((e) => e.id !== id_prod);
    this.escribirArchivo(list_carros);
  }
}
module.exports = Contenedor;
