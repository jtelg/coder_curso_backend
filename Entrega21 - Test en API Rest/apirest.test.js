import { expect } from "chai";
import supertest from "supertest";
import { describe, it } from "mocha";

const request = supertest("http://localhost:8080");

describe("API rest Usuarios", () => {
  it("GET > Setea pagina de registro y renderiza", async () => {
    let response = await request.get("/session/register");
    expect(response.status).to.eql(200);
  });
  it("GET > Setea pagina de perfil y renderiza", async () => {
    let response = await request.get("/session/perfil/admin");
    expect(response.status).to.eql(200);
  });
  it("GET > Setea pagina de logeo y renderiza", async () => {
    let response = await request.get("/session/login");
    expect(response.status).to.eql(200);
  });
  it("GET > Deslogea usuario y renderiza pagina de logeo", async () => {
    let response = await request.get("/session/logout");
    expect(response.status).to.eql(200);
  });
  it("POST > AuthUserLogin - Se logea un usuario y lo redirecciona al inicio", async () => {
    let usuario = { user: "admin", password: "admin" };
    let response = await request
      .post("/session/login")
      .type("json")
      .send(usuario);
    expect(response.status).to.eql(302);
    const user = response.body;
    expect(user).to.include.keys("user", "password");
    expect(user.user).to.eql(usuario.user);
    expect(user.password).to.eql(usuario.password);
  });
  it("POST > register User - Se registra un usuario y lo redirecciona al inicio", async () => {
    let usuario = {
      email: "admin",
      password: "admin",
      nombre: "Admin",
      direccion: "admin 123",
      edad: "1",
      telefono: "111",
    };
    let response = await request
      .post("/session/register")
      .type("json")
      .send(usuario);
    expect(response.status).to.eql(302);
    const user = response.body;
    expect(user).to.include.keys(
      "email",
      "password",
      "nombre",
      "direccion",
      "edad",
      "telefono"
    );
    expect(user.user).to.eql(usuario.user);
    expect(user.password).to.eql(usuario.password);
    expect(user.nombre).to.eql(usuario.nombre);
    expect(user.direccion).to.eql(usuario.direccion);
    expect(user.edad).to.eql(usuario.edad);
    expect(user.telefono).to.eql(usuario.telefono);
  });
});

describe("API rest Productos", () => {
  it("GET > Obtiene listado de productos y renderiza Productos page", async () => {
    let response = await request.get("/productos");
    expect(response.status).to.eql(302);
  });
  it("GET > Obtiene producto por id", async () => {
    let response = await request.get("/productos/1656345495544");
    expect(response.status).to.eql(200);
  });
  it("POST > Agrega un nuevo producto y redirige a pagina de productos con lista de prods actualizada", async () => {
    let producto = {
      id: 1,
      nombre: 'celular',
      precio: 25,
      stock: 10,
      codigo: 'A25',
      imageurl: ''
    };
    let res = await request.post("/productos").send(producto);
    expect(res.status).to.eql(302);
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
    expect(prod.id).to.eql(producto.id);
    expect(prod.nombre).to.eql(producto.nombre);
    expect(prod.precio).to.eql(producto.precio);
    expect(prod.stock).to.eql(producto.stock);
    expect(prod.codigo).to.eql(producto.codigo);
    expect(prod.imageurl).to.eql(producto.imageurl);
    expect(prod.timestamp).to.eql(producto.timestamp);
    expect(prod.feccarga).to.eql(producto.feccarga);
  });
  it("DELETE > Elimina prod por id y redirige a la page de productos con la lista de prods actualizada", async () => {
    let response = await request.delete("/productos/1656345495544");
    expect(response.status).to.eql(302);
  });
  it("PUT > Modifica producto", async () => {
    let producto = {
      id: 1,
      nombre: 'celular',
      precio: 25,
      stock: 10,
      codigo: 'A25',
      imageurl: '',
      timestamp: Date.now(),
      feccarga: new Date().toLocaleDateString()
    };
    let res = await request.put("/productos/1656345495544").send(producto);
    expect(res.status).to.eql(302);
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
    expect(prod.id).to.eql(producto.id);
    expect(prod.nombre).to.eql(producto.nombre);
    expect(prod.precio).to.eql(producto.precio);
    expect(prod.stock).to.eql(producto.stock);
    expect(prod.codigo).to.eql(producto.codigo);
    expect(prod.imageurl).to.eql(producto.imageurl);
    expect(prod.timestamp).to.eql(producto.timestamp);
    expect(prod.feccarga).to.eql(producto.feccarga);
  });
});

describe("API rest Carrito", () => {
  it("GET > Setea pagina de carrito y renderiza", async () => {
    let response = await request.get("/carrito");
    expect(response.status).to.eql(200);
  });
  it("GET > Listado de productos por ID de carro", async () => {
    let response = await request.get("/carrito/1/productos");
    expect(response.status).to.eql(200);
  });
  it("POST > Crea un nuevo carro por id de usuario", async () => {
    let carrito = {
      iduser: 1,
      estado: 'Abierto',
      productos: []
    };
    let res = await request.post("/carrito").send(carrito);
    expect(res.status).to.eql(200);
    const carro = res.body;
    expect(carro).to.include.keys(
      "iduser",
      "estado",
      "productos"
    );
    expect(carro.iduser).to.eql(carrito.iduser);
    expect(carro.estado).to.eql(carrito.estado);
    expect(carro.productos).to.eql(carrito.productos);
  });
  it("PUT > Nueva venta, modifica estado de carrito a finalizado", async () => {
    let carrito = {
      id: 1,
      key: 'estado',
      value: 'Finalizado'
    };
    let res = await request.put("/carrito").send(carrito);
    expect(res.status).to.eql(302);
    const carro = res.body;
    expect(carro).to.include.keys(
      "id",
      "key",
      "value"
    );
    expect(carro.id).to.eql(carrito.id);
    expect(carro.key).to.eql(carrito.key);
    expect(carro.value).to.eql(carrito.value);
  });
  it("PUT > Agrega nuevo productos al carrito", async () => {
    let carrito = {
      productos: []
    };
    let res = await request.put("/carrito/1/productos").send(carrito);
    expect(res.status).to.eql(302);
    const carro = res.body;
    expect(carro).to.include.keys(
      "id",
      "key",
      "value"
    );
    expect(carro.id).to.eql(carrito.id);
    expect(carro.key).to.eql(carrito.key);
    expect(carro.value).to.eql(carrito.value);
  });
  it("DELETE > Elimina carrito x id", async () => {
    let response = await request.delete("/carrito/1");
    expect(response.status).to.eql(200);
  });
});
