import fs from "fs";
import { buildSchema } from "graphql";
import { graphqlHTTP } from "express-graphql";
import carritoResolve from "../../resolvers/carrito.resolve.js";
const schemaString = fs.readFileSync("./src/schemas/carrito.gql").toString();
const schemaCompiler = buildSchema(schemaString);

const graphCarrito = graphqlHTTP({
  schema: schemaCompiler,
  rootValue: {
    getByIdCarrito: carritoResolve.getByIdCarrito,
    getAllCarrito: carritoResolve.getAllCarrito,
    getxCampoCarrito: carritoResolve.getxCampoCarrito,
    getProds_xcarro: carritoResolve.getProds_xcarro,
    saveCarrito: carritoResolve.saveCarrito,
    updatexCampoCarrito: carritoResolve.updatexCampoCarrito,
    deleteByIdCarrito: carritoResolve.deleteByIdCarrito,
    deleteProd_xcarro: carritoResolve.deleteProd_xcarro

  },
  graphiql: true
});

export default graphCarrito
