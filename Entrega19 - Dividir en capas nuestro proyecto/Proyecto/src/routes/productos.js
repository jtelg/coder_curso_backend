import express from "express";

const { Router } = express;
const router = Router();

import ctrlProductos from "../controllers/productos.js";
import SessionMidle from "../utils/session.js";

// setea pagina de productos
router.get(
  "/",
  SessionMidle.ctrlUser,
  SessionMidle.ctrlAdmin,
  async (req, res) => ctrlProductos.setProductoPage(req, res)
);

// get producto por ID
router.get("/:id", async (req, res) => ctrlProductos.getProductxID(req, res));

// agrega un nuevo producto
router.post(
  "/",
  SessionMidle.ctrlUser,
  SessionMidle.ctrlAdmin,
  async (req, res) => ctrlProductos.addNewProduct(req, res)
);

// elimina producto x id
router.delete(
  "/:id",
  SessionMidle.ctrlUser,
  SessionMidle.ctrlAdmin,
  async (req, res) => ctrlProductos.deleteProductxID(req, res)
);

// edita producto
router.put(
  "/:id",
  SessionMidle.ctrlUser,
  SessionMidle.ctrlAdmin,
  async (req, res) => ctrlProductos.updProduct(req, res)
);

export default router;
