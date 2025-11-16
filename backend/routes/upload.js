const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const excelParser = require('../utils/excelParser');
const costingController = require('../controllers/costingController');

// Configurar multer para carga de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    
    // Crear carpeta si no existe
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${timestamp}-${file.originalname}`);
  }
});

// Filtro para validar tipo de archivo
const fileFilter = (req, file, cb) => {
  const validExtensions = ['.xlsx', '.xls'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (validExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Formato de archivo no válido. Solo se aceptan archivos Excel (.xlsx, .xls)'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo
  }
});

/**
 * POST /api/upload
 * Subir archivo Excel y procesarlo
 */
router.post('/', upload.single('excel'), async (req, res) => {
  try {
    console.log('\x1b[36m%s\x1b[0m', '📤 Recibiendo archivo Excel...');
    
    if (!req.file) {
      console.log('\x1b[31m%s\x1b[0m', '❌ No se recibió archivo');
      return res.status(400).json({
        success: false,
        error: 'No se proporcionó ningún archivo'
      });
    }

    const filePath = req.file.path;
    console.log('📂 Archivo guardado en:', filePath);
    console.log('📊 Nombre:', req.file.originalname);
    console.log('📏 Tamaño:', req.file.size, 'bytes');

    // Parsear Excel
    console.log('\x1b[36m%s\x1b[0m', '🔍 Parseando Excel...');
    const parsedData = excelParser.parseExcel(filePath);
    console.log('✅ Registros parseados:', parsedData.length);
    console.log('📋 Primer registro:', parsedData[0]);

    // Validar columnas requeridas
    console.log('\x1b[36m%s\x1b[0m', '✓ Validando columnas...');
    const validationResult = excelParser.validateColumns(parsedData);
    
    if (!validationResult.valid) {
      console.log('\x1b[31m%s\x1b[0m', '❌ Validación fallida:', validationResult.errors);
      // Eliminar archivo si no es válido
      fs.unlinkSync(filePath);
      
      return res.status(400).json({
        success: false,
        error: 'Archivo Excel no tiene el formato correcto',
        details: validationResult.errors
      });
    }

    // Procesar datos de costeo
    console.log('\x1b[36m%s\x1b[0m', '🧮 Procesando cálculos de costeo...');
    const processedData = costingController.processExcel(parsedData);
    console.log('\x1b[32m%s\x1b[0m', '✅ Datos procesados exitosamente');
    console.log('📊 Primer resultado:', processedData[0]);

    res.json({
      success: true,
      data: processedData,
      message: 'Archivo procesado exitosamente',
      file: {
        name: req.file.originalname,
        size: req.file.size,
        path: filePath
      }
    });

  } catch (error) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Error al procesar archivo:', error);
    console.error('Stack:', error.stack);
    
    // Limpiar archivo en caso de error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      error: 'Error al procesar el archivo Excel',
      message: error.message
    });
  }
});

/**
 * DELETE /api/upload/:filename
 * Eliminar archivo cargado
 */
router.delete('/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../../uploads', filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({
        success: true,
        message: 'Archivo eliminado exitosamente'
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Archivo no encontrado'
      });
    }
  } catch (error) {
    console.error('Error al eliminar archivo:', error);
    res.status(500).json({
      success: false,
      error: 'Error al eliminar el archivo'
    });
  }
});

module.exports = router;
