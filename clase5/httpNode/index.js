const http = require("http");
const moment = require("moment");
const server = http.createServer((req, res) => {
  console.log(req.url);
  switch (req.url) {
    case "/hora":
      res.end(`La hora es ${moment().format("HH:mm")}`);
      break;
  }
});

server.listen(8080, () => {
  console.log("Servidor conectado en el puerto 8080");
});
