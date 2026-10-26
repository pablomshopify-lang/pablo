# Mvck Publishing · Sitio web

Sitio de **Mvck Publishing** (editorial musical del Holding MVCK) en **Next.js + TypeScript**, con diseño estilo Apple, listo para publicar en **Vercel**.

## Qué hay en cada archivo

```
app/
  layout.tsx       Letras (Unbounded títulos, Inter textos, Lora cursiva) y título de la pestaña
  page.tsx         Textos y secciones de la página
  globals.css      Colores, tamaños y animaciones (variables al inicio del archivo)
components/
  Logo.tsx         Logotipo e isotipo, tomados de "Logotipo Publishing.pdf"
  Partners.tsx     Entidades: ASCAP, The MLC, Harry Fox Agency, Music Reports, SoundExchange
  Nav.tsx          Barra de arriba, translúcida
  Reveal.tsx       Animación suave al aparecer cada sección
lib/
  links.ts         Enlaces: correo, redes sociales
public/partners/   Logos oficiales de las entidades
```

## Cambiar un logo de las entidades

1. Guarda el logo nuevo (mejor en SVG) en `public/partners/`.
2. En `components/Partners.tsx` cambia `src`, `width` y `height` de esa entidad.
   Los logos se muestran en blanco automáticamente.

## Probar en tu computador

```bash
npm install
npm run dev     # abre http://localhost:3000
```

## Publicar en Vercel

1. En Vercel pulsa **Add New → Project** y elige el repo `pablo`.
2. En **Root Directory** elige la carpeta `mvck-publishing`.
3. Pulsa **Deploy**.

## Revisar el código

```bash
npm run format:check && npm run lint && npm run typecheck && npm run build
```
