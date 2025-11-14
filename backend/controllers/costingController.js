const formulas = require('../utils/formulas');

/**
 * Controller para procesamiento de costos estándar
 */
class CostingController {
  /**
   * Procesar datos de Excel y calcular costos estándar
   * @param {Array} data - Datos parseados del Excel
   * @returns {Array} Datos procesados con cálculos
   */
  processExcel(data) {
    try {
      // Validar que todos los registros tengan los campos requeridos
      this.validateData(data);

      // Procesar cada registro
      const processedData = data.map((record, index) => {
        try {
          return this.processRecord(record);
        } catch (error) {
          throw new Error(`Error en fila ${index + 2}: ${error.message}`);
        }
      });

      return processedData;

    } catch (error) {
      throw new Error(`Error al procesar datos: ${error.message}`);
    }
  }

  /**
   * Procesar un registro individual
   * @param {Object} record - Registro individual del Excel
   * @returns {Object} Registro procesado con cálculos
   */
  processRecord(record) {
    // Calcular costo estándar
    const costoEstandar = formulas.calcularCostoEstandar(
      record.ps,
      record.qs,
      record.unidades_producidas
    );

    // Calcular costo real
    const costoReal = formulas.calcularCostoReal(
      record.precio_real,
      record.cantidad_real,
      record.unidades_producidas
    );

    // Calcular variaciones
    const variaciones = formulas.calcularVariaciones(
      record.ps,
      record.qs,
      record.precio_real,
      record.cantidad_real
    );

    // Clasificar eficiencia
    const eficiencia = this.clasificarEficiencia(variaciones);

    return {
      // Datos originales
      material: record.material,
      ps: record.ps,
      qs: record.qs,
      precio_real: record.precio_real,
      cantidad_real: record.cantidad_real,
      unidades_producidas: record.unidades_producidas,
      
      // Cálculos
      costo_estandar: costoEstandar,
      costo_real: costoReal,
      variacion_total: variaciones.variacion_total,
      variacion_precio: variaciones.variacion_precio,
      variacion_cantidad: variaciones.variacion_cantidad,
      
      // Análisis
      eficiencia: eficiencia
    };
  }

  /**
   * Validar datos del Excel
   * @param {Array} data - Datos a validar
   */
  validateData(data) {
    const requiredFields = [
      'material',
      'ps',
      'qs',
      'precio_real',
      'cantidad_real',
      'unidades_producidas'
    ];

    data.forEach((record, index) => {
      // Verificar que existan todos los campos
      requiredFields.forEach(field => {
        if (record[field] === undefined || record[field] === null) {
          throw new Error(`Fila ${index + 2}: Campo '${field}' es requerido`);
        }
      });

      // Validar que los valores numéricos sean positivos
      const numericFields = ['ps', 'qs', 'precio_real', 'cantidad_real', 'unidades_producidas'];
      numericFields.forEach(field => {
        const value = parseFloat(record[field]);
        if (isNaN(value) || value <= 0) {
          throw new Error(`Fila ${index + 2}: '${field}' debe ser un número mayor a 0`);
        }
      });
    });
  }

  /**
   * Clasificar eficiencia según variaciones
   * @param {Object} variaciones - Objeto con variaciones calculadas
   * @returns {string} Clasificación de eficiencia
   */
  clasificarEficiencia(variaciones) {
    const { variacion_precio, variacion_cantidad } = variaciones;

    if (variacion_precio < 0 && variacion_cantidad < 0) {
      return 'Favorable en precio y cantidad';
    } else if (variacion_precio < 0 && variacion_cantidad >= 0) {
      return 'Favorable en precio, Desfavorable en cantidad';
    } else if (variacion_precio >= 0 && variacion_cantidad < 0) {
      return 'Desfavorable en precio, Favorable en cantidad';
    } else {
      return 'Desfavorable en precio y cantidad';
    }
  }
}

module.exports = new CostingController();
