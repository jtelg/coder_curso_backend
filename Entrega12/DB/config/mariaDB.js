import DB_knex_mariaDB from "knex";

const knex_mariaDB = DB_knex_mariaDB({
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
  .hasTable("productos")
  .then((exist) => {
    if (exist) return;
    schema
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
        console.log("Tabla productos creada");
      })
      .catch((err) => {
        throw err;
      });
  })
  .catch((err) => {
    throw err;
  });

knex_mariaDB.schema
  .hasTable("mensajes")
  .then((exists) => {
    if (exists) return;
    schema
      .createTable("mensajes", (table) => {
        table.increments("id").primary();
        table.string("nombre");
        table.string("msn");
        table.string("color");
        table.string("timestamp");
        table.string("feccarga");
      })
      .then(() => {
        console.log("Tabla mensajes creada");
      })
      .catch((err) => {
        throw err;
      });
  })
  .catch((err) => {
    throw err;
  });

export default knex_mariaDB;
