import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PuntuApp | Películas y videojuegos",
  description:
    "Descubrí, puntuá y reseñá tus películas y videojuegos favoritos.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
