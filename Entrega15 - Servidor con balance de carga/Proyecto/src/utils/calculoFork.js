import calculoForkPesado from "../utils/calculoForkPesado.js";
process.on("message", (msj) => {
  console.log(msj, "fork");
  if (msj === "empezar") {
    calculoForkPesado();
    process.send("termine");
  }
});
