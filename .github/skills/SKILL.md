# Guía de Rediseño de Interfaz de Usuario: Paleta de Colores

Este documento establece las especificaciones de diseño y tokens de color para la aplicación `cv-creator-app`, basándose en la jerarquía visual requerida.

---

## 🎨 Paleta de Colores

| Prioridad | Nombre del Rol | Código Hexadecimal | Uso Principal |
| :--- | :--- | :--- | :--- |
| **1. Principal** | Primary Navy | `#0F16A6` | Encabezados de navegación, botones primarios, títulos destacados. |
| **2. Secundario** | Deep Indigo | `#181E8C` | Estados de hover/press en botones primarios, fondos secundarios, headers de secciones. |
| **3. Acento Primario**| Electric Yellow | `#F2E205` | Badges de estado activo/completado, acciones destacadas, íconos de énfasis. |
| **4. Acento Secundario**| Muted Gold | `#BFA626` | Bordes decorativos, subtítulos secundarios, indicadores secundarios. |
| **5. Fondo / Texto** | Dark Onyx | `#0D0D0D` | Texto principal, fondos oscuros de alto contraste o elementos tipográficos dominantes. |

---

## 🛠 Configuración Recomendada de Tokens (`src/theme/colors.ts`)

Crea o define la siguiente constante global de tema para mantener la consistencia en todos los componentes:

```typescript
export const Colors = {
  primary: "#0F16A6",
  primaryDark: "#181E8C",
  accent: "#F2E205",
  accentSecondary: "#BFA626",
  dark: "#0D0D0D",
  
  // Utilidades derivadas
  background: "#F8F9FA", // Fondo neutro de pantalla
  cardBackground: "#FFFFFF",
  textPrimary: "#0D0D0D",
  textMuted: "#666666",
  white: "#FFFFFF",
  border: "#BFA626",
};
```

---

## 📐 Aplicación por Componente y Pantalla

### 1. `src/app/_layout.tsx` (Navegación Header)
* **`headerStyle.backgroundColor`**: `#0F16A6` (Primary Navy)
* **`headerTintColor`**: `#F2E205` (Electric Yellow) o `#FFFFFF`
* **`headerTitleStyle`**: Texto en color blanco o amarillo eléctrico con `fontWeight: "bold"`.

---

### 2. `src/components/NavigationButton.tsx`
* **Variante Primaria (`primary`)**:
  * `backgroundColor`: `#0F16A6`
  * `color` (texto): `#FFFFFF` o `#F2E205`
* **Variante Secundaria (`secondary`)**:
  * `backgroundColor`: `"transparent"`
  * `borderColor`: `#BFA626` (Muted Gold)
  * `color` (texto): `#0F16A6`
* **Estado Presionado / Acción Principal**:
  * Fondo alternativo o resalte con `#181E8C` / `#F2E205`.

---

### 3. `src/components/InputField.tsx`
* **Label**: `#0D0D0D` (Dark Onyx) con `fontWeight: "600"`.
* **Border Color (Foco / Normal)**: `#BFA626` en foco, `#CCCCCC` en reposo.
* **Texto**: `#0D0D0D`

---

### 4. `src/app/index.tsx` (Home Screen)
* **Título Principal**: `#0F16A6`
* **Tarjetas/Secciones**:
  * Fondo: `#FFFFFF`
  * Borde superior o lateral: `#BFA626`
* **Indicadores de Estado (Completado/Pendiente)**:
  * Completado: `#F2E205` (con fondo/texto `#0D0D0D` para legibilidad).
* **Boton "Ver Vista Previa"**:
  * `backgroundColor`: `#F2E205`
  * `textColor`: `#0D0D0D`

---

### 5. `src/components/CVPreview.tsx` (Vista Previa de CV)
* **Header del CV (Nombre / Título)**: `#0F16A6`
* **Líneas divisorias de sección**: `#BFA626`
* **Títulos de sección (EXPERIENCIA, EDUCACIÓN)**: `#181E8C`
* **Texto de cuerpo**: `#0D0D0D`
* **Fechas e institución**: `#666666` / `#BFA626`

---

## ⚡ Check-list de Migración

- [ ] Crear la constante `Colors` en un archivo centralizadoizado (ej. `src/constants/theme.ts`).
- [ ] Reemplazar los colores azules antiguos (`#3498db`, `#2c3e50`) por `#0F16A6` y `#181E8C`.
- [ ] Reemplazar los verdes de confirmación (`#2ecc71`, `#27ae60`) por la acentuación `#F2E205`.
- [ ] Reemplazar los textos grises oscuros por `#0D0D0D`.
- [ ] Ajustar los bordes de campos e inputs usando `#BFA626`.
- [ ] Ejecutar `npx expo start` y verificar contraste de legibilidad.