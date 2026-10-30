# Maverick Music Entertainment · Sitio web del holding

Sitio del holding **Maverick Music Entertainment LLC** en **Next.js + TypeScript**, con diseño estilo Apple, listo para publicar en **Vercel**.
Presenta las cinco marcas (Maverick Record, Mvck Music, MVCK Publishing, Maverick Live y Mavs Ticket), el ciclo del artista, el equipo y el contacto.

## Qué hay en cada archivo

```
app/
  layout.tsx          Letras (Inter y Archivo ensanchada) y título de la pestaña
  page.tsx            Textos y secciones de la página (equipo, "por qué", contacto)
  globals.css         Colores (degradado celeste, violeta y magenta), tamaños y animaciones
lib/
  brands.ts           Las 5 marcas: nombre, textos, color, sitio web y correo. Y el correo del holding
components/
  Nav.tsx             Barra de arriba: se esconde al bajar y tiene menú para celular
  BrandLogo.tsx       Muestra el logo oficial de cada marca
  logos/              Logos en vector (tomados de cada sitio de la marca)
  Cycle.tsx           "El ciclo del artista": 5 pasos que avanzan solos
  ContactPicker.tsx   Elegir con quién hablar y ver su correo
  Marquee.tsx         Cinta de palabras que se desliza
  Spotlight.tsx       Luz suave que sigue al mouse en las tarjetas
  Aurora.tsx          Manchas de luz de colores que flotan
  Reveal.tsx          Animación suave al aparecer cada sección
public/brands/
  mavs-ticket.png     Logo de Mavs Ticket (solo existe como imagen)
```

## Cambios rápidos

- **Sitio web o correo de una marca:** edita `lib/brands.ts`. Si una marca no tiene `url`, su tarjeta dice "Sitio web próximamente".
- **Correo del holding:** `HOLDING.email` en `lib/brands.ts`.
- **Equipo:** la lista `TEAM` al inicio de `app/page.tsx`.

## Animaciones

Todas respetan la opción del sistema **Reducir movimiento**: si alguien la tiene activada, la página se ve completa y quieta.

## Probar en tu computador

```bash
npm install
npm run dev     # abre http://localhost:3000
```

## Publicar en Vercel

1. En Vercel pulsa **Add New → Project** y elige el repo `pablo`.
2. En **Root Directory** elige la carpeta `holding`.
3. Ponle un nombre al proyecto (por ejemplo `mvck-entertainment`; `maverick-music-entertainment` ya lo usa el panel).
4. Pulsa **Deploy**.

## Revisar el código

```bash
npm run format:check && npm run lint && npm run typecheck && npm run build
```
