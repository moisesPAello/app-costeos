/**
 * Fórmulas de costeo estándar según principios contables
 */

/**
 * Calcular Costo Estándar
 * Fórmula: PS × QS × Unidades Producidas
 * @param {number} ps - Precio Estándar
 * @param {number} qs - Cantidad Estándar
 * @param {number} unidadesProducidas - Unidades producidas
 * @returns {number} Costo estándar total
 */
function calcularCostoEstandar(ps, qs, unidadesProducidas) {
  const resultado = ps * qs * unidadesProducidas;
  return redondear(resultado);
}

/**
 * Calcular Costo Real
 * Fórmula: Precio Real × Cantidad Real × Unidades Producidas
 * @param {number} precioReal - Precio real pagado
 * @param {number} cantidadReal - Cantidad real utilizada
 * @param {number} unidadesProducidas - Unidades producidas
 * @returns {number} Costo real total
 */
function calcularCostoReal(precioReal, cantidadReal, unidadesProducidas) {
  const resultado = precioReal * cantidadReal * unidadesProducidas;
  return redondear(resultado);
}

/**
 * Calcular Variación Total
 * Fórmula: Costo Real - Costo Estándar
 * @param {number} costoReal - Costo real
 * @param {number} costoEstandar - Costo estándar
 * @returns {number} Variación total
 */
function calcularVariacionTotal(costoReal, costoEstandar) {
  const resultado = costoReal - costoEstandar;
  return redondear(resultado);
}

/**
 * Calcular Variación de Precio
 * Fórmula: (Precio Real - PS) × Cantidad Real
 * @param {number} precioReal - Precio real pagado
 * @param {number} ps - Precio estándar
 * @param {number} cantidadReal - Cantidad real utilizada
 * @returns {number} Variación de precio
 */
function calcularVariacionPrecio(precioReal, ps, cantidadReal) {
  const resultado = (precioReal - ps) * cantidadReal;
  return redondear(resultado);
}

/**
 * Calcular Variación de Cantidad
 * Fórmula: (Cantidad Real - QS) × PS
 * @param {number} cantidadReal - Cantidad real utilizada
 * @param {number} qs - Cantidad estándar
 * @param {number} ps - Precio estándar
 * @returns {number} Variación de cantidad
 */
function calcularVariacionCantidad(cantidadReal, qs, ps) {
  const resultado = (cantidadReal - qs) * ps;
  return redondear(resultado);
}

/**
 * Calcular todas las variaciones
 * @param {number} ps - Precio Estándar
 * @param {number} qs - Cantidad Estándar
 * @param {number} precioReal - Precio real
 * @param {number} cantidadReal - Cantidad real
 * @returns {Object} Objeto con todas las variaciones
 */
function calcularVariaciones(ps, qs, precioReal, cantidadReal) {
  const variacionPrecio = calcularVariacionPrecio(precioReal, ps, cantidadReal);
  const variacionCantidad = calcularVariacionCantidad(cantidadReal, qs, ps);
  const variacionTotal = redondear(variacionPrecio + variacionCantidad);

  return {
    variacion_precio: variacionPrecio,
    variacion_cantidad: variacionCantidad,
    variacion_total: variacionTotal
  };
}

/**
 * Calcular porcentaje de desviación
 * @param {number} costoReal - Costo real
 * @param {number} costoEstandar - Costo estándar
 * @returns {number} Porcentaje de desviación
 */
function calcularPorcentajeDesviacion(costoReal, costoEstandar) {
  if (costoEstandar === 0) {
    throw new Error('Costo estándar no puede ser cero para calcular porcentaje');
  }
  const resultado = ((costoReal - costoEstandar) / costoEstandar) * 100;
  return redondear(resultado);
}

/**
 * Redondear a 2 decimales
 * @param {number} valor - Valor a redondear
 * @returns {number} Valor redondeado
 */
function redondear(valor) {
  return Math.round(valor * 100) / 100;
}

/**
 * Validar que un valor sea numérico y positivo
 * @param {number} valor - Valor a validar
 * @param {string} nombre - Nombre del campo (para error)
 * @throws {Error} Si el valor no es válido
 */
function validarValorPositivo(valor, nombre) {
  if (typeof valor !== 'number' || isNaN(valor)) {
    throw new Error(`${nombre} debe ser un número válido`);
  }
  if (valor <= 0) {
    throw new Error(`${nombre} debe ser mayor a 0`);
  }
}

module.exports = {
  calcularCostoEstandar,
  calcularCostoReal,
  calcularVariacionTotal,
  calcularVariacionPrecio,
  calcularVariacionCantidad,
  calcularVariaciones,
  calcularPorcentajeDesviacion,
  redondear,
  validarValorPositivo
};
