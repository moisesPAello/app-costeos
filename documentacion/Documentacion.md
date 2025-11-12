# 📁 Documentación UML - CostManager Web App

Este folder contiene los **diagramas UML por módulo** del sistema de costeo estándar. Cada módulo incluye **casos de uso, clases, secuencia, estados, actividades y componentes**.

---

## 🧩 Módulos principales

1. **Autenticación**
   - Registro y login de usuarios (opcional, si se requiere manejo de sesiones)
   - Control básico de acceso para datos de costeo

2. **Gestión de Estándares**
   - Registro de materiales y mano de obra estándar
   - Cálculo de costos estándar unitarios (PS × QS)

3. **Carga de Datos Reales**
   - Subida de archivos Excel (`multer`)
   - Validación y lectura de datos con `xlsx`

4. **Cálculo de Variaciones**
   - Cálculo automático de:
     - Variación de precio y consumo de materiales
     - Variación de tarifa y eficiencia de mano de obra
   - Generación de indicadores favorables/desfavorables

5. **Reportes y Visualización**
   - Generación de reportes visuales (Chart.js)
   - Exportación de resultados a Excel o PDF

---

## 📊 Diagramas por módulo

Cada subcarpeta contiene los diagramas UML correspondientes:

### 1. `auth/`
- `usecase-auth.png`
- `class-auth.png`
- `sequence-auth.png`
- `state-auth.png`
- `activity-auth.png`
- `component-auth.png`

### 2. `standards/`
- `usecase-standards.png`
- `class-standards.png`
- `sequence-standards.png`
- `state-standards.png`
- `activity-standards.png`
- `component-standards.png`

### 3. `realdata/`
- `usecase-realdata.png`
- `class-realdata.png`
- `sequence-realdata.png`
- `state-realdata.png`
- `activity-realdata.png`
- `component-realdata.png`

### 4. `variations/`
- `usecase-variations.png`
- `class-variations.png`
- `sequence-variations.png`
- `state-variations.png`
- `activity-variations.png`
- `component-variations.png`

### 5. `reports/`
- `usecase-reports.png`
- `class-reports.png`
- `sequence-reports.png`
- `state-reports.png`
- `activity-reports.png`
- `component-reports.png`

---

## 🧠 Convenciones

- Todos los diagramas siguen la notación UML 2.0.
- Generados en formato `.png` o `.svg`.
- Los archivos deben nombrarse según el patrón:  
  `tipo-modulo.png` → ejemplo: `sequence-variations.png`
- Herramientas recomendadas: **draw.io**, **PlantUML** o **Lucidchart**.

---

## 📂 Estructura de carpetas

```

/documentacion
├── auth/
│    ├── usecase-auth.png
│    ├── class-auth.png
│    ├── ...
├── standards/
│    ├── usecase-standards.png
│    ├── class-standards.png
│    ├── ...
├── realdata/
├── variations/
├── reports/
└── README.md

```
