import logger from "./utils/loggerUtils.js";
import cluster from "cluster";
import os from "os";
import ServerSET from "./server.js";
import dotenv from './utils/dotenvUtils.js'
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
