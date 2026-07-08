import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePhotos } from "../context/PhotosContext";
import { LoadingState } from "../components/LoadingState";
import { EmptyState } from "../components/EmptyState";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { categoryLabel, colorLabel, seasonLabel, subTypeLabel } from "../utils/labels";
import { deletePhoto, getPhoto } from "../services/photoService";
import type { OutfitPhoto } from "../types/outfit";

export function DetailPage() {
  const { photoId } = useParams<{ photoId: string }>();
  const { user } = useAuth();
  const { photos, removePhoto } = usePhotos();
  const navigate = useNavigate();

  const [photo, setPhoto] = useState<OutfitPhoto | null | undefined>(undefined);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!photoId || !user) return;
    const cached = photos.find((p) => p.id === photoId);
    if (cached && cached.imageUrl) {
      setPhoto(cached);
      return;
    }
    getPhoto(user.id, photoId).then(setPhoto);
  }, [photoId, photos, user]);

  if (photo === undefined) {
    return <LoadingState />;
  }

  if (photo === null) {
    return <EmptyState title="사진을 찾을 수 없어요." />;
  }

  const handleDelete = async () => {
    if (!user) return;
    setDeleting(true);
    try {
      await deletePhoto(user.id, photo);
      removePhoto(photo.id);
      navigate("/archive");
    } finally {
      setDeleting(false);
    }
  };

  const itemsByCategory = {
    top: photo.items.find((item) => item.category === "top"),
    bottom: photo.items.find((item) => item.category === "bottom"),
    shoes: photo.items.find((item) => item.category === "shoes"),
    outer: photo.items.find((item) => item.category === "outer"),
  };

  return (
    <div>
      <img className="detail-photo" src={photo.imageUrl ?? photo.thumbnailUrl} alt="코디 사진" />

      <div className="detail-row">
        <span className="detail-row__label">계절</span>
        <span>{seasonLabel(photo.season)}</span>
      </div>

      {(["top", "bottom", "shoes", "outer"] as const).map((category) => {
        const item = itemsByCategory[category];
        if (!item || !item.subType) return null;
        return (
          <div className="detail-row" key={category}>
            <span className="detail-row__label">{categoryLabel(category)}</span>
            <span>
              {subTypeLabel(category, item.subType)} · {colorLabel(item.color)}
            </span>
          </div>
        );
      })}

      {photo.tags.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div className="form-section-title" style={{ marginTop: 0 }}>
            자유 태그
          </div>
          <div className="detail-tags">
            {photo.tags.map((tag) => (
              <span key={tag} className="tag-pill">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {photo.memo && (
        <div style={{ marginTop: 16 }}>
          <div className="form-section-title" style={{ marginTop: 0 }}>
            메모
          </div>
          <p>{photo.memo}</p>
        </div>
      )}

      <div className="action-row">
        <Link to={`/photos/${photo.id}/edit`} className="btn btn-secondary" style={{ display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
          수정
        </Link>
        <button type="button" className="btn btn-danger" onClick={() => setShowDeleteConfirm(true)}>
          삭제
        </button>
      </div>

      {showDeleteConfirm && (
        <ConfirmDialog
          title="이 코디 사진을 삭제할까요?"
          description="사진과 태그 정보가 모두 삭제되며, 되돌릴 수 없습니다."
          confirmLabel={deleting ? "삭제 중..." : "삭제"}
          danger
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
