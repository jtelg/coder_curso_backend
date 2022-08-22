const express = require("express");
const { faker } = require("@faker-js/faker");
const app = express();

const arr_data = [];

const createMoks = (cantidad = 25) => {
  for (let x = 0; x < cantidad; x++) {
    arr_data.push({
      nombre: faker.name.findName(),
      email: faker.internet.email(),
      website: faker.internet.url(),
      image: faker.image.avatar(),
    });
  }
};

app.get("/", (req, res) => {
  res.redirect(301, "/test");
});

app.get("/test", (req, res) => {
  createMoks();
  res.status(200).send(`
  <pre style="font-family: Courier;background: #f4f4f4;border: solid 1px #e1e1e1;float: left;width: 100%;">
    ${JSON.stringify(arr_data, null, " ").replace("[", "").replace("]", "")}
  </pre>`);
});

app.listen(8080, () => {
  console.log("server run in port http://localhost:8080");
});
