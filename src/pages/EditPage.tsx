import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePhotos } from "../context/PhotosContext";
import { LoadingState } from "../components/LoadingState";
import { EmptyState } from "../components/EmptyState";
import { TagForm, type TagFormValue } from "../components/TagForm";
import { getPhoto, updatePhoto } from "../services/photoService";
import type { DraftItem, OutfitPhoto } from "../types/outfit";

function itemToDraft(photo: OutfitPhoto, category: DraftItem["category"]): DraftItem {
  const found = photo.items.find((item) => item.category === category);
  if (found) return { category, subType: found.subType, color: found.color };
  return category === "outer"
    ? { category, subType: "none", color: "none" }
    : { category, subType: "", color: "unknown" };
}

export function EditPage() {
  const { photoId } = useParams<{ photoId: string }>();
  const { user } = useAuth();
  const { photos, upsertPhoto } = usePhotos();
  const navigate = useNavigate();

  const [photo, setPhoto] = useState<OutfitPhoto | null | undefined>(undefined);
  const [form, setForm] = useState<TagFormValue | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!photoId || !user) return;
    const cached = photos.find((p) => p.id === photoId);
    const source = cached ? Promise.resolve(cached) : getPhoto(user.id, photoId);
    source.then((found) => {
      setPhoto(found);
      if (found) {
        setForm({
          season: found.season,
          top: itemToDraft(found, "top"),
          bottom: itemToDraft(found, "bottom"),
          shoes: itemToDraft(found, "shoes"),
          outer: itemToDraft(found, "outer"),
          tagsText: found.tags.join(", "),
          memo: found.memo ?? "",
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoId, user]);

  if (photo === undefined || !form) {
    return <LoadingState />;
  }
  if (photo === null) {
    return <EmptyState title="사진을 찾을 수 없어요." />;
  }

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      const tags = Array.from(
        new Set(
          form.tagsText
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag.length > 0),
        ),
      );
      const updated = await updatePhoto(user.id, photo, {
        season: form.season,
        top: form.top,
        bottom: form.bottom,
        shoes: form.shoes,
        outer: form.outer,
        tags,
        memo: form.memo,
      });
      upsertPhoto(updated);
      navigate(`/photos/${photo.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했어요.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="page-title">코디 정보 수정</div>
      <img
        className="detail-photo"
        src={photo.imageUrl ?? photo.thumbnailUrl}
        alt="수정할 코디 사진"
      />

      <TagForm idPrefix="edit" value={form} onChange={setForm} />

      {error && <div className="status-banner error">{error}</div>}

      <div className="action-row">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate(`/photos/${photo.id}`)}
        >
          취소
        </button>
        <button type="button" className="btn btn-primary" disabled={saving} onClick={handleSave}>
          {saving ? "저장 중..." : "저장"}
        </button>
      </div>
    </div>
  );
}
