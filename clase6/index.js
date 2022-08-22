const express = require("express");

const app = express();

// GET

app.get("/", (req, res) => {
  res.status(201).send('<h1 style="color:blue;">Hola Mundo</h1>');
});

app.get("/json", (req, res) => {
  res.send('<h1 style="color:black;">Este es un formulario de contacto</h1>');
});

app.listen(8080, () => {
  console.log("server run in port 8080");
});
