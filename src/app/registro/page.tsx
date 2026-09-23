import type { Metadata } from "next";

import { RegistrationForm } from "@/components/auth/registration-form";

export const metadata: Metadata = {
  title: "Crear cuenta | PuntuApp",
  description: "Armá tu biblioteca personal de películas, videojuegos y libros.",
};

export default function RegistrationPage() {
  return <RegistrationForm />;
}
