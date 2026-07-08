import { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { usePhotos } from "../context/PhotosContext";
import { PhotoGrid } from "../components/PhotoGrid";
import { LoadingState } from "../components/LoadingState";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { CATEGORY_OPTIONS, SEASON_OPTIONS } from "../constants/options";
import { downloadBackupFile, parseBackupFile, restoreBackup } from "../services/backupService";
import { deletePhoto } from "../services/photoService";
import type { CategoryValue, SeasonValue } from "../types/outfit";

type ViewMode = "all" | "season" | "category";

export function ArchivePage() {
  const { user, logout } = useAuth();
  const { photos, loading, refresh } = usePhotos();
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);
  const importInputRef = useRef<HTMLInputElement>(null);

  const sortedPhotos = [...photos].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const handleExport = () => {
    downloadBackupFile(sortedPhotos);
  };

  const handleImportClick = () => {
    importInputRef.current?.click();
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !user) return;
    setImportMessage("가져오는 중...");
    try {
      const text = await file.text();
      const backup = parseBackupFile(text);
      const summary = await restoreBackup(user.id, backup, photos);
      await refresh();
      setImportMessage(
        `복원 완료: ${summary.updated}개 업데이트, ${summary.skipped}개는 사진이 없어 건너뜀`,
      );
    } catch (error) {
      setImportMessage(error instanceof Error ? error.message : "백업 파일을 읽을 수 없어요.");
    }
  };

  const handleDeleteAll = async () => {
    if (!user) return;
    setDeletingAll(true);
    for (const photo of photos) {
      try {
        await deletePhoto(user.id, photo);
      } catch {
        // 개별 삭제 실패는 무시하고 계속 진행
      }
    }
    setDeletingAll(false);
    setShowDeleteAllConfirm(false);
    await refresh();
  };

  return (
    <div>
      <div className="page-title">아카이브</div>

      <div className="chip-group" style={{ marginBottom: 16 }}>
        <button
          type="button"
          className={`chip${viewMode === "all" ? " is-selected" : ""}`}
          onClick={() => setViewMode("all")}
        >
          전체 보기
        </button>
        <button
          type="button"
          className={`chip${viewMode === "season" ? " is-selected" : ""}`}
          onClick={() => setViewMode("season")}
        >
          계절별 보기
        </button>
        <button
          type="button"
          className={`chip${viewMode === "category" ? " is-selected" : ""}`}
          onClick={() => setViewMode("category")}
        >
          카테고리별 보기
        </button>
      </div>

      {loading ? (
        <LoadingState />
      ) : viewMode === "all" ? (
        <PhotoGrid
          photos={sortedPhotos}
          emptyTitle="아직 저장된 코디 사진이 없어요."
          emptyDescription="갤러리에서 사진을 업로드해 보세요."
        />
      ) : viewMode === "season" ? (
        (SEASON_OPTIONS as { value: SeasonValue; label: string }[]).map((option) => {
          const group = sortedPhotos.filter((photo) => photo.season === option.value);
          if (group.length === 0) return null;
          return (
            <div key={option.value} className="section-block">
              <div className="form-section-title">{option.label}</div>
              <PhotoGrid photos={group} emptyTitle="" />
            </div>
          );
        })
      ) : (
        (CATEGORY_OPTIONS as { value: CategoryValue; label: string }[]).map((option) => {
          const group = sortedPhotos.filter((photo) =>
            photo.items.some((item) => item.category === option.value && item.subType),
          );
          if (group.length === 0) return null;
          return (
            <div key={option.value} className="section-block">
              <div className="form-section-title">{option.label}</div>
              <PhotoGrid photos={group} emptyTitle="" />
            </div>
          );
        })
      )}

      <div className="section-block">
        <div className="form-section-title">백업</div>
        <div className="action-row">
          <button type="button" className="btn btn-secondary" onClick={handleExport}>
            백업 내보내기
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleImportClick}>
            백업 가져오기
          </button>
        </div>
        <input
          ref={importInputRef}
          type="file"
          accept="application/json"
          style={{ display: "none" }}
          onChange={handleImportFile}
        />
        {importMessage && <p className="page-subtitle">{importMessage}</p>}
      </div>

      <div className="section-block">
        <div className="form-section-title">계정</div>
        <button type="button" className="btn btn-secondary btn-block" onClick={logout}>
          로그아웃
        </button>
      </div>

      <div className="section-block">
        <div className="form-section-title">위험 구역</div>
        <button
          type="button"
          className="btn btn-danger btn-block"
          onClick={() => setShowDeleteAllConfirm(true)}
        >
          전체 데이터 삭제
        </button>
      </div>

      {showDeleteAllConfirm && (
        <ConfirmDialog
          title="정말 모든 코디 사진과 태그를 삭제할까요?"
          description="이 작업은 되돌릴 수 없습니다."
          confirmLabel={deletingAll ? "삭제 중..." : "전체 삭제"}
          danger
          onCancel={() => setShowDeleteAllConfirm(false)}
          onConfirm={handleDeleteAll}
        />
      )}
    </div>
  );
}
