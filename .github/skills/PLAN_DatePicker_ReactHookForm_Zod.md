# Plan de implementación: DatePicker + React Hook Form + Zod

## 1. Contexto del proyecto

La aplicación `cv-creator-app` es una aplicación móvil construida con Expo, React Native y TypeScript. Usa Expo Router para la navegación y un `CVContext` para conservar los datos del currículum mientras se utiliza la aplicación.

Las pantallas con formularios identificadas en el contexto proporcionado son:

- `src/app/personal-info.tsx`: información personal.
- `src/app/experience.tsx`: experiencia laboral.
- `src/app/education.tsx`: educación.

Los componentes reutilizables existentes son `src/components/InputField.tsx` y `src/components/NavigationButton.tsx`. Los tipos del currículum están en `src/types/cv.types.ts`, y los datos se administran mediante `src/context/CVContext.tsx`.

El proyecto tiene TypeScript estricto habilitado y utiliza Expo Router. Mantén la estructura, navegación, estilos y contexto actuales, salvo los cambios necesarios para implementar estos requisitos.

## 2. Objetivos

1. Reemplazar los campos de texto usados para fechas por selectores de fecha (`DatePicker`) adecuados para React Native y Expo.
2. Integrar **React Hook Form**, **Zod** y `@hookform/resolvers` en **cada formulario** de la aplicación.
3. Mostrar errores de validación junto al campo correspondiente, en español.
4. Conservar las operaciones actuales de guardado, agregado, eliminación y navegación.
5. Mantener la compatibilidad con iOS, Android y web, verificando el comportamiento real de cada plataforma.
6. Evitar cambios innecesarios en la estructura de datos del CV y en la vista previa.

## 3. Dependencias

Antes de instalar paquetes, revisa la versión de Expo declarada en `package.json` y consulta la documentación correspondiente a esa versión, tal como indica `AGENTS.md`. No actualices Expo ni React Native como parte de esta tarea.

Instala el selector de fecha con el instalador de Expo para resolver una versión compatible con el SDK del proyecto:

```bash
npx expo install @react-native-community/datetimepicker
```

Instala las dependencias de formularios y validación:

```bash
npm install react-hook-form zod @hookform/resolvers
```

Si el repositorio utiliza Bun (por ejemplo, si contiene `bun.lock`), utiliza `bunx` en lugar de `npx` para los comandos de Expo, de acuerdo con las instrucciones del proyecto. Conserva el gestor de paquetes y el archivo de lock existentes; no mezcles gestores.

> No uses un `DatePicker` web como `<input type="date">` directamente dentro de componentes React Native. Implementa una solución basada en `@react-native-community/datetimepicker` y comprueba por separado el comportamiento de web con la versión instalada. Si la versión elegida no ofrece soporte web adecuado, crea una abstracción de componente con una implementación web compatible, sin romper iOS ni Android.

## 4. Formularios que deben migrarse

### 4.1 Información personal — `src/app/personal-info.tsx`

Usa `useForm` de React Hook Form con un esquema Zod para los campos actuales:

- `fullName` (obligatorio).
- `email` (obligatorio y con formato válido).
- `phone` (opcional).
- `location` (opcional).
- `summary` (opcional).

Requisitos:

- Inicializa los valores con `cvData.personalInfo`, igual que hace actualmente el formulario.
- Cuando `cvData.personalInfo` cambie, sincroniza los valores del formulario con `reset(...)`; evita mantener un estado duplicado con `useState` para cada campo.
- Al enviar, usa `handleSubmit` y llama a `updatePersonalInfo` solo si Zod valida los datos.
- Conserva la alerta de éxito y la navegación de regreso actuales.
- Muestra los errores de validación bajo cada campo.
- Configura el campo de correo para teclado de email y sin capitalización automática.
- No añadas un campo de fecha personal (por ejemplo, fecha de nacimiento), ya que no existe en el modelo proporcionado ni se ha solicitado explícitamente.

### 4.2 Experiencia laboral — `src/app/experience.tsx`

Usa React Hook Form y un esquema Zod para:

- `company` (obligatorio).
- `position` (obligatorio).
- `startDate` (obligatorio).
- `endDate` (opcional si la experiencia sigue vigente).
- `description` (opcional).

Requisitos:

- Sustituye los campos de texto de `startDate` y `endDate` por controles de selección de fecha.
- Guarda las fechas en un formato estable y consistente: **`YYYY-MM-DD`** como cadena en el modelo y el contexto. No guardes objetos `Date` directamente en `CVContext`.
- Para mostrar una fecha al usuario, conviértela a un formato legible localmente; no cambies el formato almacenado solo para mostrarla.
- Permite dejar `endDate` vacío para representar una experiencia actual. En la lista y en la vista previa, sigue mostrando `Actual` cuando `endDate` esté vacío.
- Valida que la fecha de fin no sea anterior a la fecha de inicio, solo cuando ambas fechas estén presentes.
- Tras guardar correctamente, conserva la llamada a `addExperience`, la generación del `id`, la alerta de éxito y el reinicio de los campos.
- Conserva el flujo de confirmación para eliminar experiencias.

