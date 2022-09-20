import { expect } from "chai";
import supertest from "supertest";
import { describe, it } from "mocha";
import app from "./src/server.js";
import { productoGet } from "./generate/gerate.factory.js";

const request = supertest(app);

describe("API rest Test", () => {
  describe("Retorna producto por ID", () => {
    it("GET", async () => {
      let res = await request.get("/api/productos");
      expect(res.status).to.eql(200);
    });
  });

  describe("deberia incorporar un nuevo producto", async () => {
    let producto = productoGet.get();
    let res = await request.post("/api/productos").send(producto);
    expect(res.status).to.eql(200);
    const prod = res.body;
    expect(prod).to.include.keys(
      "id",
      "nombre",
      "precio",
      "stock",
      "codigo",
      "imageurl",
      "timestamp",
      "feccarga"
    );
    expect(prod.id).to.eql(producto.id)
    expect(prod.nombre).to.eql(producto.nombre)
    expect(prod.precio).to.eql(producto.precio)
    expect(prod.stock).to.eql(producto.stock)
    expect(prod.codigo).to.eql(producto.codigo)
    expect(prod.imageurl).to.eql(producto.imageurl)
    expect(prod.timestamp).to.eql(producto.timestamp)
    expect(prod.feccarga).to.eql(producto.feccarga)
  });
});
