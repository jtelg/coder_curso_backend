// import mongoose from 'mongoose'
import mongoose from "mongoose";
import config from "../../DB/config/config.js";
import Iusos from "./objectUtils.js";
const usos = new Iusos();
mongoose.connect(config.mongodb.cnxStr);
const prodSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  codigo: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: false,
  },
  imageurl: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Number,
    required: true,
  },
  feccarga: {
    type: String,
    required: true,
  },
});
const msjSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  msn: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Number,
    required: true,
  },
  feccarga: {
    type: String,
    required: true,
  },
});
class ContenedorMongoDb {
  constructor(nombreColeccion, esquema) {
    let useSchema;
    switch (nombreColeccion) {
      case "productos":
        useSchema = prodSchema;
        break;
      case "mensajes":
        useSchema = msjSchema;
        break;
    }
    this.coleccion = mongoose.model(nombreColeccion, useSchema);
  }

  async listar(id) {
    try {
      const docs = await this.coleccion.find({ _id: id }, { __v: 0 });
      if (docs.length == 0) {
        throw new Error("Error al listar por id: no encontrado");
      } else {
        const result = usos.renameField(usos.asPOJO(docs[0]), "_id", "id");
        return result;
      }
    } catch (error) {
      throw new Error(`Error al listar por id: ${error}`);
    }
  }

  async listarAll() {
    try {
      let docs = await this.coleccion.find({}, { __v: 0 }).lean();
      docs = docs.map(usos.asPOJO);
      docs = docs.map((d) => usos.renameField(d, "_id", "id"));
      return docs;
    } catch (error) {
      console.log(`Error al listar todo: ${error}`);
    }
  }

  async guardar(nuevoElem) {
    try {
      let doc = await this.coleccion.create(nuevoElem);
      doc = usos.asPOJO(doc);
      usos.renameField(doc, "_id", "id");
      usos.removeField(doc, "__v");
      return doc;
    } catch (error) {
      throw new Error(`Error al guardar: ${error}`);
    }
  }

  async actualizar(nuevoElem) {
    try {
      usos.renameField(nuevoElem, "id", "_id");
      const { n, nModified } = await this.coleccion.replaceOne(
        { _id: nuevoElem._id },
        nuevoElem
      );
      if (n == 0 || nModified == 0) {
        throw new Error("Error al actualizar: no encontrado");
      } else {
        usos.renameField(nuevoElem, "_id", "id");
        usos.removeField(nuevoElem, "__v");
        return usos.asPOJO(nuevoElem);
      }
    } catch (error) {
      throw new Error(`Error al actualizar: ${error}`);
    }
  }

  async borrar(id) {
    try {
      const { n, nDeleted } = await this.coleccion.deleteOne({ _id: id });
      if (n == 0 || nDeleted == 0) {
        throw new Error("Error al borrar: no encontrado");
      }
    } catch (error) {
      throw new Error(`Error al borrar: ${error}`);
    }
  }

  async borrarAll() {
    try {
      await this.coleccion.deleteMany({});
    } catch (error) {
      throw new Error(`Error al borrar: ${error}`);
    }
  }
}

export default ContenedorMongoDb;
