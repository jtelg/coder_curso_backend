
const PORT = process.env.PORT || 8080;
const express = require("express");
const routProd = require("./routes/productos");
const path = require("path");
const app = express();
app.use("/static", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");

app.use("/productos", routProd);

app.get("/", (req, res) => {
  res.redirect(301, '/productos')
});

app.listen(PORT, () => {
  console.log("server Run");
});
