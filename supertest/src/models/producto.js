export const jsSchema = {
  id: {
    type: String,
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  precio: {
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
    required: false,
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
};
