import fs from "fs";
import { buildSchema } from "graphql";
import { graphqlHTTP } from "koa-graphql";
import mensajeResolve from "../../resolvers/mensaje.resolve.js";
const schemaString = fs.readFileSync("./src/schemas/mensaje.gql").toString();
const schemaCompiler = buildSchema(schemaString);

const graphMensaje = graphqlHTTP((request, response, ctx, graphQLParams) => ({
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
}));

export default graphMensaje
