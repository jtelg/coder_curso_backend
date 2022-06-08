import ContenedorFirebase from "../../utils/contenedor/ContenedorFirebase"

class ProductosDaoFirebase extends ContenedorFirebase {

    constructor() {
        super('productos')
    }
}

export default ProductosDaoFirebase
