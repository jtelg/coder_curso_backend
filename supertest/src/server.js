import express from 'express'

import RouterProductos from './routes/routerProductos.js'

const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use('/api/productos', new RouterProductos())

export default app;