# Especificación técnica: foto de perfil y habilidades blandas/duras para CV Creator

## 1. Objetivo

Ampliar la aplicación existente `cv-creator-app` con dos capacidades nuevas:

1. Permitir que el usuario añada una foto al currículum, seleccionándola desde la galería o tomándola con la cámara mediante **Expo ImagePicker**.
2. Incorporar una sección independiente para registrar y administrar **habilidades blandas** y **habilidades duras**.

La implementación debe integrarse con la arquitectura y el estilo existentes, preservar las funciones actuales y mantener los requisitos del trabajo anterior de **React Hook Form + Zod** para los formularios y los campos de fecha con DatePicker.

## 2. Contexto técnico que se debe respetar

Según el contexto proporcionado del proyecto:

- Aplicación React Native con Expo y TypeScript en modo estricto.
- Navegación con Expo Router; las pantallas se encuentran en `src/app/`.
- Estado compartido del currículum mediante `CVProvider` y `useCVContext`, en `src/context/CVContext.tsx`.
- Tipos centralizados en `src/types/cv.types.ts`.
- Pantalla de información personal: `src/app/personal-info.tsx`.
- Pantallas existentes de experiencia y educación: `src/app/experience.tsx` y `src/app/education.tsx`.
- Vista previa: `src/app/preview.tsx`, con presentación apoyada por `src/components/CVPreview.tsx`.
- El modelo actual contiene `personalInfo`, `experiences` y `education`; hay que ampliarlo sin romper sus consumidores.

El `package.json` del contexto indica Expo `~57.0.29` y React Native `0.86.3`. Antes de utilizar APIs de Expo, verificar la documentación correspondiente a la versión instalada y las APIs que realmente están disponibles. No actualizar Expo ni React Native como parte de esta tarea.

## 3. Dependencias

### 3.1 Expo ImagePicker

Instalar con el gestor de paquetes que ya utiliza el repositorio:

```bash
npx expo install expo-image-picker
```

Si el proyecto utiliza Bun, seguir las instrucciones de `AGENTS.md` y usar `bunx` para los comandos de Expo. No instalar una versión arbitraria con `npm install expo-image-picker`; `expo install` debe seleccionar la versión compatible con el SDK instalado.

Consultar la documentación correspondiente al SDK del proyecto y confirmar la API de `expo-image-picker`, permisos, opciones y comportamiento por plataforma antes de implementar.

### 3.2 Dependencias del trabajo anterior

Esta ampliación no debe retirar ni duplicar las dependencias que se incorporen para React Hook Form, Zod, `@hookform/resolvers` o DatePicker. Si el trabajo anterior todavía no está implementado, incluir ambos conjuntos de requisitos en la planificación y comprobar las dependencias reales antes de instalarlas.

## 4. Requisito A: foto de perfil

### 4.1 Ubicación y experiencia de usuario

- Añadir el control de foto en `src/app/personal-info.tsx`, dentro de la sección de información personal.
- Mostrar una vista previa de la imagen seleccionada y un estado vacío entendible cuando aún no haya foto.
- Ofrecer dos acciones claramente identificadas:
  - **Elegir de la galería**
  - **Tomar una foto**
- Si ya hay una foto, permitir reemplazarla y quitarla.
- Mostrar mensajes claros si el usuario cancela la selección, deniega permisos o si ocurre un error.
- Cancelar la selección no debe borrar una foto que ya se hubiera elegido.
- No solicitar permisos de cámara o galería al abrir la pantalla sin necesidad: solicitarlos en respuesta a la acción correspondiente y manejar la denegación correctamente.

### 4.2 Implementación con Expo ImagePicker

- Utilizar `expo-image-picker`; no implementar acceso directo a la cámara ni a la galería con APIs nativas propias.
- Usar las funciones documentadas de lanzamiento de cámara y biblioteca de imágenes para la versión instalada.
- Comprobar `canceled` antes de acceder a los recursos seleccionados.
- Tratar el URI de la imagen como potencialmente ausente y validar la respuesta antes de guardarla.
- Configurar las opciones apropiadas para una foto de perfil, por ejemplo, selección de imágenes, edición/recorte si la API y las plataformas lo permiten, y calidad razonable para limitar el uso de memoria.
- No solicitar acceso a vídeo si el requisito solo contempla fotografías.
- Configurar textos de permisos o el plugin en `app.json` únicamente según lo exija la versión instalada y la documentación oficial. No editar directorios nativos generados manualmente.
- Revisar el comportamiento en iOS, Android y web, dado que las APIs y los permisos pueden variar entre plataformas.

### 4.3 Estado y tipo de datos

