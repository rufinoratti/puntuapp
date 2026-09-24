# PuntuApp

PuntuApp será una plataforma para descubrir, puntuar y reseñar películas, videojuegos y libros.

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

3. Completar las credenciales de Supabase, TMDB y RAWG en `.env.local`. `SUPABASE_SECRET_KEY` se usa solo en el servidor para crear fichas del catálogo; nunca debe llevar el prefijo `NEXT_PUBLIC_`.

4. En Supabase, configurar **Authentication → URL Configuration** con el sitio local `http://localhost:3000` y permitir el callback `http://localhost:3000/auth/confirm`. Para que el alta inicie sesión sin verificar el correo, desactivar **Confirm email** en **Authentication → Providers → Email**. Al desplegar, agregar también el dominio de producción y definir `NEXT_PUBLIC_SITE_URL`.

5. Enlazar el CLI con tu proyecto y aplicar las migraciones:

   ```bash
   supabase login
   supabase link --project-ref <project-ref>
   supabase db push
   ```

   Las migraciones crean los perfiles, el catálogo normalizado, las reseñas y la biblioteca personal con políticas RLS.

6. Iniciar el servidor:

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

La búsqueda externa está disponible en `/api/catalog/search`. Las reseñas requieren una sesión; cualquiera puede leer las reseñas publicadas y cada persona solo puede leer y cambiar su propia biblioteca y sus reseñas. Las políticas RLS de la base de datos aplican esos permisos.

## Skills del proyecto

Las skills de frontend y arquitectura están disponibles localmente en `.agents/skills` y se registran en `skills-lock.json`.

Para esta primera pantalla se aplicaron especialmente las guías de diseño frontend, accesibilidad, Next.js, React, Tailwind v4 y shadcn/ui.

La dirección visual y las decisiones de interfaz están documentadas en [`design.md`](./design.md).

## Catálogos externos

Las películas se consultan desde TMDB, los videojuegos desde RAWG y los libros desde Open Library. Las fichas demo siguen disponibles para mostrar el catálogo cuando todavía no hay una búsqueda activa. Para usar búsquedas de películas y videojuegos en producción hay que configurar las claves de TMDB y RAWG; respetá los términos de uso y atribución de cada proveedor.
