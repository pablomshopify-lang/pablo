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
public/partners/   Aquí van los logos oficiales de las entidades
```

## Poner los logos de las entidades

1. Guarda cada logo (mejor en SVG) en `public/partners/`, por ejemplo `ascap.svg`.
2. En `components/Partners.tsx` agrega `logo: '/partners/ascap.svg'` a esa entidad.

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
