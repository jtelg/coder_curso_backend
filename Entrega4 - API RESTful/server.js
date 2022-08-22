const express = require("express");
const routProd = require('./routes/producto')
const path = require('path');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static(__dirname + '/public'));

app.use("/api/producto", routProd);


app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname + '/routes/public/index.html'))
})

app.listen(PORT, () => {
  console.log("server Run");
});