### 4.3 Educación — `src/app/education.tsx`

Usa React Hook Form y un esquema Zod para:

- `institution` (obligatorio).
- `degree` (obligatorio).
- `field` (opcional).
- `graduationYear` (actualmente opcional).

Requisito de fecha:

- Reemplaza el campo `graduationYear` de texto por un selector de fecha si el objetivo es elegir la fecha de graduación completa.
- Si la interfaz solo debe registrar el año de graduación, no fuerces al usuario a escoger día y mes: usa el selector/configuración que corresponda o define un control de año específico. Documenta la decisión y mantén coherencia entre interfaz, validación y datos guardados.
- Antes de cambiar el tipo del dato, revisa `CVPreview.tsx`, `src/types/cv.types.ts` y cualquier otro lugar que consuma `graduationYear`.
- Para minimizar cambios incompatibles, conserva `graduationYear` como cadena en el modelo. Si se adopta una fecha completa, almacena `YYYY-MM-DD`; si se conserva solo el año, almacena `YYYY`.
- Conserva `addEducation`, el reinicio del formulario, las alertas y el flujo de eliminación.

## 5. Componente reutilizable de fecha

Crea un componente reutilizable, por ejemplo:

`src/components/DatePickerField.tsx`

Debe:

- Aceptar al menos `label`, `value`, `onChange`, `error`, `placeholder`, `minimumDate`, `maximumDate` y, si hace falta, una opción para representar un campo opcional.
- Integrarse con React Hook Form mediante `Controller`; no debe depender de un estado de formulario paralelo.
- Mostrar la fecha seleccionada de forma legible y permitir abrir el selector desde un control accesible.
- Mostrar el mensaje de error de Zod con el mismo patrón visual que `InputField`.
- Permitir limpiar `endDate` cuando corresponda, para que una experiencia pueda seguir vigente.
- Manejar correctamente el valor vacío y la conversión entre cadena `YYYY-MM-DD` y `Date`.
- Evitar errores por zonas horarias: al convertir fechas de calendario, procesa año, mes y día de forma explícita; no confíes en `new Date("YYYY-MM-DD")` para preservar el día en todas las zonas horarias.
- No permitir fechas de fin anteriores a la fecha de inicio. Configura límites en la interfaz cuando sea viable y conserva la validación en Zod como garantía.
- Mantener accesibilidad, etiquetas y estilos consistentes con la aplicación.

No dupliques la lógica de selector de fecha en `experience.tsx` y `education.tsx`.

## 6. Esquemas Zod y tipos

Organiza los esquemas en un lugar reutilizable, por ejemplo:

- `src/schemas/personalInfo.schema.ts`
- `src/schemas/experience.schema.ts`
- `src/schemas/education.schema.ts`

Puedes agruparlos en menos archivos si el proyecto ya sigue otra convención, pero evita definir esquemas distintos e inconsistentes para la misma entidad.

Requisitos de validación:

- Usa `z.string().trim().min(...)` para los campos de texto obligatorios.
- Valida `email` con Zod y presenta un mensaje claro en español.
- Trata las cadenas vacías de los campos opcionales de forma deliberada. Si se guardan como `""`, normalízalas consistentemente; no las conviertas accidentalmente en `undefined` si los tipos existentes requieren cadenas.
- Valida las fechas con un formato acordado y comprueba que sean fechas de calendario válidas, no solo cadenas que coincidan superficialmente con una expresión regular.
- En experiencia, comprueba `endDate >= startDate` cuando ambas fechas existan.
- Mantén las validaciones tanto en la interfaz como en el esquema: las restricciones visuales mejoran la experiencia, pero Zod debe seguir siendo la fuente de verdad al enviar.

Define los tipos del formulario a partir de los esquemas mediante `z.infer<typeof schema>` cuando sea apropiado. Si los tipos del contexto y los tipos del formulario difieren, realiza una conversión explícita en el límite entre formulario y contexto, sin debilitar los tipos existentes.

## 7. Integración de React Hook Form

Cada pantalla con formulario debe utilizar el patrón equivalente a:

```tsx
const {
  control,
  handleSubmit,
  reset,
  formState: { errors, isSubmitting },
} = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: initialValues,
});
```

Adapta el ejemplo a los tipos y necesidades reales de cada pantalla. No copies literalmente una configuración que no coincida con el esquema.

Para cada campo:

- Usa `Controller` cuando se conecte a un componente controlado, especialmente el selector de fecha.
- Para `InputField`, puedes usar `Controller` o `register` solo si la integración con React Native está implementada correctamente. No uses `register` como si fuera un formulario HTML sin adaptar `TextInput`.
- Pasa el valor y la función de cambio de React Hook Form al componente.
- Muestra `errors.nombreDelCampo?.message`.
- Envía con `handleSubmit(onValidSubmit)`, no con una función que guarde datos sin validar.
- Deshabilita el botón de envío durante el envío si corresponde y evita dobles envíos.
- Usa `reset(...)` para limpiar el formulario tras un agregado exitoso y para sincronizar información personal existente.

