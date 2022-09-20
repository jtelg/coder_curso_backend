import DaoProductosMongoDb from "./daoProductosMongoDb.js";
import DaoProductosMem from "./daoProductosMem.js";

const persistencia = process.env.PERSISTENCIA || "MEM";

let daoProductos;
switch (persistencia) {
  case "MONGO":
    daoProductos = new DaoProductosMongoDb();
    break;
  default:
    daoProductos = new DaoProductosMem();
}

export { daoProductos };
