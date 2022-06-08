let productosDao;
let carritosDao;

switch (process.env.PERS) {
  case "firebase":
    const { default: ProductosDaoFirebase } = await import(
      "./productos/firebase.js"
    );
    const { default: CarritosDaoFirebase } = await import(
      "./carritos/firebase.js"
    );

    productosDao = new ProductosDaoFirebase();
    carritosDao = new CarritosDaoFirebase();
    break;
  // case "mongodb":
  //   const { default: ProductosDaoMongoDb } = await import(
  //     "./productos/mongoDB.js"
  //   );
  //   const { default: CarritosDaoMongoDb } = await import(
  //     "./carritos/mongoDB.js"
  //   );

  //   productosDao = new ProductosDaoMongoDb();
  //   carritosDao = new CarritosDaoMongoDb();
  //   break;
}

export { productosDao, carritosDao };
