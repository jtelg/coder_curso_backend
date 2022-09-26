
import logger from "../utils/loggerUtils.js";
import ContenedorFactory from "./container.factory.js";
const daosFactory = new ContenedorFactory();
const instance = null;
class Contenedor {
  constructor(nombre, DB) {
    this._DB = DB;
    this.tablename = nombre;
    this.API_Daos = daosFactory.create(DB, nombre);
  }

  static getInstance() {
    if(!instance) instance = new Contenedor(this.tablename, this._DB);
    return instance;
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
      return this.API_Daos.guardar(obj);
    } catch (error) {
      logger.error(
        `ERROR > en el POST en ${this.tablename} (${this._DB}) - ${error} - DB_functions.js:59`
      );
    }
  }
  async updatexCampo(id, name, value) {
    logger.info(
      `UPDATE > ${name}: "${value}" en ${this.tablename} (${this._DB}) - DB_functions.js:141`
    );
    try {
      return this.API_Daos.actualizarxCampo(id, name, value);
    } catch (error) {
      logger.error(
        `ERROR > al buscar x campo en ${this.tablename} (${this._DB}) - ${error} - DB_functions.js:135`
      );
      return null;
    }
  }
  async getById(id) {
    try {
      logger.info(
        `GET > por ID en ${this.tablename} (${this._DB}) - DB_functions.js:65`
      );
      return this.API_Daos.listar(id);
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
      return this.API_Daos.listarAll();
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
      return this.API_Daos.listar_xcampo(name, value);
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
      return this.API_Daos.user_login(email, password);
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
      return this.API_Daos.borrar(id);
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
      this.API_Daos.borrarAll();
    } catch (error) {
      logger.error(
        `ERROR > al eliminar todo en ${this.tablename} (${this._DB}) - ${error} - DB_functions.js:188`
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
      logger.info(
        `GET > x carro en ${this.tablename} (${this._DB}) - DB_functions.js:272`
      );
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
    logger.info(
      `DETELE > PROD x carro en ${this.tablename} (${this._DB}) - DB_functions.js:289`
    );
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
