# README — Documentación (Español)

Visión general
--------------
Este repositorio contiene una aplicación web académica para ilustrar un sistema de **costeo estándar**. Lee datos desde archivos Excel, valida la estructura, calcula costos estándar y variaciones (precio y cantidad), y expone resultados vía API y vistas en el frontend.

Inicio rápido (Windows)
-----------------------
1. Clona el repositorio e instala dependencias del backend:

```powershell
git clone <repo_url>
cd app-costeos#\backend
npm install
cd ..
```

2. Inicia el servidor (puerto 3000 por defecto):

```powershell
npm start
```

3. Abre la aplicación en el navegador:

http://localhost:3000

Estructura del proyecto (resumen)
-------------------------------
- `frontend/` — Páginas HTML, CSS y scripts JS del cliente.
- `backend/` — Servidor Express:
	- `server.js` — entrada de la app.
	- `routes/` — rutas API (`auth.js`, `upload.js`, `reports.js`).
	- `controllers/` — `costingController.js`, `variationController.js`.
	- `utils/` — `excelParser.js`, `formulas.js`.
- `uploads/` — archivos Excel subidos temporalmente.
- `documentacion/` — documentación académica, DFDs y diagramas UML.

Carga de Excel — flujo y validación
----------------------------------
El flujo de carga y validación se puede dividir en pasos visibles en la aplicación y reflejados en `frontend/js/upload.js` y `backend/utils/excelParser.js`:

- Usuario sube el archivo desde la interfaz (`frontend/upload`).
- `multer` recibe y escribe el archivo en `uploads/`.
- `backend/utils/excelParser.js` lee la hoja, valida las columnas y normaliza los registros.

El diagrama de casos de uso y el diagrama de clases siguientes ayudan a entender actores, pasos y estructura de datos esperada:

Use case — carga de Excel
![Use case - carga Excel](documentacion/diagramas/carga_excel/pngs/usecase-realdata.drawio.png)

Class diagram — estructura de datos y entidades implicadas
![Class diagram - carga Excel](documentacion/diagramas/carga_excel/pngs/class-realdata.drawio.png)

Notas sobre validación
----------------------
- `excelParser.js` revisa que las columnas `material, ps, qs, precio_real, cantidad_real, unidades_producidas` existan y que los campos numéricos sean mayores que 0.
- Errores de validación devuelven una respuesta JSON con `success: false` y código de error para mostrar al usuario.

Endpoints principales
--------------------
- `POST /api/auth/login` — autenticación demo usando `data/users.json`.
- `POST /api/upload` — subir archivo Excel (multipart/form-data).
- `POST /api/costing/calculate` — procesar datos y generar resultados.
- `GET /api/reports` — recuperar reporte generado.

Requisitos del Excel de entrada
------------------------------
Las columnas requeridas (snake_case):

- `material`
- `ps` (precio estándar)
- `qs` (cantidad estándar por unidad)
- `precio_real` (precio real pagado)
- `cantidad_real` (cantidad real utilizada)
- `unidades_producidas`

Reglas de validación (resumen)
------------------------------
- Todas las columnas requeridas deben estar presentes.
- Campos numéricos (`ps`, `qs`, `precio_real`, `cantidad_real`, `unidades_producidas`) deben ser > 0.
- Redondear resultados monetarios a 2 decimales.
- Si `unidades_producidas` = 0, devolver error (no hay producción).

Lógica de cálculo (ver `backend/utils/formulas.js`)
-------------------------------------------------
- Costo estándar = `ps * qs * unidades_producidas`.
- Costo real = `precio_real * cantidad_real * unidades_producidas`.
- Variación total = `costo_real - costo_estandar`.
- Variación de precio = `(precio_real - ps) * cantidad_real`.
- Variación de cantidad = `(cantidad_real - qs) * ps`.

Procesamiento de costos — flujo detallado
----------------------------------------
El procesamiento de los registros se realiza en varios pasos que corresponden al diagrama de actividades y al diagrama de secuencia, y se distribuyen entre `controllers/costingController.js` y `utils/formulas.js`:

- Normalización y validación (excelParser) → entrada limpia a controlador.
- Cálculo por registro (`utils/formulas.js`) → se devuelven `costo_estandar`, `costo_real`, `variacion_precio`, `variacion_cantidad`.
- Agregación en resumen y preparación de datos para gráficos (`controllers/variationController.js`).

Activity flow — procesamiento de costos
![Activity - procesamiento de costos](documentacion/diagramas/procesamiento_costos/pngs/activity-procesamiento.png)

Sequence — llamada desde frontend hasta cálculo
![Sequence - procesamiento de costos](documentacion/diagramas/procesamiento_costos/pngs/sequence-procesamiento.png)

Interpretación visual en la UI
-----------------------------
Los resultados procesados se representan en `frontend/js/charts.js` y en tablas en `frontend/` — los gráficos usan la estructura preparada por los controladores para mostrar variaciones por `material` y totales.

Documentación y diagramas
-------------------------
Todos los documentos y diagramas están en la carpeta `documentacion/`:

- Requerimientos y entregables: [documentacion/Requerimientos de documentacion.md](documentacion/Requerimientos%20de%20documentacion.md)
- Guía de ejemplo de Excel: [documentacion/EXCEL-EJEMPLO.md](documentacion/EXCEL-EJEMPLO.md)
- Diagramas (DFD, UML): `documentacion/diagramas/` (subcarpetas por módulo)

Buenas prácticas y extensiones sugeridas
--------------------------------------
- Persistir reportes en una BD en lugar de JSON si se requiere histórico.
- Añadir pruebas unitarias para `formulas.js` y `excelParser.js`.
- Implementar autenticación robusta para entornos productivos.

Autores y licencias
--------------------
Proyecto académico — ver `documentacion/` para autores y entregables.

Archivos README adicionales
--------------------------
- `README_EN.md` — Documentación en inglés (completa).
 



