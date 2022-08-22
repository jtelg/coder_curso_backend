const fs = require("fs");

class Contenedor {
  constructor(nombre) {
    this.nombre = nombre;
    // recupera los datos del txt y lo convierte en un array de objetos
    try {
      this.json = JSON.parse(fs.readFileSync(`./${this.nombre}.txt`, "utf-8"));
    } catch (error) {
      this.json = null;
    }
  }


  save(obj) {
    
    // lee el archivo, si existe recupera un array con objetos y le agrega el nuevo.
    if (this.json) {
      obj.id = this.json.length;
      this.json.push(obj);
      this.escribirArchivo(this.json);
      return obj.id;
    }
    // si no existe el json u no tiene datos crea un nuevo array de objetos
    obj.id = 0;
    this.escribirArchivo([obj]);
    return obj.id;
  }
  getById(id) {
    if (this.json) {
      const obj = this.json.find((e) => e.id === id);
      if (obj) return obj;
    }
    return null;
  }

  getAll() {
    return this.json ? this.json : "No hay datos en el archivo";
  }

  deleteById(id) {
    if (this.json) {
      this.json = this.json.filter((e) => e.id !== id);
      this.escribirArchivo(this.json);
    }
    return "No hay datos en el archivo";
  }
  
  deleteAll(){
      this.escribirArchivo('');
  }

  escribirArchivo(dato) {
    dato = dato ? JSON.stringify(dato) : '';
    try {
      fs.writeFileSync(`./${this.nombre}.txt`, `${dato}`);
    } catch (error) {
      return `Error al escribir el archivo: ${error}`;
    }
  }
}
module.exports = Contenedor;

//const obj_Data = {
//  nombre: "Alumno",
//  apellido: "Alumno sur",
//  libros: [
//    { nombre: "Harry Poter", autor: "J.K. Rowling" },
//    { nombre: "El Señor de los Anillos", autor: "J.R.R. Tolkien" },
//    { nombre: "El Alquimista", autor: "Paulo Coelho" },
//  ],
//  mascotas: ["perro", "gato", "gato"],
//};
//const contenedor = new Contenedor("Entregable2");

// console.log(contenedor.save(obj_Data));
// console.log(contenedor.getById(1648768578394));
// contenedor.deleteById(1648769159894);
// console.log(contenedor.getById(1648769159894));
// console.log(contenedor.getAll());
// contenedor.deleteAll();
