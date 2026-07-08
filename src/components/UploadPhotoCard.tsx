import type { UploadDraft } from "../types/outfit";
import { TagForm, type TagFormValue } from "./TagForm";

type UploadPhotoCardProps = {
  draft: UploadDraft;
  onChange: (next: TagFormValue) => void;
  onRemove: () => void;
};

export function UploadPhotoCard({ draft, onChange, onRemove }: UploadPhotoCardProps) {
  return (
    <div className="card">
      <div className="upload-card">
        <img className="upload-card__thumb" src={draft.previewUrl} alt="선택한 사진 미리보기" />
        <div style={{ flex: 1 }}>
          {draft.status === "uploading" && (
            <div className="status-banner">저장 중...</div>
          )}
          {draft.status === "error" && (
            <div className="status-banner error">
              {draft.errorMessage ?? "저장에 실패했어요. 다시 시도해 주세요."}
            </div>
          )}
          {draft.status === "success" && (
            <div className="status-banner success">저장 완료</div>
          )}
          <button type="button" className="upload-card__remove" onClick={onRemove}>
            사진 제거
          </button>
        </div>
      </div>
      <TagForm
        idPrefix={draft.localId}
        value={{
          season: draft.season,
          top: draft.top,
          bottom: draft.bottom,
          shoes: draft.shoes,
          outer: draft.outer,
          tagsText: draft.tagsText,
          memo: draft.memo,
        }}
        onChange={onChange}
      />
    </div>
  );
}