- Ampliar `PersonalInfo` en `src/types/cv.types.ts` con un campo opcional o nullable para la imagen, por ejemplo `photoUri: string | null`, y usar la misma convención en todo el proyecto.
- Actualizar el valor inicial de `personalInfo` en `CVProvider`.
- Conservar el URI seleccionado en el estado compartido (`CVContext`) para que la imagen siga visible al navegar a otras pantallas.
- Añadir o adaptar una operación de contexto tipada para actualizar la foto sin sobrescribir accidentalmente los demás campos personales. Si se usa `updatePersonalInfo`, fusionar de forma segura los datos previos y los nuevos.
- No guardar el objeto completo devuelto por ImagePicker en el estado del currículum: persistir solo los campos necesarios, principalmente el URI.
- Al quitar la foto, establecer explícitamente el valor en `null` (o la convención elegida), no en una cadena como `"null"`.

### 4.4 Presentación de la foto en el CV

- Actualizar `src/components/CVPreview.tsx` para mostrar la imagen cuando exista.
- Si no hay foto, no renderizar una imagen rota ni un espacio vacío innecesario.
- Mantener una presentación proporcionada, sin deformar la imagen; aplicar recorte y bordes coherentes con el diseño existente.
- Comprobar que el nombre, los datos de contacto, el resumen, la experiencia y la educación sigan apareciendo correctamente.

### 4.5 Límite importante: URI local frente a carga remota

Este requisito pide elegir o tomar una foto con Expo ImagePicker, pero no especifica un backend ni un servicio de almacenamiento de imágenes.

- Para esta tarea, conservar el URI proporcionado por ImagePicker y usarlo para la vista previa dentro del flujo actual.
- **No afirmar que la foto se sube a un servidor** ni añadir servicios externos, credenciales o almacenamiento remoto sin una especificación adicional.
- Un URI local puede dejar de ser válido después de reiniciar la aplicación, reinstalarla o cambiar de dispositivo. Si el cliente requiere persistencia duradera, sincronización o exportación del CV con foto, documentarlo como requisito separado y definir el almacenamiento adecuado antes de implementarlo.
- No convertir la imagen a Base64 por defecto ni guardarla en el estado global como una cadena enorme.

## 5. Requisito B: sección de habilidades

### 5.1 Nueva pantalla y navegación

- Crear una pantalla de Expo Router, por ejemplo `src/app/skills.tsx`.
- Añadir la pantalla a `src/app/_layout.tsx` con un título claro, por ejemplo **Habilidades**.
- Añadir una opción o botón para llegar a la sección desde la pantalla principal (`src/app/index.tsx`), siguiendo el patrón de navegación existente.
- Mantener disponibles las rutas y acciones actuales de información personal, experiencia, educación y vista previa.
- No crear archivos de rutas dentro de carpetas distintas a las convenciones actuales.

### 5.2 Categorías

La sección debe permitir registrar habilidades en dos grupos separados:

1. **Habilidades blandas**: por ejemplo, comunicación, liderazgo, trabajo en equipo, adaptabilidad y resolución de problemas.
2. **Habilidades duras**: por ejemplo, Excel, SQL, React, análisis de datos o gestión de proyectos.

Los ejemplos son ilustrativos, no una lista fija. El usuario debe poder ingresar habilidades propias.

### 5.3 Operaciones necesarias

- Agregar una habilidad a la categoría seleccionada.
- Mostrar las habilidades existentes agrupadas por categoría.
- Eliminar una habilidad individual.
- Evitar habilidades vacías y, como mínimo, normalizar espacios al principio/final.
- Evitar duplicados dentro de la misma categoría comparando sin distinguir mayúsculas/minúsculas y espacios periféricos.
- Limpiar el campo de entrada tras agregar correctamente.
- Mostrar un estado vacío útil cuando una categoría todavía no tenga habilidades.
- Mantener los datos al cambiar de pantalla durante la sesión, usando `CVContext`, no solo estado local de la pantalla.
- Presentar errores y confirmaciones de forma consistente con el resto de la aplicación.

No se requiere editar habilidades existentes si la interfaz puede cumplir el alcance con agregar y eliminar. Si se implementa edición, debe funcionar para ambas categorías y conservar las reglas de validación.

### 5.4 Modelo de datos

- Ampliar `CVData` en `src/types/cv.types.ts` con dos listas separadas, por ejemplo:
  - `softSkills: string[]`
  - `hardSkills: string[]`
