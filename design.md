# PuntuApp · Dirección de diseño

Este documento fija la dirección visual y de interacción de PuntuApp. La interfaz se construye como una biblioteca editorial para películas y videojuegos, con el aire relajado y la composición asimétrica de la referencia de Raus, pero con identidad propia para el mundo audiovisual.

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

1. **Announcement bar:** mensaje breve y CTA coral.
2. **Header:** wordmark PUNTUAPP, navegación corta y acceso de cuenta.
3. **Hero:** promesa de producto a la izquierda y explorador visual de tendencias a la derecha.
4. **Callout de criterio:** explica que la biblioteca se construye con la voz del usuario.
5. **Catálogo:** búsqueda, filtros y fichas con portada, tipo, rating, año y creador.
6. **Comunidad:** bloque coral para presentar la futura capa social.
7. **Journal:** selecciones y notas editoriales que conectan películas y videojuegos.
8. **Footer:** navegación simple, identidad y próximos accesos.

## Movimiento

- El preload ocurre solo en la entrada de la página y comunica que PuntuApp está preparando la colección.
- La referencia de Skiper10 se adapta como un **PuntuApp Double Stairs Preloader** con verde y coral.
- Skiper52 se usa como galería de tendencias en el hero: hover, foco o click expande una portada y revela título, tipo, género y rating.
- El movimiento debe ser corto, con `ease-out`, y trabajar principalmente con `transform` y `opacity`.
- Toda interacción animada debe tener una variante respetuosa de `prefers-reduced-motion`.

## Accesibilidad y contenido

- Todo control interactivo debe poder usarse con teclado y mostrar `focus-visible`.
- Las imágenes necesitan `alt` descriptivo cuando comunican contenido. Las decorativas usan `aria-hidden`.
- Los filtros mantienen `aria-pressed` y anuncian la cantidad de resultados.
- El tono es argentino, cálido y directo: “guardá”, “puntuá”, “compartí”, “encontrá”.
- Evitar claims de popularidad reales hasta conectar datos de TMDB, RAWG y Supabase.

## Componentes de referencia

- `src/components/ui/skiper-ui/skiper52.tsx`: galería expandible adaptada para títulos en tendencia.
- `src/components/ui/skiper-ui/puntuapp-preloader.tsx`: preload propio inspirado en el concepto Double Stairs.
- `src/components/home/puntuapp-home.tsx`: composición de la landing y catálogo.

## Próximas decisiones

- Reemplazar `mediaItems` por resultados normalizados de TMDB y RAWG.
- Definir el modelo de puntuación y reseñas en Supabase.
- Agregar autenticación antes de habilitar crear perfil, guardar títulos y publicar reseñas.
- Evaluar una vista de detalle para cada película o videojuego sin romper el lenguaje editorial de la home.
