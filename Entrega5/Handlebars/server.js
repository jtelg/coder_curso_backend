const express = require("express");
const routProd = require("./routes/productos");
const path = require("path");
const app = express();
const {engine} = require("express-handlebars");


app.set("view engine", "hbs");
app.set("views", "./views");

app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "main.hbs",
    LayoutsDir: __dirname + "/views/layouts/",
    partialsDir: __dirname + "/views/components/",
  })
);

app.use(express.json());
const PORT = process.env.PORT || 8080;
app.use(express.urlencoded({ extended: true }));





app.use("/static", express.static(__dirname + "/public"));

app.use("/productos", routProd);

// app.get('/', (req,res) => {
//   res.sendFile(path.join(__dirname + '/public/index.html'))
// })


app.get("/", (req, res) => {
  // res.render("index", { viewForm: true });
  res.redirect(301, '/productos').end()
});

app.listen(PORT, () => {
  console.log("server Run");
});
