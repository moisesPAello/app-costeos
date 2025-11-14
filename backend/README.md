# Backend - Sistema de Costeo Estándar

## 📋 Descripción
Backend desarrollado con **Node.js + Express** que implementa la lógica de negocio para el sistema de costeo estándar. Procesa archivos Excel, calcula variaciones entre costos reales y estándar, y genera reportes de análisis financiero.

---

## 🏗️ Estructura del Módulo

```
backend/
├── server.js                    # Punto de entrada del servidor Express
├── package.json                 # Dependencias y scripts
├── routes/
│   ├── auth.js                  # Autenticación de usuarios
│   ├── upload.js                # Carga y procesamiento de Excel
│   └── reports.js               # Generación de reportes
├── controllers/
│   ├── costingController.js     # Lógica de costeo estándar
│   └── variationController.js   # Análisis de variaciones
├── utils/
│   ├── excelParser.js           # Procesamiento de archivos XLSX
│   └── formulas.js              # Fórmulas contables (PS, QS, variaciones)
└── data/
    └── users.json               # Base de datos local de usuarios
```

---

## 🚀 Instalación y Uso

### Instalar dependencias
```powershell
cd backend
npm install
```

### Iniciar servidor
```powershell
# Modo producción
npm start

# Modo desarrollo (con hot-reload)
npm run dev
```

El servidor estará disponible en: **http://localhost:3000**

---

## 📡 Endpoints de la API

### Autenticación
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "admin",
    "role": "administrator"
  },
  "message": "Login exitoso"
}
```

---

### Carga de archivos Excel
```http
POST /api/upload
Content-Type: multipart/form-data

excel: [archivo.xlsx]
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "material": "Materia Prima A",
      "ps": 10.50,
      "qs": 5.0,
      "precio_real": 11.00,
      "cantidad_real": 5.2,
      "unidades_producidas": 100,
      "costo_estandar": 5250.00,
      "costo_real": 5720.00,
      "variacion_total": 470.00,
      "variacion_precio": 520.00,
      "variacion_cantidad": -50.00,
      "eficiencia": "Favorable en cantidad, Desfavorable en precio"
    }
  ],
  "message": "Archivo procesado exitosamente"
}
```

---

### Generar reporte
```http
POST /api/reports/generate
Content-Type: application/json

{
  "data": [/* datos procesados */]
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total_materiales": 5,
      "costo_estandar_total": 25000.00,
      "costo_real_total": 26500.00,
      "variacion_total": 1500.00,
      "eficiencia_general": "Desfavorable - Costos reales mayores a los estándar"
    },
    "details": [/* registros individuales */],
    "charts": {/* datos para gráficos */}
  }
}
```

---

## 🧮 Fórmulas Implementadas

Todas las fórmulas están documentadas en `utils/formulas.js`:

```javascript
// Costo Estándar
Costo Estándar = PS × QS × Unidades Producidas

// Variación de Precio
Variación de Precio = (Precio Real - PS) × Cantidad Real

// Variación de Cantidad
Variación de Cantidad = (Cantidad Real - QS) × PS

// Variación Total
Variación Total = Variación de Precio + Variación de Cantidad
```

---

## 📊 Formato del Excel de Entrada

El archivo Excel debe contener las siguientes columnas:

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `material` | String | Nombre del material |
| `ps` | Number | Precio estándar unitario |
| `qs` | Number | Cantidad estándar por unidad |
| `precio_real` | Number | Precio real pagado |
| `cantidad_real` | Number | Cantidad real utilizada |
| `unidades_producidas` | Number | Unidades fabricadas |

**Ejemplo:**
| material | ps | qs | precio_real | cantidad_real | unidades_producidas |
|----------|----|----|-------------|---------------|---------------------|
| Materia Prima A | 10.50 | 5.0 | 11.00 | 5.2 | 100 |
| Materia Prima B | 8.00 | 3.5 | 7.80 | 3.6 | 100 |

---

## 🔐 Usuarios de Prueba

Configurados en `data/users.json`:

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| admin | admin123 | administrator |
| contador | contador123 | accountant |
| usuario | usuario123 | user |

---

## 🛠️ Dependencias

```json
{
  "express": "^4.18.2",      // Framework web
  "cors": "^2.8.5",          // Permitir CORS
  "multer": "^1.4.5-lts.1",  // Manejo de archivos
  "xlsx": "^0.18.5"          // Procesamiento de Excel
}
```

---

## ⚠️ Validaciones Implementadas

### Archivo Excel
- ✅ Formato válido (.xlsx o .xls)
- ✅ Tamaño máximo: 5MB
- ✅ Todas las columnas requeridas presentes
- ✅ Valores numéricos válidos

### Datos
- ✅ `ps` > 0
- ✅ `qs` > 0
- ✅ `precio_real` > 0
- ✅ `cantidad_real` > 0
- ✅ `unidades_producidas` > 0

---

## 🧪 Testing Manual

```powershell
# Probar endpoint de login
curl -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"username":"admin","password":"admin123"}'

# Probar carga de Excel (requiere archivo)
# Usar Postman o Thunder Client
```

---

## 📝 Notas Importantes

1. **Sin autenticación robusta:** Login básico para demostración académica
2. **Sin base de datos:** Persistencia en JSON local
3. **Archivos temporales:** Los Excel se guardan en `../uploads/`
4. **Cálculos en memoria:** Datos procesados no se almacenan permanentemente

---

## 🤝 Contribución

Seguir las convenciones definidas en:
- [conventions.md](../.github/instructions/conventions.md)
- [commits_convencionales.md](../.github/instructions/commits_convencionales.md)

---

**Desarrollado por:** Equipo app-costeos  
**Última actualización:** 14 de noviembre de 2025
