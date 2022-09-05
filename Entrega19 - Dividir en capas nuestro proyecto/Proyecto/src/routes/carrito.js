import express from "express";

const { Router } = express;
const router = Router();

import ctrlCarrito from "../controllers/carrito.js";
import SessionMidle from "../utils/session.js";
// Setea la pagina /carrito
router.get("/", (req, res) => ctrlCarrito.setCarritoPage(req, res));
// crea un nuevo carrito
router.post("/", (req, res) => ctrlCarrito.postNewCart(req, res));
// nueva venta generada
router.put("/", SessionMidle.ctrlUser, (req, res) => ctrlCarrito.setNewSale(req, res));
// elimina carro completo
router.delete("/:id", (req, res) => ctrlCarrito.deleteCart(req, res));
// lista de productos por carro
router.get("/:id/productos", (req, res) =>
  ctrlCarrito.getListProducts(req, res)
);
// agrega nuevos productos al carrito
router.put("/:id/productos", SessionMidle.ctrlUser, async (req, res, next) =>
  ctrlCarrito.AddNewProduct(req, res, next)
);

export default router;
