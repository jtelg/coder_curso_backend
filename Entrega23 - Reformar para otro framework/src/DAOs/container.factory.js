// import ContenedorFirebase from "./containers/Firebase_functions.js";
import ContenedorMongoDB from "./containers/Mongo_functions.js";
// import ContenedorMariaDB from "./containers/MariaDB_functions.js";
// import ContenedorSqliteDB from "./containers/SqliteDB_functions.js";
// import ContendorJSON from "./containers/Json_functions.js";

class ContenedorFactory {
  create(DB, nombre) {
    switch (DB) {
      case "Firebase":
        // return new ContenedorFirebase(nombre);
      case "MongoDB":
        return new ContenedorMongoDB(nombre);
      case "MariaDB":
        // return new ContenedorMariaDB(nombre);
      case "SqliteDB":
        // return new ContenedorSqliteDB(nombre);
      case "JSON":
        // return new ContendorJSON(nombre);
    }
  }
}

export default ContenedorFactory;
