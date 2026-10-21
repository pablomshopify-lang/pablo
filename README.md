# Maverick Live · Sitio web

Sitio en **Next.js + TypeScript**, con diseño estilo Apple, listo para publicar en **Vercel**.
La página de inicio tiene un formulario para dejar el correo (se guarda en **Formspree**).

## Qué hay en cada archivo

```
app/
  layout.tsx          Letra (Inter), título de la pestaña y descripción para Google
  page.tsx            Textos y secciones de la página de inicio
  globals.css         Colores, tamaños y animaciones (variables al inicio del archivo)
components/
  Nav.tsx             Barra de arriba, translúcida
  Logo.tsx            Logotipo y el ícono "play" con el degradado de marca
  SubscribeForm.tsx   Formulario de correo conectado a Formspree
  Reveal.tsx          Animación suave al aparecer cada sección
.env.example          La variable que debes configurar (ID de Formspree)
```

## Probar en tu computador

Necesitas Node.js 20 o superior (https://nodejs.org).

```bash
npm install
cp .env.example .env.local   # y pega tu ID de Formspree dentro
npm run dev                  # abre http://localhost:3000
```

## Recibir los correos (Formspree)

1. Crea una cuenta en https://formspree.io y pulsa **+ New Form**.
2. Copia el endpoint, por ejemplo `https://formspree.io/f/xyzabcd`. El ID es `xyzabcd`.
3. Pon ese ID en la variable `NEXT_PUBLIC_FORMSPREE_ID` (en `.env.local` y en Vercel).

El formulario ya viene conectado al ID `xyekqdeo`. La variable solo hace falta si algún día quieres usar otro formulario.

## Publicar en Vercel

1. Sube esta carpeta a tu repositorio de GitHub.
2. En https://vercel.com/new, importa el repositorio. Vercel detecta Next.js solo.
3. En **Environment Variables** agrega `NEXT_PUBLIC_FORMSPREE_ID` con tu ID.
4. Pulsa **Deploy**.

## Revisiones antes de publicar (reglas del style guide de Vercel)

```bash
npm run format:check   # formato del código (Prettier)
npm run lint           # errores y accesibilidad (ESLint)
npm run typecheck      # tipos (TypeScript estricto)
npm run build          # lo mismo que hace Vercel
```

## Cambios frecuentes

- Textos: `app/page.tsx` (las 4 tarjetas están en la lista `FEATURES`)
- Colores: `--brand`, `--violet` y compañía al inicio de `app/globals.css`
- Título y descripción para Google: `metadata` en `app/layout.tsx`
