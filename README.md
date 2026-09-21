# PuntuApp

PuntuApp será una plataforma para descubrir, puntuar y reseñar películas y videojuegos.

## Stack inicial

- Next.js con App Router y TypeScript
- Tailwind CSS + shadcn/ui
- Supabase Auth + PostgreSQL
- TMDB para películas
- RAWG para videojuegos
- Vercel para deploy

## Configuración local

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Copiar las variables de entorno:

   ```bash
   cp .env.example .env.local
   ```

3. Completar las credenciales de Supabase, TMDB y RAWG en `.env.local`.

4. Iniciar el servidor:

   ```bash
   npm run dev
   ```

Abrir [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev       # desarrollo
npm run lint      # revisión de ESLint
npm run build     # build de producción
npm run start     # servidor de producción
```

Las claves de TMDB y RAWG deben consumirse desde el servidor de Next.js y nunca exponerse en componentes del navegador.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
