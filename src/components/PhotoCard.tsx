import { Link } from "react-router-dom";
import type { OutfitPhoto } from "../types/outfit";
import { seasonLabel } from "../utils/labels";

export function PhotoCard({ photo }: { photo: OutfitPhoto }) {
  return (
    <Link to={`/photos/${photo.id}`} className="photo-card">
      <img className="photo-card__image" src={photo.thumbnailUrl} alt="코디 사진 썸네일" />
      <div className="photo-card__body">
        <div className="photo-card__season">{seasonLabel(photo.season)}</div>
        {photo.tags.length > 0 && (
          <div className="photo-card__tags">{photo.tags.join(", ")}</div>
        )}
      </div>
    </Link>
  );
}
