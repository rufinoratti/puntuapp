import type { Metadata } from "next";

import { RegistrationForm } from "@/components/auth/registration-form";

export const metadata: Metadata = {
  title: "Crear cuenta | PuntuApp",
  description: "Armá tu biblioteca personal de películas, videojuegos y libros.",
};

type RegistrationPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function RegistrationPage({ searchParams }: RegistrationPageProps) {
  const { next } = await searchParams;
  return <RegistrationForm nextPath={next} />;
}
