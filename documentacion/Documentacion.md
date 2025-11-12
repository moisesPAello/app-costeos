# 🧩 Descripción de Módulos - CostManager Web App

El sistema se compone de **cinco módulos principales**, cada uno con responsabilidades específicas dentro del proceso de costeo estándar. A continuación se detalla su función, entradas, salidas y actores involucrados.

---

## 1. Autenticación (`auth`)
**Propósito:**  
Controlar el acceso a la aplicación. Permitir el inicio de sesión y registro de usuarios con permisos básicos.

**Funciones clave:**
- Registro de nuevos usuarios.
- Inicio y cierre de sesión.
- Validación de credenciales.
- Control de acceso a los demás módulos.

**Entradas:**
- Usuario, contraseña.

**Salidas:**
- Token o sesión activa.

**Actores:**  
Administrador, Usuario general.

---

## 2. Gestión de Estándares (`standards`)
**Propósito:**  
Registrar y mantener los valores estándar de materiales directos y mano de obra directa, base para los cálculos de variación.

**Funciones clave:**
- Registrar materiales directos (nombre, cantidad estándar, precio estándar).
- Registrar mano de obra directa (horas estándar, tarifa estándar).
- Calcular costo estándar unitario (PS × QS).
- Editar o eliminar estándares existentes.

**Entradas:**
- Datos de materiales y mano de obra estándar.

**Salidas:**
- Tabla de estándares con costo unitario.
- Archivo JSON o CSV con datos guardados.

**Actores:**  
Administrador, Analista de costos.

---

## 3. Carga de Datos Reales (`realdata`)
**Propósito:**  
Permitir al usuario cargar datos reales desde un archivo Excel o introducirlos manualmente para compararlos con los estándares.

**Funciones clave:**
- Subir archivo Excel con datos reales (con `multer`).
- Leer y procesar datos con `xlsx`.
- Validar estructura del archivo.
- Registrar datos reales temporalmente.

**Entradas:**
- Archivo Excel o formulario con valores reales: QR, PR, HR, TR.

**Salidas:**
- Datos reales listos para el cálculo de variaciones.

**Actores:**  
Analista de costos, Operador.

---

## 4. Cálculo de Variaciones (`variations`)
**Propósito:**  
Realizar el análisis de desviaciones entre los costos reales y los estándares para materiales y mano de obra.

**Funciones clave:**
- Calcular variaciones de materiales:
  - Precio: \( VP = (PR - PS) × QR \)
  - Cantidad: \( VC = (QR - QS) × PS \)
- Calcular variaciones de mano de obra:
  - Tarifa: \( VTMOD = (TR - TS) × HR \)
  - Eficiencia: \( VEMOD = (HR - HS) × TS \)
- Determinar si la variación es favorable (F) o desfavorable (D).
- Generar resumen total de variaciones.

**Entradas:**
- Datos estándar y reales (JSON o CSV).

**Salidas:**
- Reporte numérico de variaciones por tipo.
- Estado F/D por elemento.

**Actores:**  
Analista de costos.

---

## 5. Reportes y Visualización (`reports`)
**Propósito:**  
Presentar los resultados de las variaciones mediante gráficos, tablas y exportación de reportes.

**Funciones clave:**
- Mostrar variaciones mediante gráficos de barras o pastel (Chart.js).
- Resumen general de resultados por categoría.
- Exportar reporte a Excel o PDF.
- Filtrar por periodo, producto o tipo de variación.

**Entradas:**
- Datos procesados de variaciones.

**Salidas:**
- Dashboard visual.
- Reporte descargable.

**Actores:**  
Gerente, Analista de costos.

---

## 🔗 Interacción entre módulos

| Módulo origen | Módulo destino | Flujo |
|----------------|----------------|--------|
| Auth | Standards / RealData | Control de acceso |
| Standards | Variations | Envía datos estándar |
| RealData | Variations | Envía datos reales |
| Variations | Reports | Envía resultados procesados |

---

## ⚙️ Flujo general

1. Usuario inicia sesión.  
2. Registra los estándares de materiales y mano de obra.  
3. Carga los datos reales de producción.  
4. El sistema calcula las variaciones automáticamente.  
5. Se visualizan y exportan los reportes.

