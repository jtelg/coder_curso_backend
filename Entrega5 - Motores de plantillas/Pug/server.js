
const PORT = process.env.PORT || 8080;
const express = require("express");
const routProd = require("./routes/productos");
const path = require("path");
const app = express();
app.use("/static", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("views", "./views");
app.set("view engine", "pug");








app.use("/productos", routProd);

// app.get('/', (req,res) => {
//   res.sendFile(path.join(__dirname + '/public/index.html'))
// })


app.get("/", (req, res) => {
  // res.render("index", { viewForm: true });
  res.redirect(301, '/productos')
});

app.listen(PORT, () => {
  console.log("server Run");
});
