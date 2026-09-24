import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { MediaDetail } from "@/components/media/media-detail";
import { getMediaItemBySlug } from "@/lib/catalog";
import { getMediaCommunity } from "@/lib/supabase/community";

const getMediaItem = cache(getMediaItemBySlug);

type MediaDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: MediaDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = await getMediaItem(slug);

  return {
    title: item ? `${item.title} | PuntuApp` : "Contenido | PuntuApp",
    description: item?.description ?? "Descubrí, puntuá y reseñá historias en PuntuApp.",
  };
}

export default async function MediaDetailPage({ params }: MediaDetailPageProps) {
  const { slug } = await params;
  const item = await getMediaItem(slug);

  if (!item) notFound();

  const community = await getMediaCommunity(item);

  return (
    <MediaDetail
      item={item}
      reviews={community.reviews}
      isInLibrary={community.isInLibrary}
      isAuthenticated={community.isAuthenticated}
    />
  );
}
