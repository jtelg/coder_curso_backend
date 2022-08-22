Se utilizo el CMD y aplico el siguiente listado de comandos:

// Inicializar mongo

- mongo

// Seleccion de base de datos

- use eCommerce

// Alta de colecciones a utilizar

- db.createCollection("mensajes");
- db.createCollection("productos");

// Insercion de datos documentos en la coleccion productos

- db.productos.insert(
  [
  {
  "nombre": "Firebase DB",
  "precio": 120,
  "stock": 24,
  "codigo": "AQU1",
  "descripcion": "",
  "imageurl": "https://source.unsplash.com/random/?shoes?",
  "id": 1,
  "timestamp": 1652364611366,
  "feccarga": "2022/05/12 14:10:11",
  "check": false
  },
  {
  "nombre": "Node JS",
  "precio": 580,
  "stock": 2,
  "codigo": "AH20",
  "descripcion": "",
  "imageurl": "https://source.unsplash.com/random/?shoes?",
  "id": 2,
  "timestamp": 1652364575753,
  "feccarga": "2022/05/12 14:09:35",
  "check": false
  },
  {
  "nombre": "Vue JS",
  "precio": 900,
  "stock": 1,
  "codigo": "AOR3",
  "descripcion": "",
  "imageurl": "https://source.unsplash.com/random/?shoes?",
  "id": 3,
  "timestamp": 1652364549219,
  "feccarga": "2022/05/12 14:09:09",
  "check": false
  },
  {
  "nombre": "Next JS",
  "precio": 1280,
  "stock": 20,
  "codigo": "AKO12",
  "descripcion": "",
  "imageurl": "https://source.unsplash.com/random/?shoes?",
  "id": 4,
  "timestamp": 1652364514044,
  "feccarga": "2022/05/12 14:08:34",
  "check": false
  },
  {
  "nombre": "Mongo DB",
  "precio": 1700,
  "stock": 10,
  "codigo": "AK22",
  "descripcion": "",
  "imageurl": "https://source.unsplash.com/random/?shoes?",
  "id": 5,
  "timestamp": 1652364431584,
  "feccarga": "2022/05/12 14:07:11",
  "check": false
  },
  {
  "nombre": "Mysql DB",
  "precio": 1700,
  "stock": 10,
  "codigo": "KO205",
  "descripcion": "",
  "imageurl": "https://source.unsplash.com/random/?shoes?",
  "id": 6,
  "timestamp": 1652363615173,
  "feccarga": "2022/05/12 13:53:35",
  "check": false
  },
  {
  "nombre": "Angular JS",
  "precio": 2300,
  "stock": 20,
  "codigo": "AK47",
  "descripcion": "",
  "imageurl": "https://source.unsplash.com/random/?shoes?",
  "id": 7,
  "timestamp": 1652363587073,
  "feccarga": "2022/05/12 13:53:07",
  "check": false
  },
  {
  "nombre": "React JS",
  "precio": 2860,
  "stock": 12,
  "codigo": "A430",
  "descripcion": "",
  "imageurl": "https://source.unsplash.com/random/?shoes?",
  "id": 8,
  "timestamp": 1652363515125,
  "feccarga": "2022/05/12 13:51:55",
  "check": false
  },
  {
  "nombre": "Maria DB",
  "precio": 3350,
  "stock": 12,
  "codigo": "A430",
  "descripcion": "",
  "imageurl": "https://source.unsplash.com/random/?shoes?",
  "id": 9,
  "timestamp": 1652363515125,
  "feccarga": "2022/05/12 13:51:55",
  "check": false
  },
  {
  "nombre": "SQL Server",
  "precio": 4990,
  "stock": 12,
  "codigo": "A430",
  "descripcion": "",
  "imageurl": "https://source.unsplash.com/random/?shoes?",
  "id": 10,
  "timestamp": 1652363515125,
  "feccarga": "2022/05/12 13:51:55",
  "check": false
  }
  ]
  );

// Listar productos agregados

- db.productos.find()

// Listar cantidad de productos agregados

- db.productos.count();

// Insercion de datos documentos en la coleccion productos

- db.mensajes.insert(
  [
  {
  "nombre": "Julian",
  "msn": "Hola",
  "color": "#000000",
  "id": 1,
  "timestamp": 1652410518925,
  "feccarga": "2022/05/13 02:55:18"
  },
  {
  "nombre": "Julian",
  "msn": "-..",
  "color": "#000000",
  "id": 2,
  "timestamp": 1652410523172,
  "feccarga": "2022/05/13 02:55:23"
  }
  ]
  )

// Listar mensajes agregados

- db.mensajes.find()

// Listar cantidad de mensajes agregados

- db.mensajes.count();

5.  a) Agregar un producto mas a la coleccion de productos

- db.productos.insertOne(
  {
  "nombre": "GitLab",
  "precio": 5000,
  "stock": 2,
  "codigo": "AH20",
  "descripcion": "",
  "imageurl": "https://source.unsplash.com/random/?shoes?",
  "id": 11,
  "timestamp": 1652364575753,
  "feccarga": "2022/05/12 14:09:35",
  "check": false
  }
  )

b) Realizar una consulta por nombre de producto especifico:

- db.productos.find({nombre: "GitLab"})

b - 1) Listar los productos con precio menor a 1000 pesos.

- db.productos.find({precio: {$lt: 1000} })

2. Listar los productos con precio entre 1000 y 3000 pesos.

- db.productos.find({precio: {$lt: 3000, $gt: 1000}})

3. Listar los productos con precio mayor a 3000 pesos.

- db.productos.find({precio: {$gt: 3000} })

iv) Realizar una consulta que solo traiga el nombre del 3er producto mas barato

- db.productos.find().sort({precio: 1}).skip(2).limit(1)[0].nombre

c) Hacer una actualizacion sobre todos los productos, agregando el campo stock a todos ellos con un valor de 100.

- db.productos.updateMany({}, { $set: {stock: 100}})

d) Cambiar el stock a cero de los productos con precio mayores a 4000.

- db.productos.updateMany({precio: {$gt: 4000}}, { $set: {stock: 0}})

e) Borrar los productos con precio menor a 1000

- db.productos.deleteMany({precio: {$lt: 1000}})

Crear un usuario "pepe" clave: "asd456" que solo pueda leer la base de datos. Verificar que pepe no pueda cambiar de informacion

- use admin
- db.createUser({user: "pepe", pwd: "asd456", roles: [{ role: "read", db: "eCommerce"}]})