- Inicializar ambas listas en `CVProvider` como arreglos vacíos.
- Ampliar la interfaz `CVContextType` con operaciones tipadas para agregar y eliminar una habilidad por categoría. Elegir una API consistente, por ejemplo `addSkill(type, skill)` y `deleteSkill(type, skill)`, o funciones separadas; no mezclar convenciones.
- Al actualizar el estado, usar actualizaciones funcionales (`setCVData(prev => ...)`) para no perder habilidades previas.
- Si se usa un identificador para cada habilidad en lugar de guardar cadenas, actualizar los tipos y la lógica de duplicados de forma consistente. No añadir IDs si no son necesarios para la solución elegida.
- Revisar todos los lugares donde se construye un `CVData` para que incluyan los nuevos campos.

### 5.5 Validación del formulario

Como parte de la especificación anterior, los formularios deben utilizar React Hook Form + Zod.

- Implementar el formulario de habilidades con `useForm` y `zodResolver`.
- Definir un esquema Zod para el texto de entrada y cualquier categoría elegible.
- Validar que el nombre de la habilidad no quede vacío tras aplicar `trim()`.
- Si la categoría se selecciona mediante un control, restringir el valor a las dos categorías válidas.
- Mostrar mensajes de validación en español.
- No agregar una habilidad a `CVContext` hasta que la validación haya pasado.
- No mantener en paralelo dos estados de formulario para los mismos campos. La lista persistida vive en el contexto; el campo y la categoría actuales pertenecen a React Hook Form.

## 6. Integración en la vista previa

Actualizar `src/components/CVPreview.tsx` y cualquier tipo o pantalla que lo alimente para mostrar:

- Foto de perfil, solo si existe.
- Habilidades blandas en una sección titulada **Habilidades blandas**.
- Habilidades duras en una sección titulada **Habilidades duras**.

Criterios de presentación:

- Omitir las secciones de habilidades vacías o mostrar un estado apropiado sin dejar huecos visuales grandes.
- Mantener la separación entre ambas categorías.
- Evitar duplicar habilidades en la vista previa.
- Respetar el estilo visual y los componentes ya existentes.
- Verificar que los datos se actualicen inmediatamente al agregar o eliminar una habilidad.
- No eliminar ni alterar el formato existente de experiencia y educación.
- Si existe más de una representación o plantilla de CV, identificar y actualizar todas las que correspondan sin reescribir innecesariamente el sistema de presentación.

## 7. Compatibilidad con el plan anterior de DatePicker + React Hook Form + Zod

Esta especificación es una ampliación del plan previo `PLAN_DatePicker_ReactHookForm_Zod.md`; no lo sustituye.

- Implementar el selector de fecha en los campos de fecha que se hayan identificado en el plan anterior.
- Mantener React Hook Form + Zod en los formularios de información personal, experiencia y educación, además del formulario de habilidades.
- En el formulario de información personal, conectar la selección y eliminación de foto al modelo de datos sin hacer que el URI sea un campo de texto editable.
- La foto debe poder cambiarse y quitarse sin borrar el resto de la información personal.
- Mantener las reglas y los tipos de fecha existentes en el plan anterior; no cambiar silenciosamente formatos ni contratos de datos.
- Si se decide validar la foto con Zod, hacerlo de acuerdo con el tipo de dato elegido y sin intentar validar el archivo como una cadena de texto introducida por el usuario.

## 8. Archivos que probablemente deberán modificarse o crearse

La lista es orientativa: confirmar el contenido real de cada archivo antes de editar.

| Archivo | Cambio esperado |
|---|---|
| `package.json` / archivo de lock | Añadir la dependencia compatible `expo-image-picker` mediante `expo install`. |
| `app.json` | Ajustar configuración de permisos/plugin solo si la versión de Expo lo requiere. |
| `src/types/cv.types.ts` | Añadir `photoUri` y los campos de habilidades a los tipos correspondientes. |
| `src/context/CVContext.tsx` | Inicializar y actualizar foto y habilidades en el estado global. |
| `src/app/personal-info.tsx` | Integrar selección de cámara/galería, vista previa, reemplazo y eliminación de foto. |
| `src/app/skills.tsx` | Crear la nueva pantalla de habilidades con React Hook Form + Zod. |
| `src/app/_layout.tsx` | Registrar la ruta de habilidades. |
| `src/app/index.tsx` | Añadir navegación a la sección de habilidades siguiendo el diseño actual. |
| `src/components/CVPreview.tsx` | Mostrar la foto y las dos categorías de habilidades. |
| Esquemas bajo `src/schemas/` (si se usa esta organización) | Añadir o adaptar el esquema Zod de habilidades y mantener los esquemas del plan anterior. |
| Componentes compartidos bajo `src/components/` | Crear un selector de foto o controles de habilidad reutilizables solo si reducen duplicación real. |

No es obligatorio crear todos los archivos sugeridos. Reutilizar componentes existentes cuando sea apropiado y mantener la lógica fuera de las rutas cuando así lo indique la arquitectura.

## 9. Criterios de aceptación

### Foto

