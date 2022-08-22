function obtenermayor(x, y) {
  if (typeof x !== "number" || typeof y !== "number") {
    return "error";
  }
  return x > y ? x : y;
}

console.log(obtenermayor('6', 6));


// const obtenerMayor = (x, y) =>
//   Number.isInteger(x) && Number.isInteger(y)
//     ? x > y
//       ? x
//       : y > x
//       ? y
//       : x
//     : "Ambos datos no son enteros";
