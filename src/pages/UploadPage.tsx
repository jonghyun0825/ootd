import { useRef, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePhotos } from "../context/PhotosContext";
import { UploadPhotoCard } from "../components/UploadPhotoCard";
import { SEASON_OPTIONS } from "../constants/options";
import type { DraftItem, SeasonValue, UploadDraft } from "../types/outfit";
import type { TagFormValue } from "../components/TagForm";
import { createPhoto } from "../services/photoService";

function defaultItem(category: DraftItem["category"]): DraftItem {
  if (category === "outer") {
    return { category, subType: "none", color: "none" };
  }
  return { category, subType: "", color: "unknown" };
}

function createDraft(file: File): UploadDraft {
  return {
    localId: crypto.randomUUID(),
    file,
    previewUrl: URL.createObjectURL(file),
    season: "unknown",
    top: defaultItem("top"),
    bottom: defaultItem("bottom"),
    shoes: defaultItem("shoes"),
    outer: defaultItem("outer"),
    tagsText: "",
    memo: "",
    status: "idle",
  };
}

function parseTags(tagsText: string): string[] {
  return Array.from(
    new Set(
      tagsText
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
    ),
  );
}

export function UploadPage() {
  const { user } = useAuth();
  const { upsertPhoto } = usePhotos();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [drafts, setDrafts] = useState<UploadDraft[]>([]);
  const [bulkSeason, setBulkSeason] = useState<SeasonValue | "">("");
  const [bulkTag, setBulkTag] = useState("");
  const [saving, setSaving] = useState(false);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;
    setDrafts((prev) => [...prev, ...files.map(createDraft)]);
    event.target.value = "";
  };

  const updateDraft = (localId: string, patch: Partial<UploadDraft>) => {
    setDrafts((prev) =>
      prev.map((draft) => (draft.localId === localId ? { ...draft, ...patch } : draft)),
    );
  };

  const handleDraftFormChange = (localId: string, value: TagFormValue) => {
    updateDraft(localId, { ...value });
  };

  const handleRemove = (localId: string) => {
    setDrafts((prev) => {
      const target = prev.find((draft) => draft.localId === localId);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((draft) => draft.localId !== localId);
    });
  };

  const applyBulkSeason = () => {
    if (!bulkSeason) return;
    setDrafts((prev) => prev.map((draft) => ({ ...draft, season: bulkSeason })));
  };

  const applyBulkTag = () => {
    const tag = bulkTag.trim();
    if (!tag) return;
    setDrafts((prev) =>
      prev.map((draft) => {
        const existing = parseTags(draft.tagsText);
        if (existing.includes(tag)) return draft;
        return { ...draft, tagsText: [...existing, tag].join(", ") };
      }),
    );
    setBulkTag("");
  };

  const handleSaveAll = async () => {
    if (!user) return;
    setSaving(true);

    const pending = drafts.filter((draft) => draft.status !== "success");
    for (const draft of pending) {
      updateDraft(draft.localId, { status: "uploading", errorMessage: undefined });
      try {
        const photo = await createPhoto(user.id, draft.file, {
          season: draft.season,
          top: draft.top,
          bottom: draft.bottom,
          shoes: draft.shoes,
          outer: draft.outer,
          tags: parseTags(draft.tagsText),
          memo: draft.memo,
        });
        upsertPhoto(photo);
        updateDraft(draft.localId, { status: "success" });
      } catch (error) {
        updateDraft(draft.localId, {
          status: "error",
          errorMessage: error instanceof Error ? error.message : "저장에 실패했어요.",
        });
      }
    }

    setSaving(false);

    setDrafts((current) => {
      const stillNeedsAttention = current.some((draft) => draft.status === "error");
      if (!stillNeedsAttention && current.length > 0) {
        navigate("/archive");
        return [];
      }
      return current;
    });
  };

  return (
    <div>
      <div className="page-title">사진 업로드</div>
      <p className="page-subtitle">
        사진을 선택한 뒤 각 사진의 계절과 아이템 정보를 직접 입력해 주세요.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />
      <button
        type="button"
        className="btn btn-primary btn-block"
        onClick={() => fileInputRef.current?.click()}
      >
        사진 선택하기 (여러 장 가능)
      </button>

      {drafts.length > 0 && (
        <>
          <div className="card" style={{ marginTop: 16 }}>
            <div className="form-section-title" style={{ marginTop: 0 }}>
              모든 사진에 일괄 적용
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="bulk-season">계절 일괄 적용</label>
                <select
                  id="bulk-season"
                  value={bulkSeason}
                  onChange={(event) => setBulkSeason(event.target.value as SeasonValue | "")}
                >
                  <option value="">선택</option>
                  {SEASON_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field" style={{ display: "flex", alignItems: "flex-end" }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-block"
                  onClick={applyBulkSeason}
                >
                  적용
                </button>
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="bulk-tag">공통 자유 태그 추가</label>
                <input
                  id="bulk-tag"
                  type="text"
                  placeholder="예: 여행룩"
                  value={bulkTag}
                  onChange={(event) => setBulkTag(event.target.value)}
                />
              </div>
              <div className="field" style={{ display: "flex", alignItems: "flex-end" }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-block"
                  onClick={applyBulkTag}
                >
                  추가
                </button>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            {drafts.map((draft) => (
              <UploadPhotoCard
                key={draft.localId}
                draft={draft}
                onChange={(value) => handleDraftFormChange(draft.localId, value)}
                onRemove={() => handleRemove(draft.localId)}
              />
            ))}
          </div>

          <button
            type="button"
            className="btn btn-primary btn-block"
            style={{ marginTop: 20 }}
            disabled={saving}
            onClick={handleSaveAll}
          >
            {saving ? "저장 중..." : "전체 저장"}
          </button>
        </>
      )}
    </div>
  );
}