- [ ] El usuario puede abrir la galería y seleccionar una imagen.
- [ ] El usuario puede abrir la cámara y tomar una foto en plataformas compatibles.
- [ ] Los permisos se solicitan cuando corresponde y la denegación se maneja sin cerrar la aplicación.
- [ ] Cancelar el selector no borra una foto previamente seleccionada.
- [ ] La foto seleccionada se ve en la pantalla de información personal.
- [ ] El usuario puede reemplazar y eliminar la foto.
- [ ] La foto se conserva al navegar entre pantallas durante la sesión.
- [ ] La vista previa del CV muestra la foto cuando existe y no muestra una imagen rota cuando no existe.
- [ ] No se afirma ni se implementa una carga remota que el cliente no haya solicitado.

### Habilidades

- [ ] Existe una sección de habilidades accesible desde la navegación de la aplicación.
- [ ] El usuario puede agregar habilidades blandas y duras por separado.
- [ ] Se rechazan entradas vacías y se normalizan espacios periféricos.
- [ ] Se evitan duplicados dentro de cada categoría.
- [ ] Se puede eliminar cada habilidad individualmente.
- [ ] Las listas sobreviven a la navegación durante la sesión gracias al contexto.
- [ ] Los errores de formulario se validan con Zod y se muestran en español.
- [ ] La vista previa muestra las dos categorías cuando tienen contenido.
- [ ] Las listas vacías no rompen el diseño ni la vista previa.

### Regresión y calidad

- [ ] La información personal existente sigue guardándose correctamente.
- [ ] Agregar y eliminar experiencias y educación sigue funcionando.
- [ ] Los DatePicker del plan anterior siguen funcionando y las fechas mantienen su valor.
- [ ] La navegación y la vista previa siguen funcionando.
- [ ] No se añaden dependencias incompatibles con el SDK instalado.
- [ ] No se usan `any` ni aserciones inseguras para ocultar errores de tipos.
- [ ] No se editan manualmente directorios nativos generados por Expo.
- [ ] Se ejecutan las comprobaciones de calidad indicadas a continuación y se corrigen los errores encontrados.

## 10. Pruebas obligatorias

Ejecutar desde la raíz del proyecto:

```bash
npx expo lint
npx tsc --noEmit
npx expo-doctor
```

Si el proyecto utiliza Bun, adaptar los comandos de acuerdo con `AGENTS.md`. No afirmar que una comprobación pasó si no se ejecutó.

Pruebas manuales mínimas:

1. Seleccionar una imagen desde la galería.
2. Tomar una foto con la cámara en un dispositivo/plataforma compatible.
3. Cancelar cada selector y verificar que no se pierda una foto ya seleccionada.
4. Denegar permisos y confirmar que se presenta un mensaje claro y la app sigue funcionando.
5. Reemplazar y eliminar la foto.
6. Navegar a otras pantallas y volver a información personal.
7. Agregar varias habilidades blandas y duras.
8. Intentar agregar una habilidad vacía y un duplicado con distinta capitalización.
9. Eliminar habilidades de ambas categorías.
10. Abrir la vista previa y comprobar foto, habilidades, experiencia y educación.
11. Probar en las plataformas objetivo (iOS, Android y web, si la aplicación las soporta) y registrar cualquier diferencia de comportamiento.

## 11. Restricciones para evitar regresiones

- No reescribir la aplicación ni cambiar su arquitectura de navegación.
- No sustituir `CVContext` por un segundo estado global.
- No guardar foto y habilidades solo en el estado local de una pantalla.
- No borrar ni renombrar propiedades existentes sin actualizar todos sus consumidores.
- No asumir que un URI local equivale a una carga o persistencia remota.
- No incluir Base64 de la imagen en el modelo del CV por defecto.
- No hardcodear un catálogo cerrado de habilidades.
- No mezclar habilidades blandas y duras en una única lista sin conservar su categoría.
- No quitar React Hook Form + Zod ni los DatePicker del alcance acordado previamente.
- No modificar el contrato de fechas sin una decisión explícita y consistente entre formulario, esquema, tipos y vista previa.
- Si un detalle de almacenamiento duradero, exportación con imagen o sincronización entre dispositivos no está especificado, dejarlo documentado como decisión pendiente en lugar de inventar una solución.

## 12. Resultado esperado

La tarea se considera terminada cuando la aplicación permite seleccionar, mostrar, reemplazar y quitar una foto; administrar habilidades blandas y duras por separado; conservar ambos datos en el estado compartido durante el flujo de creación del CV; reflejarlos correctamente en la vista previa; mantener los requisitos anteriores de DatePicker y React Hook Form + Zod; y superar las comprobaciones de lint, TypeScript y Expo Doctor sin errores pendientes.
