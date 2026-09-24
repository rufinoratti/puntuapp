import type { Metadata } from "next";
import "./globals.css";

import { PuntuappFooter } from "@/components/layout/puntuapp-footer";

export const metadata: Metadata = {
  title: "PuntuApp | Películas, videojuegos y libros",
  description:
    "Descubrí, puntuá y reseñá tus películas, videojuegos y libros favoritos.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-canvas">
        {children}
        <PuntuappFooter />
      </body>
    </html>
  );
}
