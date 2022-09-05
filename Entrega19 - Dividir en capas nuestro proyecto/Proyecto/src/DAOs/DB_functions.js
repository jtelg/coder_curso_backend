import { readFileSync, writeFileSync } from "fs";
import knex_mariaDB from "../../DB/config/mariaDB.js";
import knex_sqliteDB from "../../DB/config/sqliteDB.js";
import ContenedorFirebase from "./Firebase_functions.js";
import ContenedorMongoDB from "./Mongo_functions.js";
import logger from "../utils/logger.js";
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
    try {
      obj.timestamp = Date.now();
      obj.feccarga = new Date()
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "")
        .replace(/-/g, "/");
      if (this._DB !== "Firebase") obj.id = Date.now();
      logger.info(`POST > en ${this.tablename} (${this._DB})`);
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
    } catch (error) {
      logger.error(
        `ERROR > en el POST en ${this.tablename} (${this._DB}) - ${error} - DB_functions.js:59`
      );
    }
  }
  async getById(id) {
    try {
      logger.info(
        `GET > por ID en ${this.tablename} (${this._DB}) - DB_functions.js:65`
      );
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
          return await knex_mariaDB(this.tablename)
            .select("*")
            .where({ id: id });
        case "JSON":
          const obj = this.json.find((e) => e.id === id);
          if (obj) return obj;
        case "Firebase":
          return this.API_Firebase.listar(id);
        case "MongoDB":
          return this.API_mongoDB.listar(id);
      }
    } catch (error) {
      logger.error(
        `ERROR > al buscar por ID en ${this.tablename} (${this._DB}) - ${error} - DB_functions.js:87`
      );
      return null;
    }
  }

  async getAll() {
    logger.info(
      `GET > ALL en ${this.tablename} (${this._DB}) - DB_functions.js:95`
    );
    try {
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
    } catch (error) {
      logger.error(
        `ERROR > al buscar listado en ${this.tablename} (${this._DB}) - ${error} - DB_functions.js:113`
      );
      return [];
    }
  }

  async getxCampo(name, value) {
    logger.info(
      `GET > ${name}: "${value}" en ${this.tablename} (${this._DB}) - DB_functions.js:120`
    );
    try {
      switch (this._DB) {
        case "SqliteDB":
          return await knex_sqliteDB(this.tablename)
            .select("*")
            .where({ email: name });
        case "MariaDB":
          return await knex_mariaDB(this.tablename)
            .select("*")
            .where({ email: name });
        case "JSON":
        case "Firebase":
          return this.API_Firebase.listar_xcampo(name, value);
        case "MongoDB":
          return this.API_mongoDB.listar_xcampo(name, value);
      }
      return this.json ? this.json : [];
    } catch (error) {
      logger.error(
        `ERROR > al buscar x campo en ${this.tablename} (${this._DB}) - ${error} - DB_functions.js:135`
      );
      return null;
    }
  }

  async updatexCampo(id, name, value) {
    logger.info(
      `UPDATE > ${name}: "${value}" en ${this.tablename} (${this._DB}) - DB_functions.js:141`
    );
    try {
      switch (this._DB) {
        case "SqliteDB":
          break;
        case "MariaDB":
          break;
        case "JSON":
          break;
        case "Firebase":
          break;
        case "MongoDB":
          return this.API_mongoDB.actualizarxCampo(id, name, value);
      }
      return this.json ? this.json : [];
    } catch (error) {
      logger.error(
        `ERROR > al buscar x campo en ${this.tablename} (${this._DB}) - ${error} - DB_functions.js:135`
      );
      return null;
    }
  }
  async getUserLogin(email, password) {
    logger.info(`GET > user login (${this._DB})  - DB_functions.js:181`);
    try {
      switch (this._DB) {
        case "SqliteDB":
        case "MariaDB":
        case "JSON":
        case "Firebase":
          return this.API_Firebase.user_login(email, password);
        case "MongoDB":
          return this.API_mongoDB.user_login(email, password);
      }
      return this.json ? this.json : [];
    } catch (error) {
      logger.error(
        `ERROR > user login (${this._DB}) - ${error} - DB_functions.js:155`
      );
      return null;
    }
  }

  async deleteById(id) {
    logger.info(
      `DELETE > x ID en ${this.tablename} (${this._DB}) - DB_functions.js:162`
    );
    try {
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
    } catch (error) {
      logger.error(
        `ERROR > al eliminar por ID en ${this.tablename} (${this._DB}) - ${error} - DB_functions.js:178`
      );
    }
  }

  deleteAll() {
    logger.info(
      `DELETE > ALL en ${this.tablename} (${this._DB}) - DB_functions.js:184`
    );
    try {
      this.escribirArchivo("");
    } catch (error) {
      logger.error(
        `ERROR > al eliminar todo en ${this.tablename} (${this._DB}) - ${error} - DB_functions.js:188`
      );
    }
  }

  escribirArchivo(dato) {
    logger.info(`Escribir archivo (${this._DB}) - DB_functions.js:240`);
    try {
      dato = dato ? JSON.stringify(dato) : "";
      try {
        writeFileSync(this.pathname, `${dato}`);
      } catch (error) {
        return `Error al escribir el archivo: ${error}`;
      }
    } catch (error) {
      logger.error(
        `ERROR > al escribir archivo (${this._DB}) - ${error} - DB_functions.js:203`
      );
    }
  }

  // Funciones exclusivas de manejo de productos en el carro

  // async saveProds_xcarro(idcarro, prod) {
  //   logger.info(`POST > Producto en ${this.tablename} (${this._DB}) - DB_functions.js:211`);
  //   try {
  //     const list_carros = await this.getAll();
  //     const indexCarro = list_carros.findIndex(
  //       (e) => e.id.toString() === idcarro.toString()
  //     );
  //     list_carros[indexCarro].productos.push(prod);
  //     this.escribirArchivo(list_carros);
  //   } catch (error) {
  //     logger.error(`ERROR > Al guardar producto en ${this.tablename} (${this._DB}) - ${error} - DB_functions.js:220`)
  //   }
  // }
  async getProds_xcarro(idcarro) {
    try {
      logger.info(`GET > x carro en ${this.tablename} (${this._DB}) - DB_functions.js:272`);
      const list_carros = await this.getAll();
      let obj_carro = {
        productos: [],
      };
      if (list_carros.length > 0) {
        obj_carro = list_carros.find((e) => e.id === +idcarro);
      }
      return obj_carro ? obj_carro.productos : [];
    } catch (error) {
      logger.error(
        `GET > Error al listar en ${this.tablename} (${this._DB}) - ${error} - DB_functions.js:236`
      );
      return [];
    }
  }
  async deleteProd_xcarro(idcarro, id_prod) {
    logger.info(`DETELE > PROD x carro en ${this.tablename} (${this._DB}) - DB_functions.js:289`);
    try {
      const list_carros = await this.getAll();
      const obj_carro = list_carros.find(
        (e) => e.id.toString() === idcarro.toString()
      );
      obj_carro.productos = obj_carro?.productos.filter(
        (e) => e.id.toString() !== id_prod.toString()
      );
      this.escribirArchivo(list_carros);
    } catch (error) {
      logger.error(
        `DETELE > PROD x carro ${this.tablename} (${this._DB}) - ${error} - DB_functions.js:301`
      );
    }
  }
}
export default Contenedor;
