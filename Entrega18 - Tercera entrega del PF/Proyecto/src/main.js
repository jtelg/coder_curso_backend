import logger from "./utils/logger.js";
import cluster from "cluster";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import ServerSET from "./server.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: __dirname + "/../.env" });
const numeroCpus = os.cpus().length;
const modoCluster = process.env.MODE_INIT === "CLUSTER";

if (cluster.isPrimary && modoCluster) {
  for (let i = 0; i < numeroCpus; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker) => {
    logger.info(
      `DIED > el proceso ${
        worker.process.pid
      } se cerro ${new Date().toDateString()}`
    );
    cluster.fork();
  });
} else {
  logger.info(
    `SET > corriendo en proceso ${process.pid} ${new Date().toDateString()}`
  );
  ServerSET();
}
