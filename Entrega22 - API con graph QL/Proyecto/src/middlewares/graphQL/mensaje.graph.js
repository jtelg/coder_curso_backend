import fs from "fs";
import { buildSchema } from "graphql";
import { graphqlHTTP } from "express-graphql";
import mensajeResolve from "../../resolvers/mensaje.resolve.js";
const schemaString = fs.readFileSync("./src/schemas/mensaje.gql").toString();
const schemaCompiler = buildSchema(schemaString);

const graphMensaje = graphqlHTTP({
  schema: schemaCompiler,
  rootValue: {
    getByIdMensaje: mensajeResolve.getByIdMensaje,
    getAllMensaje: mensajeResolve.getAllMensaje,
    getxCampoMensaje: mensajeResolve.getxCampoMensaje,
    saveMensaje: mensajeResolve.saveMensaje,
    updatexCampoMensaje: mensajeResolve.updatexCampoMensaje,
    deleteByIdMensaje: mensajeResolve.deleteByIdMensaje

  },
  graphiql: true
});

export default graphMensaje
