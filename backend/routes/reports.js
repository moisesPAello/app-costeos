const express = require('express');
const router = express.Router();
const variationController = require('../controllers/variationController');
const XLSX = require('xlsx');

/**
 * POST /api/reports/generate
 * Generar reporte de variaciones
 */
router.post('/generate', (req, res) => {
  try {
    const { data } = req.body;

    if (!data || !Array.isArray(data) || data.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Datos inválidos para generar reporte'
      });
    }

    // Generar reporte completo
    const report = variationController.generateReport(data);

    res.json({
      success: true,
      data: report,
      message: 'Reporte generado exitosamente'
    });

  } catch (error) {
    console.error('Error al generar reporte:', error);
    res.status(500).json({
      success: false,
      error: 'Error al generar el reporte',
      message: error.message
    });
  }
});

/**
 * POST /api/reports/summary
 * Obtener resumen de análisis
 */
router.post('/summary', (req, res) => {
  try {
    const { data } = req.body;

    if (!data || !Array.isArray(data) || data.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Datos inválidos para generar resumen'
      });
    }

    const summary = variationController.calculateSummary(data);

    res.json({
      success: true,
      data: summary,
      message: 'Resumen calculado exitosamente'
    });

  } catch (error) {
    console.error('Error al calcular resumen:', error);
    res.status(500).json({
      success: false,
      error: 'Error al calcular el resumen'
    });
  }
});

/**
 * POST /api/reports/charts
 * Preparar datos para gráficos
 */
router.post('/charts', (req, res) => {
  try {
    const { data } = req.body;

    if (!data || !Array.isArray(data) || data.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Datos inválidos para generar gráficos'
      });
    }

    const chartsData = variationController.prepareChartsData(data);

    res.json({
      success: true,
      data: chartsData,
      message: 'Datos de gráficos preparados exitosamente'
    });

  } catch (error) {
    console.error('Error al preparar datos de gráficos:', error);
    res.status(500).json({
      success: false,
      error: 'Error al preparar datos de gráficos'
    });
  }
});

/**
 * GET /api/reports/template
 * Descargar plantilla Excel
 */
router.get('/template', (req, res) => {
  try {
    // Crear plantilla vacía con solo los headers
    const templateData = [
      {
        material: '',
        ps: '',
        qs: '',
        precio_real: '',
        cantidad_real: '',
        unidades_producidas: ''
      }
    ];

    // Crear workbook y worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(templateData);

    // Agregar worksheet al workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Plantilla Costeo');

    // Configurar headers
    ws['!cols'] = [
      { wch: 20 }, // material
      { wch: 10 }, // ps
      { wch: 10 }, // qs
      { wch: 15 }, // precio_real
      { wch: 15 }, // cantidad_real
      { wch: 20 }  // unidades_producidas
    ];

    // Generar buffer
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    // Configurar headers de respuesta
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="plantilla-costeo-estandar.xlsx"');

    // Enviar el archivo
    res.send(buffer);

  } catch (error) {
    console.error('Error al generar plantilla:', error);
    res.status(500).json({
      success: false,
      error: 'Error al generar la plantilla'
    });
  }
});

module.exports = router;
