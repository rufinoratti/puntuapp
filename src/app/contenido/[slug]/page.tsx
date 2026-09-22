import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MediaDetail } from "@/components/media/media-detail";
import { mediaItems } from "@/lib/media";

type MediaDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: MediaDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = mediaItems.find((mediaItem) => mediaItem.slug === slug);

  return {
    title: item ? `${item.title} | PuntuApp` : "Contenido | PuntuApp",
    description: item?.description ?? "Descubrí, puntuá y reseñá historias en PuntuApp.",
  };
}

export default async function MediaDetailPage({ params }: MediaDetailPageProps) {
  const { slug } = await params;
  const item = mediaItems.find((mediaItem) => mediaItem.slug === slug);

  if (!item) notFound();

  return <MediaDetail item={item} />;
}
