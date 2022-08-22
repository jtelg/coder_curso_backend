const fbadmin = require("firebase-admin");

const serviceAccount = require("./DB/custer-41a83-firebase-adminsdk-n73cr-6389f1ba5b.json");

fbadmin.initializeApp({
  credential: fbadmin.credential.cert(serviceAccount),
  databaseURL: "http://custer-41a83.firebaseio.com",
});

const db_fb = fbadmin.firestore();

const db_query = db_fb.collection("producto");

const saveProducto = async () => {
  let doc = db_query.doc(`${Date.now()}`);
  await doc.create({ nombre: "Julian", age: 23 });
};
console.log("conexion a firebase OK");
