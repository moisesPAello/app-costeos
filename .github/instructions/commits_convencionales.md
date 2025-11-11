# Commits Convencionales

## 📘 Propósito
Estándar para escribir mensajes de commits claros y consistentes.  
Facilita la automatización, la generación de changelogs y el control de versiones semántico (SemVer).

---

## 🧩 Estructura del mensaje
```

<tipo>[ámbito opcional]: <descripción corta>

[cuerpo opcional]

[nota al pie opcional]

```

### Ejemplos
```

feat: agregar módulo de carga de Excel
fix(core): corregir error en el cálculo de costos
refactor!: eliminar compatibilidad con versión antigua
docs: actualizar README con nueva guía

```

---

## 🚀 Tipos principales

| Tipo | Uso | Impacto en versión |
|------|------|--------------------|
| **feat** | Nueva funcionalidad | MINOR |
| **fix** | Corrección de error | PATCH |
| **BREAKING CHANGE** / `!` | Cambio incompatible | MAJOR |
| **docs** | Cambios solo en documentación | — |
| **style** | Formato, sin cambio de código | — |
| **refactor** | Reestructuración interna | — |
| **perf** | Mejora de rendimiento | — |
| **test** | Agrega o corrige tests | — |
| **build** | Cambios en build o dependencias | — |
| **ci** | Cambios en CI/CD | — |
| **chore** | Mantenimiento o tareas menores | — |
| **revert** | Reversión de commits | — |

---

## ⚙️ Reglas básicas

1. El **tipo** es obligatorio.  
   Ej: `feat`, `fix`, `docs`.
2. El **ámbito** es opcional, pero útil para identificar módulos.  
   Ej: `feat(parser): agregar validación`.
3. La **descripción** es un resumen breve, en **presente y minúsculas**.
4. Si hay un cambio de ruptura, usar:
   - `!` después del tipo (`refactor!: cambiar estructura interna`), o
   - una nota al pie:  
     `BREAKING CHANGE: el formato del archivo cambió.`
5. Dejar una **línea en blanco** entre la descripción y el cuerpo.
6. Las notas al pie como `Refs:` o `Reviewed-by:` siguen la sintaxis Git estándar.

---

## 🧠 Ejemplos prácticos

### Commit simple
```

docs: corregir errores ortográficos en README

```

### Commit con cuerpo
```

fix: error al leer archivo Excel

Se corrigió el manejo de celdas vacías que causaban fallos al parsear.
Refs: #23

```

### Commit con cambio de ruptura
```

refactor!: eliminar compatibilidad con Node 16

BREAKING CHANGE: el sistema ahora requiere Node 18 o superior.

```


## 💡 Buenas prácticas

- Un commit = un cambio lógico.  
- Si un cambio encaja en más de un tipo, **divídelo**.  
- Sé coherente con los ámbitos y la forma de los mensajes.  
- Usa `git rebase -i` antes de hacer merge para limpiar commits.
