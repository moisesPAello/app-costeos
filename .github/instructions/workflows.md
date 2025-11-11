# Workflows de Desarrollo

## 🚀 Comandos Esenciales

### Instalación y Configuración
```powershell
# Clonar el repositorio
git clone <repo_url>
cd app-costeos

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start

# Acceder a la aplicación
# Abrir navegador en http://localhost:3000
```

### Scripts NPM Esperados
```json
{
  "scripts": {
    "start": "node backend/server.js",
    "dev": "nodemon backend/server.js",
    "test": "echo \"No tests yet\" && exit 0"
  }
}
```

---

## 🔧 Flujo de Desarrollo

### 1. Crear nueva funcionalidad
```powershell
# Crear rama siguiendo convenciones
git checkout -b feature/nombre-funcionalidad

# Desarrollar y hacer commits convencionales
git add .
git commit -m "feat(modulo): descripción breve"

# Push y crear PR
git push origin feature/nombre-funcionalidad
```

### 2. Corregir errores
```powershell
# Crear rama de bugfix
git checkout -b fix/descripcion-error

# Corregir y commitear
git commit -m "fix(modulo): descripción del error corregido"
```

### 3. Actualizar documentación
```powershell
git checkout -b chore/actualizar-docs
git commit -m "docs: actualizar README con nuevas instrucciones"
```

---

## 🧪 Testing y Validación

### Testing Manual
1. **Probar login:**
   - Acceder a `/login.html`
   - Verificar credenciales (almacenadas en `backend/data/users.json`)

2. **Probar carga de Excel:**
   - Preparar archivo `.xlsx` con formato esperado
   - Subir desde interfaz
   - Verificar que se guarda en `uploads/`

3. **Probar cálculos:**
   - Verificar que las fórmulas de PS y QS son correctas
   - Comparar resultados con cálculos manuales

4. **Probar visualizaciones:**
   - Verificar que Chart.js renderiza correctamente
   - Comprobar que los datos del gráfico coinciden con los procesados

### Debugging en Desarrollo
```powershell
# Iniciar con nodemon para hot-reload
npm install -g nodemon
npm run dev

# Ver logs del servidor en consola
# Usar DevTools del navegador para frontend
```

---

## 📋 Checklist de Desarrollo por Módulo

### Al implementar un módulo nuevo:
- [ ] Crear endpoints en `backend/routes/`
- [ ] Implementar lógica en `backend/controllers/`
- [ ] Crear vista HTML en `frontend/`
- [ ] Agregar script JS en `frontend/js/`
- [ ] Documentar en diagramas UML (casos de uso, clases, secuencia, estados, actividades, componentes)
- [ ] Probar manualmente
- [ ] Actualizar README si es necesario

---

## 🏗️ Preparación para Entrega Académica

### Generar Documentación
1. **Crear PDF con todos los diagramas:**
   - Usar herramientas como draw.io, Lucidchart, PlantUML
   - Exportar cada diagrama como PNG/PDF
   - Compilar en documento Word/LaTeX

2. **Diccionario de datos:**
   - Listar todos los campos de archivos JSON
   - Documentar estructura esperada del Excel
   - Describir variables en fórmulas de costeo

3. **Manual de usuario:**
   - Capturas de pantalla de cada módulo
   - Pasos para ejecutar el sistema
   - Casos de uso de ejemplo

### Demo en Vivo
```powershell
# Verificar que todo funciona antes de la presentación
npm start

# Preparar casos de prueba:
# - Archivo Excel de ejemplo
# - Credenciales de usuario de prueba
# - Resultados esperados conocidos
```

---

## 🐛 Solución de Problemas Comunes

### El servidor no inicia
```powershell
# Verificar que Node.js está instalado
node --version

# Reinstalar dependencias
Remove-Item -Recurse -Force node_modules
npm install

# Verificar que el puerto 3000 no está ocupado
netstat -ano | findstr :3000
```

### Error al subir archivos Excel
- Verificar que `multer` está configurado correctamente
- Comprobar que la carpeta `uploads/` existe y tiene permisos
- Validar el formato del archivo (debe ser .xlsx o .xls)

### Gráficos no se renderizan
- Verificar que Chart.js está cargado desde CDN
- Comprobar que los datos tienen el formato correcto
- Revisar consola del navegador para errores JavaScript

### Cálculos incorrectos
- Revisar las fórmulas en `backend/utils/formulas.js`
- Comparar con fórmulas vistas en clase
- Verificar que los datos del Excel se parsean correctamente
