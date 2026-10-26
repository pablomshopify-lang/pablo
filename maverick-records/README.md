# Maverick Records · Sitio web

Sitio de **Maverick Records** (sello musical independiente del Holding MVCK) en **Next.js + TypeScript**, con diseño estilo Apple, listo para publicar en **Vercel**.

## Qué hay en cada archivo

```
app/
  layout.tsx       Letra (Outfit) y título de la pestaña
  page.tsx         Textos y secciones de la página
  globals.css      Colores, tamaños y animaciones (variables al inicio del archivo)
components/
  Logo.tsx         Logotipo e isotipo, tomados de "Logotipo Maverick RGB.pdf"
  Nav.tsx          Barra de arriba: se esconde al bajar y tiene menú para celular
  Pillars.tsx      Los 3 textos del sello en pestañas que avanzan solas
  Marquee.tsx      Cinta de palabras que se desliza
  Spotlight.tsx    Luz suave que sigue al mouse (portada y tarjetas)
  Reveal.tsx       Animación suave al aparecer cada sección
lib/
  links.ts         Enlaces: correo, Instagram, marcas del holding
```

## Animaciones

Todas respetan la opción del sistema **Reducir movimiento**: si alguien la tiene activada,
la página se ve completa y quieta.

## Probar en tu computador

```bash
npm install
npm run dev     # abre http://localhost:3000
```

## Publicar en Vercel

1. En Vercel pulsa **Add New → Project** y elige el repo `pablo`.
2. En **Root Directory** elige la carpeta `maverick-records`.
3. Pulsa **Deploy**.

## Revisar el código

```bash
npm run format:check && npm run lint && npm run typecheck && npm run build
```
