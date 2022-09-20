import mongoose from 'mongoose'
import { jsSchema as productoSchema } from '../models/producto.js'
const Schema = mongoose.Schema

const productosDao = mongoose.model('Productos', new Schema(productoSchema))

class DaoProductos {
   constructor() {
       return productosDao
   }
}

export default DaoProductos