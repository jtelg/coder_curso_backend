import DB_knex_sqliteDB from "knex";

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import dotenv from "dotenv";
dotenv.config({ path: __dirname + "/../../.env" });

const knex_sqliteDB = DB_knex_sqliteDB({
  client: "mysql",
  connection: {
    host: process.env.SQL_HOST,
    port: process.env.SQL_PORT,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
  },
  pool: { min: 0, max: 7 },
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

export default knex_sqliteDB;
