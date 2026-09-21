export type MediaType = "movie" | "game" | "book";

export type MediaItem = {
  id: string;
  slug: string;
  type: MediaType;
  title: string;
  creatorLabel: string;
  creator: string;
  year: string;
  rating: number;
  genre: string;
  image: string;
  imageAlt: string;
};

// Datos de muestra para la primera iteración visual. Luego se reemplazan por TMDB, RAWG y Open Library.
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
  },
];
