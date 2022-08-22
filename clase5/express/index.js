const express = require('express');
const moment = require('moment');
const path = require('path');

const PORT = process.env.PORT || 8080;

const app = express();

app.get("/", (req, res) => {
    res.send(`<h1 style="color:blue;">Hola Mundo</h1>`);
})

app.get('/productos', (req,res) => {
    res.sendFile(path.join(__dirname + '/index.html'))
})
let counter = 0;
app.get('/visitas', (req,res) => {
    counter++;
    res.send({visitas: counter});
})

app.listen(PORT, () => {
    console.log('server Run');
})