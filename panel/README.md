# Panel central · Maverick Music Entertainment

Panel interno con **una sola base** de artistas, contratos y tareas de Mvck
Music, MVCK Publishing, Maverick Records y Maverick Live. Cada persona del
equipo entra con su propio correo y clave.

- **Inicio:** mis tareas, tareas vencidas, artistas por empresa, contratos por firmar.
- **Artistas:** buscador y ficha de cada artista (datos, redes, empresas, tareas, contratos y notas). Un artista puede estar en varias empresas.
- **Tareas:** cuando un artista entra a una empresa se crean solas las tareas de su procedimiento, con responsable y fecha.
- **Contratos:** solo el CEO puede marcar un contrato como «Firmado» (la base de datos lo exige). Muestra la próxima liquidación de regalías.
- **Plazos:** los pasos y días de cada empresa (el manual de procedimientos). Se cambian aquí sin tocar código.
- **Formularios:** los links de ingreso de cada empresa para mandar a los artistas.
- **Equipo:** crear usuarios, cambiar área o rol, quitar acceso, dar clave nueva.

## Roles

| Rol    | Quién            | Puede                                                         |
| ------ | ---------------- | ------------------------------------------------------------- |
| Admin  | Pablo (PM)       | Todo, menos firmar contratos. Maneja equipo y plazos.         |
| CEO    | Sebastián Biggio | Todo, y es el único que marca contratos como firmados.        |
| Equipo | Fran, Kim, Javi  | Ver todo, crear artistas, trabajar tareas, contratos y notas. |

## Puesta en marcha (una sola vez, ~15 minutos)

Base de datos y usuarios: **Supabase** (plan gratis: 500 MB y 50.000 usuarios).

### 1. Crear la base en Supabase

1. Entra a <https://supabase.com> → **Start your project** → entra con GitHub.
2. **New project**: nombre `panel-mvck`, inventa una clave de base de datos (guárdala), región **South America (São Paulo)** → **Create new project**. Espera 2 minutos.
3. Menú izquierdo → **SQL Editor** → **New query**. Pega todo el archivo `supabase/schema.sql` y pulsa **Run**. Debe decir «Success».
4. Menú → **Authentication → Sign In / Providers**: apaga **Allow new users to sign up** (así nadie de afuera puede crearse una cuenta).
5. Menú → **Authentication → Users → Add user → Create new user**: tu correo y una clave, marca **Auto Confirm User**. Este primer usuario queda como **Admin**.

### 2. Publicar el panel en Vercel

1. Vercel → **Add New → Project** → importa el repositorio `pablo` → **Root Directory**: `panel`.
2. Antes de **Deploy**, abre **Environment Variables** y agrega (están en Supabase → **Project Settings → API Keys** y **Data API**):
   - `NEXT_PUBLIC_SUPABASE_URL` → la «Project URL»
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → la clave `anon` / «publishable»
   - `SUPABASE_SERVICE_ROLE_KEY` → la clave `service_role` / «secret» (no la compartas)
   - `PANEL_CLAVE_INGRESO` → una clave que inventes (ej: 20 letras y números)
3. **Deploy**. Entra con tu correo y clave.

### 3. Sumar al equipo

En el panel → **Equipo → Sumar a una persona**: nombre, correo, área, rol y una
clave temporal. Mándale el link y la clave por WhatsApp; la cambia en «Mi
cuenta» (clic en su nombre arriba a la derecha).

| Persona          | Área                | Rol    |
| ---------------- | ------------------- | ------ |
| Sebastián Biggio | Dirección           | CEO    |
| Fran             | Creativo            | Equipo |
| Kim Mujica       | Prensa              | Equipo |
| Javiera Moreno   | Relaciones Públicas | Equipo |

### 4. Formularios de ingreso de artistas

Ya vienen dentro del panel, no hay que publicar nada más. En el menú
**Formularios** están los links de cada empresa para mandar al artista:

- `/ingreso/mvck-music`
- `/ingreso/mvck-publishing`
- `/ingreso/maverick-records`
- `/ingreso/maverick-live`

El artista no necesita usuario. Lo que envía aparece solo en **Artistas**, con
las tareas de esa empresa. Si el artista ya existe (mismo correo), se usa su
misma ficha y solo se suma la empresa nueva con sus tareas.

(Opcional) `/api/ingreso?clave=<PANEL_CLAVE_INGRESO>` recibe fichas desde
otro sistema.

## Dónde se cambia cada cosa

| Quiero cambiar…                          | Dónde                                  |
| ---------------------------------------- | -------------------------------------- |
| Pasos, días o área de cada procedimiento | Panel → **Plazos**                     |
| Frecuencia de regalías por defecto       | Panel → **Plazos** → Regalías          |
| Regalías de un artista o contrato        | Ficha del artista (datos o contrato)   |
| Personas, áreas y roles                  | Panel → **Equipo**                     |
| Preguntas y textos de los formularios    | `lib/formularios.ts`                   |
| Estados, áreas y tipos (listas fijas)    | `lib/datos.ts` y `supabase/schema.sql` |
| Colores                                  | `app/globals.css`                      |

## Crecer más adelante

- Respaldo: Supabase → **Database → Backups** (o exportar cada tabla a CSV).
- El plan gratis pausa el proyecto tras 7 días **sin ningún uso**; con el equipo entrando a diario no pasa. Si crece, el plan Pro cuesta US$25/mes.
- La base ya está lista para sumar finanzas, regalías e indicadores (piezas 3 y 4).

## Desarrollo

```bash
cp .env.example .env.local   # y completa las claves
npm install
npm run dev
```
