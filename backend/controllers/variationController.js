/**
 * Controller para análisis de variaciones y generación de reportes
 */
class VariationController {
  /**
   * Generar reporte completo de variaciones
   * @param {Array} data - Datos procesados de costeo
   * @returns {Object} Reporte completo
   */
  generateReport(data) {
    return {
      summary: this.calculateSummary(data),
      details: data,
      charts: this.prepareChartsData(data),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Calcular resumen de análisis
   * @param {Array} data - Datos procesados
   * @returns {Object} Resumen con totales y promedios
   */
  calculateSummary(data) {
    const totals = data.reduce((acc, record) => {
      return {
        costo_estandar_total: acc.costo_estandar_total + record.costo_estandar,
        costo_real_total: acc.costo_real_total + record.costo_real,
        variacion_total: acc.variacion_total + record.variacion_total,
        variacion_precio_total: acc.variacion_precio_total + record.variacion_precio,
        variacion_cantidad_total: acc.variacion_cantidad_total + record.variacion_cantidad
      };
    }, {
      costo_estandar_total: 0,
      costo_real_total: 0,
      variacion_total: 0,
      variacion_precio_total: 0,
      variacion_cantidad_total: 0
    });

    const count = data.length;

    return {
      total_materiales: count,
      ...totals,
      
      // Promedios
      promedio_variacion: totals.variacion_total / count,
      promedio_variacion_precio: totals.variacion_precio_total / count,
      promedio_variacion_cantidad: totals.variacion_cantidad_total / count,
      
      // Análisis general
      eficiencia_general: this.clasificarEficienciaGeneral(totals),
      porcentaje_desviacion: ((totals.costo_real_total - totals.costo_estandar_total) / totals.costo_estandar_total) * 100,
      
      // Materiales con mayor impacto
      mayor_variacion_favorable: this.encontrarMayorVariacion(data, 'favorable'),
      mayor_variacion_desfavorable: this.encontrarMayorVariacion(data, 'desfavorable')
    };
  }

  /**
   * Preparar datos para gráficos
   * @param {Array} data - Datos procesados
   * @returns {Object} Datos formateados para Chart.js
   */
  prepareChartsData(data) {
    return {
      // Gráfico de barras: Variaciones por material
      variaciones_por_material: {
        labels: data.map(r => r.material),
        datasets: [
          {
            label: 'Variación de Precio',
            data: data.map(r => r.variacion_precio),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          },
          {
            label: 'Variación de Cantidad',
            data: data.map(r => r.variacion_cantidad),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }
        ]
      },

      // Gráfico de comparación: Costo Estándar vs Real
      comparacion_costos: {
        labels: data.map(r => r.material),
        datasets: [
          {
            label: 'Costo Estándar',
            data: data.map(r => r.costo_estandar),
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          },
          {
            label: 'Costo Real',
            data: data.map(r => r.costo_real),
            backgroundColor: 'rgba(255, 159, 64, 0.5)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1
          }
        ]
      },

      // Gráfico de pastel: Distribución de variaciones
      distribucion_variaciones: {
        labels: ['Favorable en Precio', 'Desfavorable en Precio', 'Favorable en Cantidad', 'Desfavorable en Cantidad'],
        datasets: [{
          data: [
            this.contarVariaciones(data, 'precio', 'favorable'),
            this.contarVariaciones(data, 'precio', 'desfavorable'),
            this.contarVariaciones(data, 'cantidad', 'favorable'),
            this.contarVariaciones(data, 'cantidad', 'desfavorable')
          ],
          backgroundColor: [
            'rgba(75, 192, 192, 0.5)',
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 1
        }]
      }
    };
  }

  /**
   * Clasificar eficiencia general
   * @param {Object} totals - Totales calculados
   * @returns {string} Clasificación general
   */
  clasificarEficienciaGeneral(totals) {
    if (totals.variacion_total < 0) {
      return 'Favorable - Costos reales menores a los estándar';
    } else if (totals.variacion_total > 0) {
      return 'Desfavorable - Costos reales mayores a los estándar';
    } else {
      return 'Neutral - Costos reales iguales a los estándar';
    }
  }

  /**
   * Encontrar material con mayor variación
   * @param {Array} data - Datos procesados
   * @param {string} tipo - 'favorable' o 'desfavorable'
   * @returns {Object} Material con mayor variación
   */
  encontrarMayorVariacion(data, tipo) {
    let resultado = null;
    let maxVariacion = 0;

    data.forEach(record => {
      const variacion = Math.abs(record.variacion_total);
      
      if (tipo === 'favorable' && record.variacion_total < 0 && variacion > maxVariacion) {
        maxVariacion = variacion;
        resultado = {
          material: record.material,
          variacion: record.variacion_total
        };
      } else if (tipo === 'desfavorable' && record.variacion_total > 0 && variacion > maxVariacion) {
        maxVariacion = variacion;
        resultado = {
          material: record.material,
          variacion: record.variacion_total
        };
      }
    });

    return resultado || { material: 'N/A', variacion: 0 };
  }

  /**
   * Contar variaciones por tipo
   * @param {Array} data - Datos procesados
   * @param {string} tipo - 'precio' o 'cantidad'
   * @param {string} direccion - 'favorable' o 'desfavorable'
   * @returns {number} Conteo
   */
  contarVariaciones(data, tipo, direccion) {
    return data.filter(record => {
      const variacion = tipo === 'precio' ? record.variacion_precio : record.variacion_cantidad;
      
      if (direccion === 'favorable') {
        return variacion < 0;
      } else {
        return variacion > 0;
      }
    }).length;
  }
}

module.exports = new VariationController();
