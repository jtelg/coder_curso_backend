import ApiProductos from "../api/productos.js";

export default class PostController {
  constructor() {
    this.api = new ApiProductos();
  }

  async execute(req, res) {
    try {
      const result = await this.api.post(req.body);
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  }
}
