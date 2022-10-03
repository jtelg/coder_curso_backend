import fs from "fs";
import { buildSchema } from "graphql";
import { graphqlHTTP } from "koa-graphql";
import usuarioResolve from "../../resolvers/usuario.resolve.js";
const schemaString = fs.readFileSync("./src/schemas/usuario.gql").toString();
const schemaCompiler = buildSchema(schemaString);

const graphUsuario = graphqlHTTP((request, response, ctx, graphQLParams) => ({
  schema: schemaCompiler,
  rootValue: {
    getByIdUsuario: usuarioResolve.getByIdUsuario,
    getAllUsuario: usuarioResolve.getAllUsuario,
    getxCampoUsuario: usuarioResolve.getxCampoUsuario,
    getUserLogin: usuarioResolve.getUserLogin,
    saveUsuario: usuarioResolve.saveUsuario,
    updatexCampoUsuario: usuarioResolve.updatexCampoUsuario,
    deleteByIdUsuario: usuarioResolve.deleteByIdUsuario

  },
  graphiql: true
}));

export default graphUsuario
