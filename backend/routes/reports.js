const express = require('express');
const router = express.Router();
const variationController = require('../controllers/variationController');

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

module.exports = router;
