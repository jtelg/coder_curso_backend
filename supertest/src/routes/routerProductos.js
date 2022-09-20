import { Router } from 'express'
import { getController, postController } from '../controllers/controller.factory.js'

const router = Router()

router.post('/', (req, res) => postController.execute(req, res))
router.get('/:id?', (req, res) => getController.execute(req, res))

class RouterProductos {
   constructor() {
       return router
   }
}

export default RouterProductos