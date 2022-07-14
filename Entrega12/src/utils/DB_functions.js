import { readFileSync, writeFileSync } from "fs";
import knex_mariaDB from "../../DB/config/mariaDB.js";
import knex_sqliteDB from "../../DB/config/sqliteDB.js";
import ContenedorFirebase from "./Firebase_functions.js";
import ContenedorMongoDB from "./Mongo_functions.js";

class Contenedor {
  constructor(nombre, DB) {
    this._DB = DB;
    this.tablename = nombre;

    if (this._DB === "Firebase") {
      this.API_Firebase = new ContenedorFirebase(nombre);
    } else if (this._DB === "MongoDB") {
      this.API_mongoDB = new ContenedorMongoDB(nombre, "");
    } else if (this._DB === "JSON") {
      this.pathname = `./public/data/${nombre}.json`;
      // recupera los datos del txt y lo convierte en un array de objetos
      try {
        this.json = JSON.parse(readFileSync(this.pathname, "utf-8"));
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
    if (this._DB !== "Firebase") obj.id = Date.now();
    switch (this._DB) {
      case "SqliteDB":
        return await knex_sqliteDB(this.tablename).insert(obj);
      case "MariaDB":
        return await knex_mariaDB(this.tablename).insert(obj);
      case "JSON":
        // lee el archivo, si existe recupera un array con objetos y le agrega el nuevo.
        if (this.json) {
          this.json.push(obj);
          this.escribirArchivo(this.json);
          return obj.id;
        }
        obj.id = 0;
        this.escribirArchivo([obj]);
        return obj.id;
      case "Firebase":
        return this.API_Firebase.guardar(obj);
      case "MongoDB":
        return this.API_mongoDB.guardar(obj);
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
        return this.API_Firebase.listar(id);
      case "MongoDB":
        return this.API_mongoDB.listar(id);
    }
    return null;
  }

  async getAll() {
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
        return this.API_Firebase.listarAll();
      case "MongoDB":
        return this.API_mongoDB.listarAll();
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
        return this.API_Firebase.borrar(id);
      case "MongoDB":
        return this.API_mongoDB.borrar(id);
    }
  }

  deleteAll() {
    this.escribirArchivo("");
  }

  escribirArchivo(dato) {
    dato = dato ? JSON.stringify(dato) : "";
    try {
      writeFileSync(this.pathname, `${dato}`);
    } catch (error) {
      return `Error al escribir el archivo: ${error}`;
    }
  }

  // Funciones exclusivas de manejo de productos en el carro

  async saveProds_xcarro(idcarro, prod) {
    const list_carros = await this.getAll();
    const indexCarro = list_carros.findIndex(
      (e) => e.id.toString() === idcarro.toString()
    );
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
    const obj_carro = list_carros.find(
      (e) => e.id.toString() === idcarro.toString()
    );
    obj_carro.productos = obj_carro?.productos.filter(
      (e) => e.id.toString() !== id_prod.toString()
    );
    this.escribirArchivo(list_carros);
  }
}
export default Contenedor;
