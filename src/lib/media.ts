export type MediaType = "movie" | "game" | "book";
export type MediaSource = "tmdb" | "rawg" | "openlibrary";

export type MediaReview = {
  id: string;
  author: string;
  rating: number;
  text: string;
  createdAt: string;
};

export type MediaItem = {
  id: string;
  slug: string;
  type: MediaType;
  title: string;
  creatorLabel?: string;
  creator?: string;
  year: string;
  rating: number;
  externalRating?: {
    value: number;
    scale: 5 | 10;
    label: string;
  };
  source?: MediaSource;
  providerId?: string;
  sourceUrl?: string;
  genre: string;
  image: string;
  imageAlt: string;
  description?: string;
  cast?: string[];
  runtime?: string;
  tags?: string[];
  platforms?: string[];
};

// Historias de muestra para la portada y para mostrar el catálogo antes de iniciar una búsqueda externa.
export const mediaItems: MediaItem[] = [
  {
    id: "dune-part-two",
    slug: "dune-part-two",
    type: "movie",
    title: "Dune: Parte dos",
    creatorLabel: "Director",
    creator: "Denis Villeneuve",
    year: "2024",
    rating: 4.7,
    genre: "Ciencia ficción",
    image:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Sala de cine con una pantalla iluminada",
    description:
      "Paul Atreides se une a Chani y a los Fremen mientras busca venganza y se enfrenta a una elección que puede cambiar el destino de la galaxia.",
    cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Austin Butler"],
    runtime: "2 h 46 min",
    tags: ["ciencia-ficcion", "top"],
  },
  {
    id: "hades-ii",
    slug: "hades-ii",
    type: "game",
    title: "Hades II",
    creatorLabel: "Desarrollador",
    creator: "Supergiant Games",
    year: "2025",
    rating: 4.8,
    genre: "Acción y roguelike",
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Control de videojuegos sobre una mesa oscura",
    description:
      "Melinoë, princesa del inframundo, se abre camino a través de una nueva mitología griega en una aventura roguelike rápida, expresiva y llena de descubrimientos.",
    runtime: "Sesiones de 20–40 min",
    tags: ["top", "roguelike"],
    platforms: ["pc", "playstation", "xbox"],
  },
  {
    id: "the-substance",
    slug: "the-substance",
    type: "movie",
    title: "La sustancia",
    creatorLabel: "Directora",
    creator: "Coralie Fargeat",
    year: "2024",
    rating: 4.4,
    genre: "Terror y drama",
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Proyector de cine iluminando una sala",
    description:
      "Una actriz descubre una misteriosa sustancia capaz de crear una versión más joven, bella y perfecta de sí misma, con un precio cada vez más alto.",
    cast: ["Demi Moore", "Margaret Qualley", "Dennis Quaid"],
    runtime: "2 h 21 min",
    tags: ["drama", "terror"],
  },
  {
    id: "clair-obscur",
    slug: "clair-obscur",
    type: "game",
    title: "Clair Obscur: Expedition 33",
    creatorLabel: "Desarrollador",
    creator: "Sandfall Interactive",
    year: "2025",
    rating: 4.9,
    genre: "RPG",
    image:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Videojuego en una pantalla con luces de colores",
    description:
      "Una expedición imposible parte desde Lumière para enfrentar un ciclo mortal y descubrir el secreto detrás de una pintura que borra vidas.",
    runtime: "50–70 h",
    tags: ["rpg", "top"],
    platforms: ["pc", "playstation", "xbox"],
  },
  {
    id: "perfect-days",
    slug: "perfect-days",
    type: "movie",
    title: "Perfect Days",
    creatorLabel: "Director",
    creator: "Wim Wenders",
    year: "2023",
    rating: 4.6,
    genre: "Drama",
    image:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Butacas rojas frente a una pantalla de cine",
    description:
      "Hirayama encuentra belleza en la repetición de sus días, en la música que escucha y en los pequeños encuentros que interrumpen su rutina.",
    cast: ["Kōji Yakusho", "Tokio Emoto", "Arisa Nakano"],
    runtime: "2 h 4 min",
    tags: ["drama", "top"],
  },
  {
    id: "hollow-knight",
    slug: "hollow-knight",
    type: "game",
    title: "Hollow Knight",
    creatorLabel: "Desarrollador",
    creator: "Team Cherry",
    year: "2017",
    rating: 4.7,
    genre: "Metroidvania",
    image:
      "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=900&q=85",
    imageAlt: "Setup de videojuegos con monitor y teclado",
    description:
      "Un caballero diminuto explora un reino en ruinas, combate criaturas extrañas y reconstruye una historia que se cuenta entre silencios.",
    runtime: "25–40 h",
    tags: ["metroidvania"],
    platforms: ["pc", "nintendo-switch"],
  },
  {
    id: "the-left-hand-of-darkness",
    slug: "the-left-hand-of-darkness",
    type: "book",
    title: "La mano izquierda de la oscuridad",
    creatorLabel: "Autora",
    creator: "Ursula K. Le Guin",
    year: "1969",
    rating: 4.8,
    genre: "Ciencia ficción",
    image: "/images/book-placeholder.svg",
    imageAlt: "Portada de La mano izquierda de la oscuridad",
    description:
      "En el planeta Gueden, un enviado intenta construir una alianza entre pueblos cuyas formas de vivir, amar y entender el poder desafían todas sus certezas.",
    runtime: "304 páginas",
    tags: ["ficcion", "ciencia-ficcion", "clasicos", "top"],
  },
  {
    id: "distancia-de-rescate",
    slug: "distancia-de-rescate",
    type: "book",
    title: "Distancia de rescate",
    creatorLabel: "Autora",
    creator: "Samanta Schweblin",
    year: "2014",
    rating: 4.5,
    genre: "Ficción contemporánea",
    image: "/images/book-placeholder.svg",
    imageAlt: "Portada de Distancia de rescate",
    description:
      "Una conversación urgente entre una mujer y un niño reconstruye el miedo, la maternidad y la distancia exacta que separa una vida de otra.",
    runtime: "128 páginas",
    tags: ["ficcion", "contemporaneo"],
  },
  {
    id: "el-infinito-en-un-junco",
    slug: "el-infinito-en-un-junco",
    type: "book",
    title: "El infinito en un junco",
    creatorLabel: "Autora",
    creator: "Irene Vallejo",
    year: "2019",
    rating: 4.6,
    genre: "Ensayo",
    image: "/images/book-placeholder.svg",
    imageAlt: "Portada de El infinito en un junco",
    description:
      "Un viaje por la historia de los libros, las bibliotecas y las personas que protegieron la palabra escrita desde la Antigüedad hasta hoy.",
    runtime: "452 páginas",
    tags: ["no-ficcion", "contemporaneo"],
  },
];
