export default class Producto {
  _id;
  _nombre;
  _precio;
  _stock;
  _codigo;
  _descripcion;
  _imageurl;
  _timestamp;
  _feccarga;

  constructor({
    id,
    nombre,
    precio,
    stock,
    codigo,
    descripcion,
    imageurl,
    timestamp,
    feccarga,
  }) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.stock = stock;
    this.codigo = codigo;
    this.descripcion = descripcion;
    this.imageurl = imageurl;
    this.timestamp = timestamp;
    this.feccarga = feccarga;
  }

  get id() {
    return this._id;
  }
  set id(id) {
    return (this._id = id);
  }
  get nombre() {
    return this._nombre;
  }
  set nombre(nombre) {
    return (this._nombre = nombre);
  }
  get precio() {
    return this._precio;
  }
  set precio(precio) {
    return (this._precio = precio);
  }
  get stock() {
    return this._stock;
  }
  set stock(stock) {
    return (this._stock = stock);
  }
  get codigo() {
    return this._codigo;
  }
  set codigo(codigo) {
    return (this._codigo = codigo);
  }
  get descripcion() {
    return this._descripcion;
  }
  set descripcion(descripcion) {
    return (this._descripcion = descripcion);
  }
  get imageurl() {
    return this._imageurl;
  }
  set imageurl(imageurl) {
    return (this._imageurl = imageurl);
  }
  get timestamp() {
    return this._timestamp;
  }
  set timestamp(timestamp) {
    return (this._timestamp = timestamp);
  }
  get feccarga() {
    return this._feccarga;
  }
  set feccarga(feccarga) {
    return (this._feccarga = feccarga);
  }
}
