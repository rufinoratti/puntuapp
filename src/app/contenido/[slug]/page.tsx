import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MediaDetail } from "@/components/media/media-detail";
import { getItemBySlug } from "@/lib/catalog";

type MediaDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: MediaDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getItemBySlug(slug);

  return {
    title: item ? `${item.title} | PuntuApp` : "Contenido | PuntuApp",
    description: item?.description ?? "Descubrí, puntuá y reseñá historias en PuntuApp.",
  };
}

export default async function MediaDetailPage({ params }: MediaDetailPageProps) {
  const { slug } = await params;
  const item = await getItemBySlug(slug);

  if (!item) notFound();

  return <MediaDetail item={item} />;
}
