const mongoose = require("mongoose");
const { Schema, model } = mongoose;
mongoose.connect(
  "mongodb+srv://coder_admin:admin123@clusterecoomercecoder.yho5b.mongodb.net/Ecommerce-coder?retryWrites=true&w=majority"
);

mongoose.connection.on("open", () => {
  console.log("base de datos conectada");
});

mongoose.connection.on("error", (err) => {
  console.log("Error en la conexion ", err);
});

const productSchema = new Schema({
  idprod: {
    type: Number,
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  codigo: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  imageurl: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Number,
    required: true,
  },
  feccarga: {
    type: String,
    required: true,
  },
});

const mensajeSchema = new Schema({
  idmsj: {
    type: Number,
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  msn: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Number,
    required: true,
  },
  feccarga: {
    type: String,
    required: true,
  },
});

model("producto", productSchema);
model("mensaje", mensajeSchema);
