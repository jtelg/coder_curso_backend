const knex_sqliteDB = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "./DB/ecommerce.sqlite",
  },
  useNullAsDefault: true
});

knex_sqliteDB.schema
  .createTableIfNotExists("productos", (table) => {
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
    console.log("Tabla productos Creada Sqlite");
  })
  .catch((err) => {
    throw err;
  });

knex_sqliteDB.schema
  .createTableIfNotExists("mensajes", (table) => {
    table.increments("id").primary();
    table.string("nombre");
    table.string("msn");
    table.string("color");
    table.string("feccarga");
    table.string("timestamp");
  })
  .then(() => {
    console.log("Tabla mensajes Creada Sqlite");
  })
  .catch((err) => {
    throw err;
  });

module.exports = knex_sqliteDB;
