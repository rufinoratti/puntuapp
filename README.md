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

   - TMDB: cuenta gratuita en themoviedb.org → Settings → API → Read Access Token.
   - RAWG: clave gratuita en rawg.io/apidocs.

   Sin estas claves la home usa el catálogo de muestra y las APIs responden `503`.

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

## Skills del proyecto

Las skills de frontend y arquitectura están disponibles localmente en `.agents/skills` y se registran en `skills-lock.json`.

Para esta primera pantalla se aplicaron especialmente las guías de diseño frontend, accesibilidad, Next.js, React, Tailwind v4 y shadcn/ui.

La dirección visual y las decisiones de interfaz están documentadas en [`design.md`](./design.md).

## Próximo paso sugerido

Conectar Supabase Auth y el modelo de puntuaciones/reseñas para que cada usuario pueda crear sus puntuaciones y reseñas sobre los títulos del catálogo.
