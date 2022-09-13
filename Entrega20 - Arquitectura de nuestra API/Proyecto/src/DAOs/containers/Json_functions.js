import { readFileSync, writeFileSync } from "fs";
class ContendorJSON {
  constructor(nombreColeccion) {
    this.pathname = `./public/data/${nombreColeccion}.json`;
    // recupera los datos del txt y lo convierte en un array de objetos
    try {
      this.json = JSON.parse(readFileSync(this.pathname, "utf-8"));
    } catch (error) {
      this.json = null;
    }
  }

  async listar(id) {
    try {
      const obj = this.json.find((e) => e.id === id);
      if (obj) return obj;
      return null;
    } catch (error) {
      throw new Error(`Error al listar por id: ${error}`);
    }
  }

  async listar_xcampo(name, value) {
    try {
    } catch (error) {
      throw new Error(`Error al listar por campo ${name}: ${error}`);
    }
  }

  async user_login(email, password) {
    try {
    } catch (error) {
      throw new Error(`Error al listar por email ${email}: ${error}`);
    }
  }

  async listarAll() {
    try {
      const obj = this.json;
      if (obj) return obj;
      return [];
    } catch (error) {
      console.error(`Error al listar todo: ${error}`);
    }
  }

  async guardar(nuevoElem) {
    try {
      // lee el archivo, si existe recupera un array con objetos y le agrega el nuevo.
      if (this.json) {
        this.json.push(obj);
        this.escribirArchivo(this.json);
        return obj.id;
      }
      obj.id = 0;
      this.escribirArchivo([obj]);
      return obj.id;
    } catch (error) {
      throw new Error(`Error al guardar: ${error}`);
    }
  }

  async actualizarxCampo(id, campo, valor) {
    try {
    } catch (error) {
      throw new Error(`Error al guardar: ${error}`);
    }
  }

  async actualizar(nuevoElem) {
    try {
    } catch (error) {
      throw new Error(`Error al actualizar: ${error}`);
    }
  }

  async borrar(id) {
    try {
      this.json = this.json.filter((e) => e.id !== id);
      this.escribirArchivo(this.json);
    } catch (error) {
      throw new Error(`Error al borrar: ${error}`);
    }
  }

  async borrarAll() {
    try {
    } catch (error) {
      throw new Error(`Error al borrar: ${error}`);
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
}

export default ContendorJSON;
