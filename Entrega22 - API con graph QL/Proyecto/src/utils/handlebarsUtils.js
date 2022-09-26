import { engine } from "express-handlebars";
import Handlebars from "handlebars";

const handleCli = {
  initialize: (app) => {
    // Coneccion y configuracion al motor de plantillas handlebars
    app.set("view engine", "hbs");
    app.set("views", "./src/views");
    app.engine(
      "hbs",
      engine({
        extname: ".hbs",
        defaultLayout: "main.hbs",
        LayoutsDir: "./src/views/layouts/",
        partialsDir: "./src/views/components/",
      })
    );
    // setea handlebars para enviar un objeto como parametro desde html a js
    Handlebars.registerHelper("json", function (context) {
      return JSON.stringify(context);
    });
  },
};
export default handleCli;
