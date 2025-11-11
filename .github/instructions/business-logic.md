# Lógica de Negocio - Costeo Estándar

## 📊 Conceptos Contables Fundamentales

### Costeo Estándar
Sistema contable que establece costos predeterminados para producción, permitiendo:
- **Planificación:** Presupuestar costos antes de producir
- **Control:** Comparar costos reales vs. estándar
- **Análisis:** Identificar variaciones y áreas de mejora

---

## 🧮 Fórmulas Principales

### 1. Precio Estándar (PS)
```
PS = Costo presupuestado por unidad de insumo
```

**Ejemplo:**
- Si se espera pagar $10 por kg de materia prima → PS = $10/kg

### 2. Cantidad Estándar (QS)
```
QS = Cantidad presupuestada de insumo por unidad producida
```

**Ejemplo:**
- Si se requieren 5 kg de materia prima por producto → QS = 5 kg/unidad

### 3. Costo Estándar Total
```
Costo Estándar = PS × QS × Unidades Producidas
```

### 4. Variaciones
```
Variación Total = Costo Real - Costo Estándar

Variación de Precio = (Precio Real - PS) × Cantidad Real
Variación de Cantidad = (Cantidad Real - QS) × PS
```

---

## 📂 Estructura de Datos Esperada

### Archivo Excel de Entrada
Debe contener las siguientes columnas:

| Columna | Descripción | Tipo | Ejemplo |
|---------|-------------|------|---------|
| `material` | Nombre del insumo | String | "Materia Prima A" |
| `ps` | Precio estándar unitario | Number | 10.50 |
| `qs` | Cantidad estándar por unidad | Number | 5.0 |
| `precio_real` | Precio real pagado | Number | 11.00 |
| `cantidad_real` | Cantidad real utilizada | Number | 5.2 |
| `unidades_producidas` | Unidades fabricadas | Number | 100 |

### Datos Calculados (Output)
```json
{
  "material": "Materia Prima A",
  "costo_estandar": 5250.00,
  "costo_real": 5720.00,
  "variacion_total": 470.00,
  "variacion_precio": 520.00,
  "variacion_cantidad": -50.00,
  "eficiencia": "Favorable en cantidad, Desfavorable en precio"
}
```

---

## 🔄 Flujo de Procesamiento

### 1. Lectura del Excel
```javascript
// Pseudocódigo en backend/utils/excelParser.js
function parseExcel(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet);
  
  // Validar columnas requeridas
  validateColumns(data);
  
  return data;
}
```

### 2. Cálculo de Variaciones
```javascript
// Pseudocódigo en backend/utils/formulas.js
function calculateVariations(record) {
  const costoEstandar = record.ps * record.qs * record.unidades_producidas;
  const costoReal = record.precio_real * record.cantidad_real * record.unidades_producidas;
  
  const variacionTotal = costoReal - costoEstandar;
  const variacionPrecio = (record.precio_real - record.ps) * record.cantidad_real;
  const variacionCantidad = (record.cantidad_real - record.qs) * record.ps;
  
  return {
    costo_estandar: costoEstandar,
    costo_real: costoReal,
    variacion_total: variacionTotal,
    variacion_precio: variacionPrecio,
    variacion_cantidad: variacionCantidad
  };
}
```

### 3. Generación de Reportes
```javascript
// Pseudocódigo en backend/controllers/variationController.js
function generateReport(data) {
  const results = data.map(record => ({
    ...record,
    ...calculateVariations(record),
    eficiencia: classifyEfficiency(record)
  }));
  
  return {
    summary: calculateSummary(results),
    details: results,
    charts: prepareChartsData(results)
  };
}
```

---

## 📈 Interpretación de Variaciones

### Variación Favorable
- **Precio:** Precio real < Precio estándar (se pagó menos de lo esperado)
- **Cantidad:** Cantidad real < Cantidad estándar (se usó menos de lo esperado)
- **Impacto:** Reducción de costos, mejor eficiencia

### Variación Desfavorable
- **Precio:** Precio real > Precio estándar (se pagó más de lo esperado)
- **Cantidad:** Cantidad real > Cantidad estándar (se usó más de lo esperado)
- **Impacto:** Incremento de costos, posible ineficiencia

---

## 🎯 Reglas de Negocio

### Validaciones Requeridas
1. **Archivo Excel:**
   - Formato válido (.xlsx o .xls)
   - Todas las columnas requeridas presentes
   - Valores numéricos en campos de costos/cantidades

2. **Datos:**
   - `ps` > 0
   - `qs` > 0
   - `precio_real` > 0
   - `cantidad_real` > 0
   - `unidades_producidas` > 0

3. **Cálculos:**
   - Redondear resultados a 2 decimales
   - Manejar divisiones por cero
   - Validar que los totales suman correctamente

### Casos Especiales
- **Variación = 0:** Costo real = Costo estándar (desempeño perfecto)
- **Múltiples materiales:** Calcular variaciones por separado y agregar en resumen
- **Producción cero:** No calcular variaciones (error de entrada)

---

## 🧠 Contexto Académico

Este sistema debe reflejar los **principios de contabilidad de costos** vistos en clase:
- Diferencia entre costos históricos y predeterminados
- Importancia del control de gestión
- Análisis de desviaciones para toma de decisiones
- Presupuestación y control presupuestal

**Referencias académicas:**
- Ver notas de clase sobre costeo estándar
- Consultar libro de texto (Capítulo de Costos Estándar)
- Documentación en `documentacion/Requerimientos de documentacion.md`
