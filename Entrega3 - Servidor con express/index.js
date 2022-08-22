const express = require("express");
const fs = require("fs");
const path = require('path');
const Contenedor = require('./data/functs.js');
const prods = new Contenedor('products');

const PORT = process.env.PORT || 8080;

const app = express();
let products = null;
let randomProd = null;
app.get("/productos", (req, res) => {
  try {
    res.status(200).send(`
      <pre style="font-family: Courier;background: #f4f4f4;border: solid 1px #e1e1e1;float: left;width: 100%;">
        ${JSON.stringify(prods.getAll(), null, " ").replace("[", "").replace("]", "")}
      </pre>`);
  } catch (error) {
    res.status(400).send({
      message: "Error!",
      error,
    });
  }
});

app.get("/productoRandom", (req, res) => {
  products = prods.getAll();
  try {
    randomProd = products[Math.floor(Math.random() * products.length)];
    res.status(200).send(`
      <pre style="font-family: Courier;background: #f4f4f4;border: solid 1px #e1e1e1;float: left;width: 100%;">
        ${JSON.stringify(randomProd, null, " ")
          .replace("[", "")
          .replace("]", "")}
      </pre>`);
  } catch (error) {
    res.status(400).send({
      message: "Error!",
      error,
    });
  }
});

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname + '/index.html'))
})

app.listen(PORT, () => {
  console.log("server Run");
});
