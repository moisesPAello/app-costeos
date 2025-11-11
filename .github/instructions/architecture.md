# Arquitectura del Proyecto

## 🏗️ Visión General
Sistema web de **costeo estándar** que calcula variaciones entre costos reales y presupuestados, aplicando principios contables de Precio Estándar (PS) y Cantidad Estándar (QS).

---

## 📦 Módulos Principales

El sistema está organizado en **5 módulos independientes**:

1. **Login de usuario**
   - Autenticación básica
   - Gestión de sesiones

2. **Carga de archivos Excel**
   - Subida mediante `multer`
   - Validación de formato
   - Procesamiento con `xlsx` (SheetJS)

3. **Procesamiento de costos estándar**
   - Cálculo de PS (Precio Estándar)
   - Cálculo de QS (Cantidad Estándar)
   - Aplicación de fórmulas contables

4. **Análisis de variaciones**
   - Comparación real vs. presupuestado
   - Generación de métricas de desempeño

5. **Reportes visuales**
   - Tablas de datos procesados
   - Gráficos con Chart.js
   - Exportación de resultados

---

## 🔄 Flujo de Datos

```
Usuario → Login → Dashboard
              ↓
        Subir Excel → Validar
              ↓
        Procesar costos → Calcular variaciones
              ↓
        Generar reportes → Visualizar
```

### Niveles del DFD
- **Nivel 0 (Contexto):** Usuario interactúa con el sistema, entrada de Excel, salida de reportes
- **Nivel 1:** Desglose de los 5 módulos principales
- **Nivel 2:** Detalle de procesos críticos (cálculo de variaciones, procesamiento de Excel)

---

## 🗂️ Estructura de Archivos Esperada

```
app-costeos/
├── frontend/
│   ├── index.html          # Página principal
│   ├── login.html          # Formulario de autenticación
│   ├── dashboard.html      # Panel de control
│   ├── css/
│   │   └── styles.css      # Estilos personalizados (complementa TailwindCSS)
│   └── js/
│       ├── login.js        # Lógica de autenticación
│       ├── upload.js       # Manejo de carga de archivos
│       ├── charts.js       # Configuración de Chart.js
│       └── api.js          # Cliente Fetch API para comunicación con backend
│
├── backend/
│   ├── server.js           # Punto de entrada de Express
│   ├── routes/
│   │   ├── auth.js         # Rutas de autenticación
│   │   ├── upload.js       # Rutas de carga de Excel
│   │   └── reports.js      # Rutas de generación de reportes
│   ├── controllers/
│   │   ├── costingController.js    # Lógica de costeo
│   │   └── variationController.js  # Análisis de variaciones
│   ├── utils/
│   │   ├── excelParser.js  # Procesamiento de archivos XLSX
│   │   └── formulas.js     # Fórmulas de PS y QS
│   └── data/
│       └── users.json      # Datos locales (usuarios, sesiones)
│
├── uploads/                # Archivos Excel cargados temporalmente
├── documentacion/          # Documentación académica y técnica
├── .github/
│   └── instructions/       # Guías para IA y desarrolladores
└── package.json
```

---

## 🧩 Patrones de Diseño

### Backend (Express)
- **Estructura MVC simplificada:**
  - `routes/` → Definición de endpoints
  - `controllers/` → Lógica de negocio
  - `utils/` → Funciones auxiliares reutilizables

### Frontend (Vanilla JS)
- **Separación de responsabilidades:**
  - Archivos HTML por vista/módulo
  - Scripts JS independientes por funcionalidad
  - Comunicación con backend mediante Fetch API

### Persistencia
- **Sin base de datos compleja:** JSON/CSV para almacenamiento temporal
- Los datos de Excel se procesan en memoria y generan reportes efímeros

---

## 🔗 Puntos de Integración

### Frontend ↔ Backend
- **API REST:** Comunicación mediante JSON
- **Endpoints esperados:**
  - `POST /api/auth/login` - Autenticación
  - `POST /api/upload` - Subida de Excel (multipart/form-data)
  - `GET /api/reports` - Obtener reportes generados
  - `POST /api/costing/calculate` - Procesar costos

### Backend ↔ Archivos
- `multer` para manejo de uploads
- `xlsx` para lectura de Excel (.xlsx, .xls)
- Almacenamiento temporal en carpeta `uploads/`

---

## ⚠️ Consideraciones Importantes

1. **No hay autenticación robusta:** Login básico para demostración académica
2. **Datos no persisten:** El sistema no requiere base de datos SQL
3. **Fórmulas contables:** Toda la lógica debe reflejar los principios vistos en clase
4. **Modular para documentación:** Cada módulo debe tener diagramas UML independientes (casos de uso, clases, secuencia, estados, actividades, componentes)
