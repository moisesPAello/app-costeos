const XLSX = require('xlsx');

/**
 * Utilidad para procesar archivos Excel
 */

// Columnas esperadas en el Excel
const EXPECTED_COLUMNS = [
  'material',
  'ps',
  'qs',
  'precio_real',
  'cantidad_real',
  'unidades_producidas'
];

/**
 * Parsear archivo Excel
 * @param {string} filePath - Ruta del archivo Excel
 * @returns {Array} Datos parseados como array de objetos
 */
function parseExcel(filePath) {
  try {
    // Leer archivo Excel
    const workbook = XLSX.readFile(filePath);
    
    // Obtener primera hoja
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    // Convertir a JSON
    const data = XLSX.utils.sheet_to_json(sheet, {
      raw: false, // Mantener formato original
      defval: null // Valores por defecto para celdas vacías
    });

    if (!data || data.length === 0) {
      throw new Error('El archivo Excel está vacío');
    }

    // Normalizar nombres de columnas (convertir a minúsculas y quitar espacios)
    const normalizedData = data.map(row => {
      const normalizedRow = {};
      Object.keys(row).forEach(key => {
        const normalizedKey = key.toLowerCase().trim().replace(/\s+/g, '_');
        normalizedRow[normalizedKey] = row[key];
      });
      return normalizedRow;
    });

    return normalizedData;

  } catch (error) {
    throw new Error(`Error al leer archivo Excel: ${error.message}`);
  }
}

/**
 * Validar que el Excel tenga las columnas requeridas
 * @param {Array} data - Datos parseados del Excel
 * @returns {Object} Resultado de validación
 */
function validateColumns(data) {
  const errors = [];

  if (!data || data.length === 0) {
    return {
      valid: false,
      errors: ['El archivo no contiene datos']
    };
  }

  // Obtener columnas del primer registro
  const columns = Object.keys(data[0]);

  // Verificar que existan todas las columnas requeridas
  EXPECTED_COLUMNS.forEach(requiredCol => {
    if (!columns.includes(requiredCol)) {
      errors.push(`Columna requerida no encontrada: '${requiredCol}'`);
    }
  });

  return {
    valid: errors.length === 0,
    errors: errors,
    columnsFound: columns,
    columnsExpected: EXPECTED_COLUMNS
  };
}

/**
 * Validar valores de un registro
 * @param {Object} record - Registro individual
 * @returns {Object} Resultado de validación
 */
function validateRecord(record) {
  const errors = [];

  // Validar que el material tenga nombre
  if (!record.material || record.material.trim() === '') {
    errors.push('El nombre del material no puede estar vacío');
  }

  // Validar valores numéricos
  const numericFields = ['ps', 'qs', 'precio_real', 'cantidad_real', 'unidades_producidas'];
  
  numericFields.forEach(field => {
    const value = parseFloat(record[field]);
    
    if (isNaN(value)) {
      errors.push(`${field} debe ser un número válido`);
    } else if (value <= 0) {
      errors.push(`${field} debe ser mayor a 0`);
    }
  });

  return {
    valid: errors.length === 0,
    errors: errors
  };
}

/**
 * Validar todo el conjunto de datos
 * @param {Array} data - Datos parseados
 * @returns {Object} Resultado de validación completa
 */
function validateData(data) {
  const errors = [];

  data.forEach((record, index) => {
    const validation = validateRecord(record);
    if (!validation.valid) {
      errors.push({
        row: index + 2, // +2 porque índice 0 + 1 (header)
        errors: validation.errors
      });
    }
  });

  return {
    valid: errors.length === 0,
    errors: errors
  };
}

module.exports = {
  parseExcel,
  validateColumns,
  validateRecord,
  validateData,
  EXPECTED_COLUMNS
};
