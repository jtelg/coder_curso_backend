import DB_knex_sqliteDB from "knex";

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import dotenv from "dotenv";
dotenv.config({ path: __dirname + "/../../.env" });

const knex_sqliteDB = DB_knex_sqliteDB({
  client: "sqlite3",
  connection: {
    filename: "./DB/ecommerce.sqlite",
  },
  useNullAsDefault: true
});
knex_sqliteDB.schema
  .hasTable("productos")
  .then((exist) => {
    if (exist) return;
    knex_sqliteDB.schema
      .createTable("productos", (table) => {
        table.increments("id").primary();
        table.string("nombre");
        table.decimal("precio", 14, 2);
        table.string("stock");
        table.string("codigo");
        table.string("descripcion");
        table.string("imageurl");
        table.string("timestamp");
        table.string("feccarga");
      })
      .then(() => {
        console.table("Tabla productos creada");
      })
      .catch((err) => {
        throw err;
      });
  })
  .catch((err) => {
    throw err;
  });

knex_sqliteDB.schema
  .hasTable("mensajes")
  .then((exists) => {
    if (exists) return;
    knex_sqliteDB.schema
      .createTable("mensajes", (table) => {
        table.increments("id").primary();
        table.string("nombre");
        table.string("msn");
        table.string("color");
        table.string("timestamp");
        table.string("feccarga");
      })
      .then(() => {
        console.table("Tabla mensajes creada");
      })
      .catch((err) => {
        throw err;
      });
  })
  .catch((err) => {
    throw err;
  });

  knex_sqliteDB.schema
  .hasTable("usuarios")
  .then((exists) => {
    if (exists) return;
    knex_sqliteDB.schema
      .createTable("usuarios", (table) => {
        table.increments("id").primary();
        table.string("email");
        table.string("password");
        table.string("nombre");
        table.string("direccion");
        table.string("edad");
        table.string("telefono");
        table.string("timestamp");
        table.string("feccarga");
      })
      .then(() => {
        console.table("Tabla usuarios creada");
      })
      .catch((err) => {
        throw err;
      });
  })
  .catch((err) => {
    throw err;
  });

export default knex_sqliteDB;
