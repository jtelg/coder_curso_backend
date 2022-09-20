import ApiProductos from "../api/productos.js";

export default class GetController {
  constructor() {
    this.api = new ApiProductos();
  }

  async execute(req, res) {
    try {
      const result = await this.api.get(req.params.id);
      res.json(result);
    } catch (error) {
      res.send(error);
    }
  }
}
