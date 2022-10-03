import Koa from "koa";
import KoaBody from "koa-body";
import mount from 'koa-mount'
import _ from "./utils/dotenvUtils.js";
import graphCarrito from "./middlewares/graphQL/carrito.graph.js";
import graphMensaje from "./middlewares/graphQL/mensaje.graph.js";
import graphProducto from "./middlewares/graphQL/producto.graph.js";
import graphUsuario from "./middlewares/graphQL/usuario.graph.js";
const app = new Koa();

app.use(KoaBody());
app.use(mount("/graphql/producto", graphProducto));
app.use(mount("/graphql/carrito", graphCarrito));
app.use(mount("/graphql/usuario", graphUsuario));
app.use(mount("/graphql/mensaje", graphMensaje));

const PORT = 8080;
const server = app.listen(PORT, () => {
  console.log("Servidor KOA escuchando en el puerto " + server.address().port);
});
server.on("error", (error) => console.log("Error en Servidor KOA"));
