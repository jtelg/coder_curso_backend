export default class Mensaje {
  _id;
  _nombre;
  _msn;
  _color;
  _timestamp;
  _feccarga;
  constructor({ id, nombre, msn, color, timestamp, feccarga }) {
    this.id = id;
    this.nombre = nombre;
    this.msn = msn;
    this.color = color;
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
  get msn() {
    return this._msn;
  }
  set msn(msn) {
    return (this._msn = msn);
  }
  get color() {
    return this._color;
  }
  set color(color) {
    return (this._color = color);
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
