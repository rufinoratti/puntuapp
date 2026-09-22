# PuntuApp · Dirección de diseño

Este documento fija la dirección visual y de interacción de PuntuApp. La interfaz se construye como una biblioteca editorial para películas, videojuegos y libros, con el aire relajado y la composición asimétrica de la referencia de Raus, pero con identidad propia para el mundo audiovisual y editorial.

## Idea de producto

PuntuApp ayuda a guardar lo que vimos, ponerle una puntuación y explicar por qué una historia nos dejó algo. El producto debe sentirse como una colección personal, no como un catálogo frío ni como una red social ruidosa.

## Dirección visual

- **Base clara:** crema cálido como lienzo principal. No usar una interfaz dark-first.
- **Verde hoja:** color de marca para navegación, títulos, acciones principales y wordmark.
- **Coral:** acento emocional para ratings, estados destacados y llamadas a la acción.
- **Azul cielo:** bloques de apoyo, superficies de transición y momentos de movimiento.
- **Editorial y cercana:** titulares grandes con serif display, UI en sans legible y captions breves.
- **Composición asimétrica:** imágenes en mosaico, tarjetas con diferentes proporciones y mucho espacio negativo.
- **Bordes redondeados:** usar radios generosos, entre `1.5rem` y `2.75rem`, sin convertir cada elemento en una píldora.
- **Identidad propia:** Raus es referencia de ritmo y sensibilidad, no una fuente para copiar logos, textos o assets.

## Tokens de color

| Token | Uso | Referencia |
| --- | --- | --- |
| `canvas` | Fondo principal | `#F7F3E8` |
| `canvas-subtle` | Tarjetas y superficies | `#FFFEF8` |
| `brand` | Verde principal | `#0E6A43` |
| `coral` | Acento y ratings | `#FB9568` |
| `sky` | Bloques de apoyo | `#A7DCF3` |
| `canvas-foreground` | Texto principal | `#21362B` |
| `canvas-muted` | Texto secundario | `#77766B` |
| `canvas-line` | Bordes | `#D8D7C8` |

Los componentes deben usar tokens semánticos (`bg-brand`, `text-canvas-muted`, `bg-coral`) en lugar de colores crudos de Tailwind.

## Arquitectura de la home

1. **Header:** wordmark PUNTUAPP, navegación corta y acceso de cuenta.
2. **Hero:** promesa de producto a la izquierda y explorador visual de tendencias a la derecha, con una división desktop cercana al 50/50.
3. **Callout de criterio:** explica que la biblioteca se construye con la voz del usuario.
4. **Catálogo:** búsqueda, filtros y fichas con portada, tipo, rating, año y creador o autor.
5. **Comunidad:** bloque coral para presentar la futura capa social.
6. **Journal:** selecciones y notas editoriales que conectan películas y videojuegos.
7. **Footer:** marca grande a la izquierda, navegación alineada a la derecha y la multitud animada ocupando la franja inferior sin competir con los enlaces.

## Movimiento

- El preload ocurre solo en la entrada de la página y comunica que PuntuApp está preparando la colección.
- La referencia de Skiper10 se adapta como un **PuntuApp Double Stairs Preloader** con verde y coral.
- Skiper49 se usa literalmente en el hero, con su coverflow invertido, animaciones y assets demo originales.
- El movimiento debe ser corto, con `ease-out`, y trabajar principalmente con `transform` y `opacity`.
- Toda interacción animada debe tener una variante respetuosa de `prefers-reduced-motion`.

## Accesibilidad y contenido

- Todo control interactivo debe poder usarse con teclado y mostrar `focus-visible`.
- Las imágenes necesitan `alt` descriptivo cuando comunican contenido. Las decorativas usan `aria-hidden`.
- Los filtros mantienen `aria-pressed` y anuncian la cantidad de resultados.
- El tono es argentino, cálido y directo: “guardá”, “puntuá”, “compartí”, “encontrá”.
- Evitar claims de popularidad reales hasta conectar datos de TMDB, RAWG y Supabase.

## Integraciones y costos

- PuntuApp es un proyecto sin fines de lucro: las integraciones deben ser gratuitas y no depender de planes pagos, facturación obligatoria ni APIs con tarjeta como requisito.
- Para libros se prioriza Open Library por sus APIs públicas de búsqueda, autores, ediciones y portadas. El uso debe mantenerse en un volumen bajo y las puntuaciones y reseñas deben seguir siendo propias de PuntuApp.

## Componentes de referencia

- `src/components/ui/skiper-ui/skiper49.tsx`: componente original de Skiper49, sin modificaciones internas.
- `src/components/ui/skiper-ui/skiper39.tsx`: componente original de Skiper39; su `CrowdCanvas` se inserta directamente como fondo del footer con la spritesheet local. La etiqueta técnica del demo no se muestra en la interfaz pública, la multitud puede teñirse con un color de marca sin perder transparencia ni detalles claros y admite un desplazamiento responsive para controlar el recorte del encuadre. El runtime está optimizado para móvil: pausa fuera de viewport, DPR limitado, menos peeps en pantallas chicas y cleanup completo del ticker.
- `src/app/api/catalog/route.ts`: catálogo inicial combinado (TMDB + RAWG + libros de muestra).
- `src/app/api/movies/route.ts` / `src/app/api/games/route.ts` / `src/app/api/books/route.ts`: búsqueda normalizada por tipo.
- `src/lib/tmdb.ts`, `src/lib/rawg.ts`, `src/lib/books.ts`: clientes server-side con caché de una hora y fallback.
- `src/components/ui/skiper-ui/puntuapp-preloader.tsx`: preload propio inspirado en el concepto Double Stairs.
- `src/components/home/puntuapp-home.tsx`: composición de la landing y catálogo.

## Próximas decisiones

- Definir el modelo de puntuación y reseñas en Supabase.
- Agregar autenticación antes de habilitar crear perfil, guardar títulos y publicar reseñas.
- Completar filtros por categoría con los géneros reales de TMDB y RAWG.
