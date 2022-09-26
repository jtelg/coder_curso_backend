import fs from "fs";
import { buildSchema } from "graphql";
import { graphqlHTTP } from "express-graphql";
import productoResolve from "../../resolvers/producto.resolve.js";
const schemaString = fs.readFileSync("./src/schemas/producto.gql").toString();
const schemaCompiler = buildSchema(schemaString);

const graphProducto = graphqlHTTP({
  schema: schemaCompiler,
  rootValue: {
    getByIdProducto: productoResolve.getByIdProducto,
    getAllProducto: productoResolve.getAllProducto,
    getxCampoProducto: productoResolve.getxCampoProducto,
    saveProducto: productoResolve.saveProducto,
    updatexCampoProducto: productoResolve.updatexCampoProducto,
    deleteByIdProducto: productoResolve.deleteByIdProducto

  },
  graphiql: true
});

export default graphProducto
