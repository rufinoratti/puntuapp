import type { Metadata } from "next";

import { WatchlistView } from "@/components/watchlist/watchlist-view";

export const metadata: Metadata = {
  title: "Mi watchlist | PuntuApp",
  description:
    "Tu lista de espera de películas, videojuegos y libros: lo que guardaste para ver después.",
};

export default function WatchlistPage() {
  return <WatchlistView />;
}
