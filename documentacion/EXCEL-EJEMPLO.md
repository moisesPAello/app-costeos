# Archivo Excel de Ejemplo para Costeo Estándar

## 📋 Estructura Requerida

El archivo Excel debe tener **exactamente** estas columnas (en este orden o cualquier orden):

| material | ps | qs | precio_real | cantidad_real | unidades_producidas |
|----------|----|----|-------------|---------------|---------------------|
| Materia Prima A | 10.50 | 5.0 | 11.00 | 5.2 | 100 |
| Materia Prima B | 8.00 | 3.5 | 7.80 | 3.6 | 100 |
| Materia Prima C | 15.00 | 2.0 | 15.50 | 1.9 | 100 |
| Material Directo 1 | 20.00 | 4.0 | 19.50 | 4.1 | 100 |
| Material Directo 2 | 12.50 | 6.0 | 13.00 | 5.8 | 100 |

## 📊 Descripción de Columnas

1. **material** (String)
   - Nombre del material o insumo
   - Ejemplo: "Materia Prima A", "Material Directo 1"

2. **ps** (Number)
   - Precio Estándar unitario
   - Lo que se espera pagar por unidad
   - Ejemplo: 10.50

3. **qs** (Number)
   - Cantidad Estándar por unidad producida
   - Cantidad de insumo que se espera usar por producto
   - Ejemplo: 5.0

4. **precio_real** (Number)
   - Precio Real pagado por unidad
   - Lo que realmente se pagó
   - Ejemplo: 11.00

5. **cantidad_real** (Number)
   - Cantidad Real utilizada por unidad producida
   - Cantidad de insumo que realmente se usó
   - Ejemplo: 5.2

6. **unidades_producidas** (Number)
   - Número de unidades fabricadas
   - Ejemplo: 100

## 🧮 Cálculos Automáticos

El sistema calculará automáticamente:

- **Costo Estándar** = ps × qs × unidades_producidas
- **Costo Real** = precio_real × cantidad_real × unidades_producidas
- **Variación Total** = Costo Real - Costo Estándar
- **Variación de Precio** = (precio_real - ps) × cantidad_real
- **Variación de Cantidad** = (cantidad_real - qs) × ps
- **Eficiencia** = Clasificación favorable/desfavorable

## ✅ Validaciones

- Todas las columnas son **obligatorias**
- Todos los valores numéricos deben ser **mayores a 0**
- El archivo debe ser **.xlsx** o **.xls**
- Tamaño máximo: **5MB**

## 📥 Crear Archivo de Ejemplo

### Opción 1: Excel Manual
1. Abrir Microsoft Excel
2. En la primera fila, escribir los nombres de columnas exactos
3. Agregar datos de ejemplo en las filas siguientes
4. Guardar como `costeo-ejemplo.xlsx`

### Opción 2: CSV y convertir
1. Crear archivo `costeo-ejemplo.csv` con este contenido:
```csv
material,ps,qs,precio_real,cantidad_real,unidades_producidas
Materia Prima A,10.50,5.0,11.00,5.2,100
Materia Prima B,8.00,3.5,7.80,3.6,100
Materia Prima C,15.00,2.0,15.50,1.9,100
Material Directo 1,20.00,4.0,19.50,4.1,100
Material Directo 2,12.50,6.0,13.00,5.8,100
```
2. Abrir en Excel y guardar como .xlsx

## 🎯 Ejemplo Completo

```
material              | ps    | qs  | precio_real | cantidad_real | unidades_producidas
---------------------|-------|-----|-------------|---------------|--------------------
Acero estructural    | 45.00 | 2.5 | 46.50       | 2.4           | 50
Aluminio ligero      | 60.00 | 1.8 | 59.00       | 1.9           | 50
Plástico ABS         | 12.00 | 5.0 | 12.50       | 4.8           | 50
Tornillería M8       | 0.50  | 20  | 0.45        | 21            | 50
Cable eléctrico      | 3.50  | 10  | 3.60        | 9.8           | 50
```

**Resultados esperados para el primer material:**
- Costo Estándar: 45 × 2.5 × 50 = $5,625.00
- Costo Real: 46.5 × 2.4 × 50 = $5,580.00
- Variación Total: -$45.00 (Favorable)
- Variación Precio: (46.5 - 45) × 2.4 = $3.60 (Desfavorable)
- Variación Cantidad: (2.4 - 2.5) × 45 = -$4.50 (Favorable)

---

**Ubicación sugerida:** Guardar en carpeta `documentacion/ejemplos/`
