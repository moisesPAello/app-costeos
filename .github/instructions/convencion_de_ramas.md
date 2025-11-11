# Convención de Ramas (Conventional Branch)

## 📘 Descripción general
**Conventional Branch** es una especificación para nombrar ramas de Git de manera **estructurada y estandarizada**, haciendo que su propósito sea claro tanto para personas como para herramientas automatizadas.

El objetivo es mantener el control de versiones **organizado, legible y automatizable**, facilitando el trabajo en equipo y la integración con flujos CI/CD.

---

## 🧩 Estructura básica
Cada rama debe seguir el formato:

```

<tipo>/<descripción>

```

Ejemplo:  
`feature/agregar-lectura-excel`  
`fix/error-en-calculo`  
`release/v1.2.0`

---

## 🚀 Tipos de rama

| Tipo | Uso principal | Ejemplo |
|------|----------------|----------|
| **main** | Rama principal del proyecto (producción o estable) | `main` |
| **feature/** o **feat/** | Nuevas funcionalidades | `feature/agregar-login` |
| **bugfix/** o **fix/** | Corrección de errores no críticos | `bugfix/arreglo-header` |
| **hotfix/** | Corrección urgente en producción | `hotfix/parche-seguridad` |
| **release/** | Preparación de versiones de entrega | `release/v1.0.0` |
| **chore/** | Tareas no relacionadas con código (docs, dependencias, etc.) | `chore/actualizar-readme` |

---

## ⚙️ Reglas básicas

1. **Solo minúsculas**, números y guiones (`-`).  
   No usar guiones dobles, espacios ni caracteres especiales.
   - ✅ `feature/cargar-archivo-excel`
   - ❌ `Feature/cargar_excel`

2. **Nombres claros y cortos.**
   La descripción debe indicar el propósito de la rama.

3. **Evitar guiones o puntos consecutivos.**
   - ❌ `release/v1..0.0`
   - ✅ `release/v1.0.0`

4. **Incluir número de tarea o ticket** (si aplica).  
   Ejemplo: `feature/issue-12-lectura-excel`

---

## 🎯 Beneficios

- **Comunicación clara:** el nombre de la rama indica su propósito.  
- **Automatización:** facilita flujos CI/CD (por ejemplo, despliegues automáticos desde ramas `release/`).  
- **Colaboración:** evita confusiones entre miembros del equipo y mejora la gestión de merges.  
- **Escalabilidad:** se mantiene orden incluso en equipos grandes.

---

## 💡 Ejemplos prácticos

| Caso | Nombre de rama sugerido |
|------|--------------------------|
| Nueva función para importar Excel | `feature/importar-excel` |
| Arreglo de error en cálculo de costos | `fix/calculo-costos` |
| Actualización del README | `chore/actualizar-readme` |
| Versión final del prototipo | `release/v0.1.0` |
| Parche urgente por error en deploy | `hotfix/error-produccion` |

---

## ❓ FAQ

**¿Por qué no hay tantos tipos como en Conventional Commits?**  
Las ramas son temporales y deben mantenerse simples. Demasiados tipos las harían difíciles de recordar y administrar.

**¿Se puede automatizar la verificación?**  
Sí. Se pueden usar herramientas como `commit-check` o `commit-check-action` para validar que las ramas sigan esta convención.
