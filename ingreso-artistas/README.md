# Ingreso de artistas · Holding MVCK

Formulario web donde un artista deja sus datos, sus redes y elige los
servicios del Holding (Mvck Music, MVCK Publishing, Maverick Records,
Maverick Live). Al enviarlo se crea su ficha y la lista de tareas internas
de cada servicio, con responsable y fecha.

- `/` → formulario para el artista (4 pasos).
- `/procedimientos` → página interna con los pasos de cada servicio y quién los hace.

## Dónde se cambia cada cosa

| Quiero cambiar…                                      | Archivo                       |
| ---------------------------------------------------- | ----------------------------- |
| Pasos, responsables, plazos o preguntas por servicio | `lib/servicios.ts`            |
| Personas del organigrama                             | `lib/servicios.ts` (`EQUIPO`) |
| Datos y redes que se piden                           | `lib/campos.ts`               |
| Colores                                              | `app/globals.css`             |

## Conectar Google Sheets (una sola vez, 5 minutos)

Mientras no lo conectes, cada inscripción llega igual por correo (Formspree).

1. Crea una hoja nueva en Google Sheets, por ejemplo «Ingreso de artistas».
2. Menú **Extensiones → Apps Script**. Borra lo que aparece y pega el contenido de `google/apps-script.gs`.
3. En la línea `CORREO_EQUIPO` pon el correo que debe recibir los avisos. Guarda (ícono de disquete).
4. Arriba elige la función `probar` y pulsa **Ejecutar**. Acepta los permisos. Deberías ver las hojas «Artistas» y «Tareas» con una fila de prueba (puedes borrarla).
5. **Implementar → Nueva implementación → tipo: Aplicación web**. «Ejecutar como: Yo», «Quién tiene acceso: Cualquier usuario». Pulsa **Implementar** y copia la URL que termina en `/exec`.
6. En Vercel, abre el proyecto → **Settings → Environment Variables** → agrega `GOOGLE_SCRIPT_URL` con esa URL → **Save** y luego **Redeploy**.

## Publicar en Vercel

**Add New → Project** → importa el repositorio `pablo` → en **Root Directory** elige `ingreso-artistas` → **Deploy**.

## Desarrollo

```bash
npm install
npm run dev
```
