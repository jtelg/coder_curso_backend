import knex_sqliteDB from "../../../DB/config/sqliteDB.js";

class ContenedorSqliteDB {
  constructor(nombreColeccion) {
    this.tablename = nombreColeccion;
  }

  async listar(id) {
    try {
      return await knex_sqliteDB(this.tablename).select("*").where({ id: id });
    } catch (error) {
      throw new Error(`Error al listar por id: ${error}`);
    }
  }

  async listar_xcampo(name, value) {
    try {
      return await knex_sqliteDB(this.tablename)
        .select("*")
        .where({ [name]: value });
    } catch (error) {
      throw new Error(`Error al listar por campo ${name}: ${error}`);
    }
  }

  async user_login(email, password) {
    try {
      return await knex_sqliteDB(this.tablename)
        .select("*")
        .where({ email: email, password: password });
    } catch (error) {
      throw new Error(`Error al listar por email ${email}: ${error}`);
    }
  }

  async listarAll() {
    try {
      return await knex_sqliteDB(this.tablename).select("*");
    } catch (error) {
      console.error(`Error al listar todo: ${error}`);
    }
  }

  async guardar(nuevoElem) {
    try {
      return await knex_sqliteDB(this.tablename).insert(nuevoElem);
    } catch (error) {
      throw new Error(`Error al guardar: ${error}`);
    }
  }

  async actualizarxCampo(id, campo, valor) {
    try {
      return await knex_sqliteDB(this.tablename)
        .update({ [campo]: valor })
        .where({ id: id });
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
      return await knex_sqliteDB(this.tablename).where({ id: id }).del();
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
}

export default ContenedorSqliteDB;
