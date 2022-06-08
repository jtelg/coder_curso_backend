const knex_mariaDB = require("knex")({
  client: "mysql",
  connection: {
    host: "sql405.main-hosting.eu",
    port: 3306,
    user: "u554787210_adminprueba",
    password: "Admin123",
    database: "u554787210_ecommerc_Coder",
  },
  pool: { min: 0, max: 7 },
});

knex_mariaDB.schema
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
    console.log("Tabla productos Creada");
  })
  .catch((err) => {
    throw err;
  });

knex_mariaDB.schema
  .createTableIfNotExists("mensajes", (table) => {
    table.increments("id").primary();
    table.string("nombre");
    table.string("msn");
    table.string("color");
    table.string("timestamp");
    table.string("feccarga");
  })
  .then(() => {
    console.log("Tabla mensajes Creada");
  })
  .catch((err) => {
    throw err;
  });

module.exports = knex_mariaDB;
