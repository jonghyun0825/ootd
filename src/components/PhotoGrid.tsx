import type { OutfitPhoto } from "../types/outfit";
import { EmptyState } from "./EmptyState";
import { PhotoCard } from "./PhotoCard";

type PhotoGridProps = {
  photos: OutfitPhoto[];
  emptyTitle: string;
  emptyDescription?: string;
};

export function PhotoGrid({ photos, emptyTitle, emptyDescription }: PhotoGridProps) {
  if (photos.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }
  return (
    <div className="photo-grid">
      {photos.map((photo) => (
        <PhotoCard key={photo.id} photo={photo} />
      ))}
    </div>
  );
}
