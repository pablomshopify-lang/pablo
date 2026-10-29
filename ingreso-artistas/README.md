# Ingreso de artistas · Holding MVCK

Sistema interno de ingreso de artistas, **separado por empresa**. Cada
empresa del Holding tiene su propio formulario, con sus preguntas, sus
colores y su lista de tareas internas:

| Empresa          | Link de ingreso     |
| ---------------- | ------------------- |
| Mvck Music       | `/mvck-music`       |
| MVCK Publishing  | `/mvck-publishing`  |
| Maverick Records | `/maverick-records` |
| Maverick Live    | `/maverick-live`    |

El artista entra por el link de la empresa con la que trabaja. Al enviar,
se crea su ficha y las tareas de esa empresa con responsable y fecha. Si
marca interés en otra empresa, se agrega una tarea para derivarlo.

- `/` → índice interno con los links de cada empresa.
- `/procedimientos` → página interna con los pasos de cada empresa y quién los hace.

## Dónde se cambia cada cosa

| Quiero cambiar…                                     | Archivo                      |
| --------------------------------------------------- | ---------------------------- |
| Pasos, responsables, plazos o preguntas por empresa | `lib/empresas.ts`            |
| Personas del organigrama                            | `lib/empresas.ts` (`EQUIPO`) |
| Datos y redes que se piden                          | `lib/campos.ts`              |
| Colores generales                                   | `app/globals.css`            |

## Personalizar plazos y regalías (desde la hoja de Google)

- **Plazos:** la pestaña «Plazos» lista cada tarea por empresa con sus días.
  Cambia el número y los próximos ingresos usan ese plazo. La fecha «Vence»
  de cualquier tarea ya creada también se puede editar a mano.
- **Regalías:** en «Configuración» está cada cuántos meses se liquidan
  (por defecto 3). En la ficha de cada artista, la columna «Liquidación de
  regalías» se puede cambiar según su contrato.
- Los valores base están en `lib/empresas.ts` (`dias` y `REGALIAS_MESES`).

## Conectar Google Sheets (una sola vez, 5 minutos)

Mientras no lo conectes, cada inscripción llega igual por correo (Formspree).

1. Crea una hoja nueva en Google Sheets, por ejemplo «Ingreso de artistas».
2. Menú **Extensiones → Apps Script**. Borra lo que aparece y pega el contenido de `google/apps-script.gs`.
3. En la línea `CORREO_EQUIPO` pon el correo que debe recibir los avisos. Guarda (ícono de disquete).
4. Arriba elige la función `probar` y pulsa **Ejecutar**. Acepta los permisos. Deberías ver las pestañas «Mvck Music · Artistas» y «Mvck Music · Tareas» con una fila de prueba (puedes borrarla).
5. **Implementar → Nueva implementación → tipo: Aplicación web**. «Ejecutar como: Yo», «Quién tiene acceso: Cualquier usuario». Pulsa **Implementar** y copia la URL que termina en `/exec`.
6. En Vercel, abre el proyecto → **Settings → Environment Variables** → agrega `GOOGLE_SCRIPT_URL` con esa URL → **Save** y luego **Redeploy**.

## Publicar en Vercel

**Add New → Project** → importa el repositorio `pablo` → en **Root Directory** elige `ingreso-artistas` → **Deploy**.

## Desarrollo

```bash
npm install
npm run dev
```
