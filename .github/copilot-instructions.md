# Guía de IA para app-costeos

## 🎯 Propósito del Proyecto
Sistema web de **costeo estándar** que automatiza el cálculo y análisis de variaciones entre costos reales y presupuestados. Desarrollado como proyecto académico para demostrar aplicación de principios contables y desarrollo de software modular.

---

## 📚 Documentación Modular

### Arquitectura y Estructura
- **[Arquitectura del Proyecto](instructions/architecture.md)**: Módulos, flujo de datos, estructura de archivos y patrones de diseño
- **[Stack Tecnológico](instructions/stack.md)**: Node.js + Express backend, JavaScript Vanilla frontend, TailwindCSS + Chart.js

### Desarrollo y Workflows
- **[Workflows de Desarrollo](instructions/workflows.md)**: Comandos esenciales, debugging, checklist de entrega académica
- **[Convenciones de Código](instructions/conventions.md)**: Nomenclatura, patrones de módulos, manejo de errores

### Lógica de Negocio
- **[Lógica de Costeo Estándar](instructions/business-logic.md)**: Fórmulas contables (PS, QS, variaciones), estructura de datos, reglas de negocio

### Control de Versiones
- **[Commits Convencionales](instructions/commits_convencionales.md)**: Estándar de mensajes de commit
- **[Convención de Ramas](instructions/convencion_de_ramas.md)**: Nomenclatura de branches (feature/, fix/, chore/, etc.)

---

## ⚡ Quick Start

### Comandos Clave
```powershell
npm install                    # Instalar dependencias
npm start                      # Iniciar servidor (puerto 3000)
npm run dev                    # Modo desarrollo con hot-reload
```

### Estructura Rápida
```
frontend/       → HTML, CSS, JS (interfaz de usuario)
backend/        → Express server, controllers, utils
  routes/       → Definición de endpoints API
  controllers/  → Lógica de negocio
  utils/        → Parsing de Excel, fórmulas contables
uploads/        → Archivos Excel temporales
documentacion/  → Docs académicas (DFD, UML)
```

---

## 🔑 Conceptos Críticos para IAs

### 1. Sistema Modular (5 módulos independientes)
- Login → Carga Excel → Procesamiento → Análisis → Reportes
- Cada módulo requiere diagramas UML completos (casos de uso, clases, secuencia, estados, actividades, componentes)

### 2. Fórmulas Contables No Negociables
```javascript
Costo Estándar = PS × QS × Unidades Producidas
Variación de Precio = (Precio Real - PS) × Cantidad Real
Variación de Cantidad = (Cantidad Real - QS) × PS
```
**Ver detalles:** [business-logic.md](instructions/business-logic.md)

### 3. Sin Base de Datos Compleja
- Persistencia: JSON/CSV local
- Usuario: `backend/data/users.json`
- Datos temporales en memoria para procesamiento

### 4. Excel como Fuente de Datos
- Columnas requeridas: `material`, `ps`, `qs`, `precio_real`, `cantidad_real`, `unidades_producidas`
- Procesamiento con `xlsx` (SheetJS)
- Validación obligatoria de formato

### 5. Convenciones de Git Estrictas
- **Ramas:** `feature/`, `fix/`, `chore/`, `release/`
- **Commits:** `feat:`, `fix:`, `docs:`, `refactor:`, etc.
- **Ver:** [commits_convencionales.md](instructions/commits_convencionales.md)

---

## 🚨 Restricciones Importantes

1. **Proyecto Académico:** Debe ser funcional pero no requiere autenticación robusta
2. **Tecnologías Fijas:** No cambiar stack sin aprobación
3. **Documentación Obligatoria:** DFD niveles 0-1, 6 diagramas UML por módulo
4. **Entorno Windows PowerShell:** Comandos deben ser compatibles

---

## 🧠 Principios de IA al Desarrollar

### Al escribir código:
1. Seguir convenciones en [conventions.md](instructions/conventions.md)
2. Implementar validaciones de datos en todo endpoint
3. Mantener separación entre rutas → controladores → utils
4. Documentar fórmulas contables con comentarios

### Al implementar un módulo:
1. Crear endpoint en `backend/routes/`
2. Lógica en `backend/controllers/`
3. Vista HTML + JS en `frontend/`
4. Actualizar documentación de arquitectura
5. Probar flujo completo manualmente

### Al hacer commits:
```powershell
git commit -m "feat(costing): implementar cálculo de variaciones"
git commit -m "fix(excel): validar columnas requeridas"
git commit -m "docs: agregar manual de usuario"
```

---

## 📖 Recursos Adicionales

- **README Principal:** [README.md](../README.md)
- **Requerimientos Académicos:** [documentacion/Requerimientos de documentacion.md](../documentacion/Requerimientos de documentacion.md)
- **Repositorio:** moisesPAello/app-costeos (branch: main)

---

## 💡 Preguntas Frecuentes para IAs

**¿Dónde van las fórmulas de costeo?**  
→ `backend/utils/formulas.js`

**¿Cómo se estructura una respuesta JSON?**  
→ Ver sección "Manejo de Datos" en [conventions.md](instructions/conventions.md)

**¿Qué validaciones son obligatorias?**  
→ Ver "Reglas de Negocio" en [business-logic.md](instructions/business-logic.md)

**¿Cómo se nombra una nueva rama?**  
→ Ver [convencion_de_ramas.md](instructions/convencion_de_ramas.md)

**¿Qué formato debe tener el Excel de entrada?**  
→ Ver "Estructura de Datos Esperada" en [business-logic.md](instructions/business-logic.md)

---

**Última actualización:** 11 de noviembre de 2025  
**Mantenedores:** Equipo app-costeos  
**Contacto:** Ver documentación académica para información del equipo
