export default class DaoProductosMem {
    constructor() {
        this.productos = []
    }
 
    static #matches(query, producto) {
        for (const [ k, v ] of Object.entries(query)) {
            if (producto[ k ] != v) return false
        }
        return true
    }
 
    find(query) {
        return this.productos.filter(u => DaoProductosMem.#matches(query, u))
    }
 
    create(producto) {
        this.productos.push(producto)
    }
 }
 