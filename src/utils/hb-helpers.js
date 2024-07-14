export function formatear(amount) {
  const formateado = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(amount);
  return formateado;
}

export function comparar(first, operation, second) {
  if (eval(first + operation + second)) {
    return true;
  } else {
    return false;
  }
}
export function operacion(first, second, operacion) {
  let resultado;
  switch (operacion) {
    case "producto":
      resultado = first * second;
      break;
    case "suma":
      resultado = first + second;
      break;
    case "resta":
      resultado = first - second;

      break;
  }
  return resultado;
}
export function dateFormat(date) {
  return date.toLocaleDateString("es-AR");
}
