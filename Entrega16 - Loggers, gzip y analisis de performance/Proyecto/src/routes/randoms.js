import express from "express";
const { Router } = express;
const router = Router();
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { fork } from "child_process";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: __dirname + "/../../.env" });
import logger from '../utils/logger.js'
router.get("/", (req, res) => {
  logger.info(`${req.method} ${req.url}`)
  let { cantidad } = req.query;
  const forked = fork("src/utils/calculoFork.js", [cantidad]);
  forked.send("empezar");
  forked.on("message", (msj) => {
    console.log(msj, "random");
    if (msj === "termine") return res.send("calculo terminado random.js");
  });
});
export default router;
