// import mongoose from 'mongoose'
import mongoose from "mongoose";
import config from "../../../DB/config/config.js";
import Iusos from "../../utils/MongoUtils.js";
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
const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  direccion: {
    type: String,
    required: true,
  },
  edad: {
    type: String,
    required: true,
  },
  telefono: {
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
const carritoSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  iduser: {
    type: String,
    required: true,
  },
  estado: {
    type: String,
    required: true,
  },
  productos: {
    type: Array,
    default: [],
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
  constructor(nombreColeccion) {
    let useSchema;
    switch (nombreColeccion) {
      case "productos":
        useSchema = prodSchema;
        break;
      case "mensajes":
        useSchema = msjSchema;
        break;
      case "usuarios":
        useSchema = userSchema;
        break;
      case "carrito":
        useSchema = carritoSchema;
        break;
    }
    this.coleccion = mongoose.model(nombreColeccion, useSchema);
    this.nombreColeccion = nombreColeccion;
  }

  async listar(id) {
    try {
      let filter = { _id: id };
      if (this.nombreColeccion === "carritos") {
        filter = { _id: id, estado: "Abierto" };
      }
      const docs = await this.coleccion.find(filter, { __v: 0 });
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

  async listar_xcampo(name, value) {
    try {
      let filter = { [name]: value };
      if (this.nombreColeccion === "carrito") {
        filter = { [name]: value, estado: "Abierto" };
      }
      const docs = await this.coleccion.find(filter, { __v: 0 });
      if (docs.length == 0) {
        return false;
      } else {
        const result = usos.renameField(usos.asPOJO(docs[0]), "_id", "id");
        return result;
      }
    } catch (error) {
      throw new Error(`Error al listar por id: ${error}`);
    }
  }

  async user_login(email, password) {
    try {
      const docs = await this.coleccion.find(
        { email: email, password: password },
        { __v: 0 }
      );
      if (docs.length == 0) {
        return false;
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
      console.error(`Error al listar todo: ${error}`);
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

  async actualizarxCampo(id, campo, valor) {
    try {
      let doc = await this.coleccion.updateOne({ _id: id }, { [campo]: valor });
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
