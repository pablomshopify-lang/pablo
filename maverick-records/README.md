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
  Nav.tsx          Barra de arriba, translúcida
  Reveal.tsx       Animación suave al aparecer cada sección
lib/
  links.ts         Enlaces: correo, Instagram, marcas del holding
```

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