No mantengas simultáneamente `formData` con `useState` y los mismos valores en React Hook Form: esto crea dos fuentes de verdad y puede causar valores obsoletos.

## 8. Tipos y persistencia de fechas

El archivo `src/types/cv.types.ts` define actualmente `startDate`, `endDate` y `graduationYear` como cadenas. Conserva ese contrato mientras no exista una necesidad confirmada de cambiarlo.

Formato recomendado para fechas completas:

- Almacenamiento: `YYYY-MM-DD`.
- Valor interno del selector: `Date` solo mientras el usuario interactúa con el control.
- Presentación: fecha legible para el usuario.
- Campo opcional sin fecha: `""`, manteniendo el contrato actual de cadenas.

No conviertas todas las fechas a objetos `Date` dentro de `CVContext`. No cambies la estructura de `CVData` ni las funciones `addExperience`, `updateExperience`, `addEducation` o `updateEducation` sin una razón concreta y documentada.

## 9. Componentes y archivos que pueden requerir cambios

- `src/app/personal-info.tsx`
- `src/app/experience.tsx`
- `src/app/education.tsx`
- `src/components/InputField.tsx` (solo si hace falta mejorar la presentación de errores o la accesibilidad)
- `src/components/DatePickerField.tsx` (nuevo)
- `src/schemas/personalInfo.schema.ts` (nuevo)
- `src/schemas/experience.schema.ts` (nuevo)
- `src/schemas/education.schema.ts` (nuevo)
- `src/types/cv.types.ts` (solo si es necesario ajustar tipos, preservando compatibilidad)
- `src/components/CVPreview.tsx` (si cambia el formato visible de las fechas)

No modifiques `src/app/preview.tsx`, `src/context/CVContext.tsx` ni la navegación salvo que una incompatibilidad real lo requiera.

## 10. Criterios de aceptación

### DatePicker

- [ ] Las fechas de inicio y fin de experiencia ya no se escriben manualmente.
- [ ] La fecha de fin puede quedar vacía y la interfaz sigue mostrando `Actual`.
- [ ] La fecha de fin no puede ser anterior a la fecha de inicio.
- [ ] La educación permite seleccionar la fecha o el año de graduación según la decisión documentada.
- [ ] Las fechas se guardan en el formato acordado y la vista previa las presenta correctamente.
- [ ] No aparecen desplazamientos de un día por conversiones de zona horaria.
- [ ] El selector funciona en las plataformas que el proyecto declara soportar.

### React Hook Form + Zod

- [ ] Los tres formularios (`personal-info`, `experience` y `education`) usan `useForm` y `zodResolver`.
- [ ] Los campos obligatorios muestran mensajes de error en español.
- [ ] El correo electrónico se valida correctamente.
- [ ] No se guardan datos inválidos en `CVContext`.
- [ ] Los campos opcionales aceptan valores vacíos de manera consistente.
- [ ] El formulario de información personal se sincroniza con los datos existentes usando `reset`.
- [ ] Los formularios de experiencia y educación se limpian después de agregar un registro válido.
- [ ] Las operaciones de agregar y eliminar continúan funcionando.
- [ ] TypeScript no requiere `any` ni aserciones inseguras para hacer funcionar la integración.

## 11. Verificación obligatoria

Después de implementar:

1. Instala las dependencias con el gestor de paquetes ya usado por el proyecto.
2. Ejecuta `npx expo lint`.
3. Ejecuta `npx tsc --noEmit`.
4. Ejecuta `npx expo-doctor`.
5. Prueba manualmente los tres formularios en las plataformas disponibles.

Casos mínimos de prueba:

- Enviar cada formulario vacío.
- Enviar un correo inválido.
- Agregar una experiencia con fecha de inicio y sin fecha de fin.
- Intentar seleccionar una fecha de fin anterior a la de inicio.
- Agregar experiencia y educación válidas y comprobar que aparezcan en la lista y en la vista previa.
- Verificar que los campos se limpien después de agregar.
- Editar/sincronizar la información personal existente y confirmar que los valores se reflejen correctamente.
- Comprobar que la fecha seleccionada se mantenga igual al guardarla, volver a mostrarla y visualizarla en la vista previa.
- Confirmar el comportamiento de los selectores en iOS, Android y web, según las plataformas habilitadas.

Corrige los errores de lint, tipos y compatibilidad antes de dar la tarea por terminada. No declares que las pruebas pasaron si no se ejecutaron.

## 12. Restricciones importantes

- No reescribas la aplicación ni cambies su navegación.
- No elimines funcionalidades actuales de guardado, agregado, eliminación, alertas o vista previa.
- No agregues campos que no existen en el contexto proporcionado sin una solicitud explícita.
- No cambies el modelo de fechas de forma silenciosa.
- No dupliques el estado del formulario.
- No omitas la validación Zod aunque el selector de fecha tenga límites visuales.
- No actualices Expo o React Native como parte de esta tarea.
- Si una decisión de UX no puede inferirse del código —en particular, si educación necesita una fecha completa o solo el año—, documenta la decisión antes de implementarla y mantén coherencia entre el campo, su esquema, el tipo y la vista previa.
