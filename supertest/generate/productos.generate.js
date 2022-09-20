import { faker } from "@faker-js/faker";

const ProductoGet = () => ({
    id: faker.commerce.productName(),
    nombre: faker.commerce.productName(),
    precio: faker.commerce.price(),
    stock: 10,
    codigo: faker.commerce.productAdjective(),
    descripcion: faker.commerce.productDescription(),
    imageurl: faker.image.food(),
    timestamp: Date.now(),
    feccarga: new Date().toDateString()
})

export default ProductoGet;