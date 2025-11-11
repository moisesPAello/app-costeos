# Convenciones de Código

## 📝 Estilo General

### Lenguaje
- **Backend:** JavaScript (Node.js)
- **Frontend:** JavaScript Vanilla (ES6+)
- **Configuración:** JSON

### Formato
- **Indentación:** 2 espacios (no tabs)
- **Comillas:** Usar comillas simples `'` en JavaScript
- **Punto y coma:** Obligatorio al final de cada sentencia
- **Líneas:** Máximo 100 caracteres por línea

---

## 📁 Nomenclatura de Archivos

### Backend
```
camelCase para archivos de lógica:
✅ costingController.js
✅ excelParser.js
✅ formulas.js

kebab-case para rutas:
✅ auth.js
✅ upload.js
✅ reports.js
```

### Frontend
```
kebab-case para archivos HTML/CSS:
✅ login.html
✅ dashboard.html
✅ styles.css

camelCase para JavaScript:
✅ login.js
✅ upload.js
✅ charts.js
```

---

## 🏷️ Nomenclatura de Variables y Funciones

### JavaScript
```javascript
// Variables: camelCase
const userName = 'Juan';
const precioEstandar = 10.50;
const costoReal = calculateCost(data);

// Funciones: camelCase con verbo de acción
function calculateVariations(data) { }
function parseExcel(filePath) { }
function validateColumns(data) { }

// Constantes: UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const DEFAULT_PORT = 3000;

// Clases: PascalCase
class CostingController { }
class VariationAnalyzer { }
```

### Nombres de Rutas (Express)
```javascript
// Sustantivos en plural, kebab-case
router.post('/api/auth/login');
router.post('/api/uploads');
router.get('/api/reports');
router.post('/api/costing/calculate');
```

---

## 📦 Estructura de Módulos

### Backend Controllers
```javascript
// Patrón estándar para controladores
class CostingController {
  async processExcel(req, res) {
    try {
      // 1. Validar entrada
      // 2. Procesar datos
      // 3. Retornar respuesta
      res.json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = new CostingController();
```

### Backend Routes
```javascript
// Patrón estándar para rutas
const express = require('express');
const router = express.Router();
const controller = require('../controllers/costingController');

router.post('/calculate', controller.processExcel);

module.exports = router;
```

### Frontend Fetch API
```javascript
// Patrón estándar para llamadas API
async function uploadExcel(file) {
  const formData = new FormData();
  formData.append('excel', file);
  
  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    
    if (data.success) {
      displayResults(data.data);
    } else {
      showError(data.error);
    }
  } catch (error) {
    showError('Error al conectar con el servidor');
  }
}
```

---

## 📊 Manejo de Datos

### JSON Responses
```javascript
// Respuesta exitosa
{
  "success": true,
  "data": { /* ... */ },
  "message": "Operación exitosa"
}

// Respuesta con error
{
  "success": false,
  "error": "Descripción del error",
  "code": "ERROR_CODE"
}
```

### Excel Parsing
```javascript
// Nombres de columnas esperados (snake_case en Excel)
const EXPECTED_COLUMNS = [
  'material',
  'ps',
  'qs',
  'precio_real',
  'cantidad_real',
  'unidades_producidas'
];
```

---

## 🎨 Frontend Conventions

### HTML
```html
<!-- Usar clases de TailwindCSS -->
<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Subir Excel
</button>

<!-- IDs en kebab-case -->
<div id="cost-table"></div>
<canvas id="variation-chart"></canvas>
```

### Chart.js
```javascript
// Configuración estándar de gráficos
const chartConfig = {
  type: 'bar',
  data: {
    labels: materials,
    datasets: [{
      label: 'Variación Total',
      data: variations,
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: { beginAtZero: true }
    }
  }
};
```

---

## 🔒 Seguridad y Validación

### Backend
```javascript
// SIEMPRE validar entrada del usuario
function validateExcelData(data) {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Datos inválidos');
  }
  
  data.forEach(row => {
    if (!row.ps || row.ps <= 0) {
      throw new Error('Precio estándar debe ser mayor a 0');
    }
    // ... más validaciones
  });
}
```

### Frontend
```javascript
// Validar archivos antes de enviar
function validateFile(file) {
  const validExtensions = ['.xlsx', '.xls'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!validExtensions.some(ext => file.name.endsWith(ext))) {
    throw new Error('Formato de archivo no válido');
  }
  
  if (file.size > maxSize) {
    throw new Error('Archivo demasiado grande (máx. 5MB)');
  }
}
```

---

## 📝 Comentarios

### Cuándo comentar
```javascript
// ✅ Documenta lógica compleja o fórmulas contables
// Fórmula: Variación de Precio = (PR - PS) × CR
const variacionPrecio = (precioReal - precioEstandar) * cantidadReal;

// ✅ Explica decisiones de diseño no obvias
// Usamos JSON local en lugar de DB por simplicidad académica
const users = JSON.parse(fs.readFileSync('./data/users.json'));

// ❌ No comentes lo obvio
// Incrementar contador
contador++;
```

### JSDoc para funciones públicas
```javascript
/**
 * Calcula las variaciones de costo estándar
 * @param {Object} record - Registro con datos de producción
 * @param {number} record.ps - Precio estándar
 * @param {number} record.qs - Cantidad estándar
 * @returns {Object} Objeto con variaciones calculadas
 */
function calculateVariations(record) {
  // ...
}
```

---

## 🚨 Manejo de Errores

### Try-Catch Patterns
```javascript
// En controladores
try {
  const result = await processData(data);
  res.json({ success: true, data: result });
} catch (error) {
  console.error('Error en processData:', error);
  res.status(500).json({ 
    success: false, 
    error: error.message 
  });
}

// En frontend
try {
  const data = await fetchData();
  displayResults(data);
} catch (error) {
  showErrorToast(error.message);
}
```

---

## 📚 Referencias
- Commits convencionales: Ver [commits_convencionales.md](.github/instructions/commits_convencionales.md)
- Convención de ramas: Ver [convencion_de_ramas.md](.github/instructions/convencion_de_ramas.md)
- Stack tecnológico: Ver [stack.md](.github/instructions/stack.md)
