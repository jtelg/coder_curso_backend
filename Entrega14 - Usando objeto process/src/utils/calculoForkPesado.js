const calculoForkPesado = () => {
    let cantidad = process.argv[2];
    if (!cantidad) cantidad = 100000000;
    let objNums = {};
    for (let x = 0; x < cantidad; x++) {
      const random = Math.round(Math.random() * 1000);
      objNums[random] = !objNums[random] ? 1 : objNums[random] + 1;
    }
    console.log('Calculo terminado');
    return objNums;
  };
  
  export default calculoForkPesado;