import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { usePhotos } from "../context/PhotosContext";
import {
  CATEGORY_OPTIONS,
  CATEGORY_SUBTYPE_OPTIONS,
  COLOR_OPTIONS,
  SEASON_OPTIONS,
} from "../constants/options";
import { FilterChips, MultiFilterChips } from "../components/FilterChips";
import { PhotoGrid } from "../components/PhotoGrid";
import { LoadingState } from "../components/LoadingState";
import { collectAllTags, EMPTY_FILTER, filterPhotos, type FilterState } from "../utils/filters";
import type { CategoryValue } from "../types/outfit";

const LAST_FILTER_KEY = "outfit-archive:last-filter";

function loadLastFilter(): FilterState {
  const raw = localStorage.getItem(LAST_FILTER_KEY);
  if (!raw) return { ...EMPTY_FILTER };
  try {
    const parsed = JSON.parse(raw) as FilterState;
    return { ...parsed, tags: parsed.tags ?? [] };
  } catch {
    return { ...EMPTY_FILTER };
  }
}

export function FilterPage() {
  const { photos, loading } = usePhotos();
  const [searchParams] = useSearchParams();
  const [draft, setDraft] = useState<FilterState>(loadLastFilter);
  const [applied, setApplied] = useState<FilterState>(draft);

  useEffect(() => {
    const seasonParam = searchParams.get("season");
    if (seasonParam) {
      const next: FilterState = { ...EMPTY_FILTER, season: seasonParam as FilterState["season"] };
      setDraft(next);
      setApplied(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const allTags = collectAllTags(photos);
  const subTypeOptions = draft.category ? CATEGORY_SUBTYPE_OPTIONS[draft.category] : [];

  const handleCategorySelect = (value: CategoryValue | undefined) => {
    setDraft((prev) => ({ ...prev, category: value, subType: undefined }));
  };

  const handleApply = () => {
    setApplied(draft);
    localStorage.setItem(LAST_FILTER_KEY, JSON.stringify(draft));
  };

  const handleReset = () => {
    const empty: FilterState = { tags: [] };
    setDraft(empty);
    setApplied(empty);
    localStorage.removeItem(LAST_FILTER_KEY);
  };

  const toggleTag = (tag: string) => {
    setDraft((prev) => {
      const has = prev.tags.includes(tag);
      return { ...prev, tags: has ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag] };
    });
  };

  const results = filterPhotos(photos, applied);

  return (
    <div>
      <div className="page-title">필터로 찾기</div>
      <p className="page-subtitle">
        검색어를 입력하지 않고, 아래 태그를 선택해서 원하는 코디를 찾아보세요.
      </p>

      <div className="form-section-title">계절</div>
      <FilterChips
        options={SEASON_OPTIONS}
        selected={draft.season}
        onSelect={(value) => setDraft((prev) => ({ ...prev, season: value }))}
      />

      <div className="form-section-title">카테고리</div>
      <FilterChips
        options={CATEGORY_OPTIONS}
        selected={draft.category}
        onSelect={handleCategorySelect}
      />

      {draft.category && (
        <>
          <div className="form-section-title">아이템 종류</div>
          <FilterChips
            options={subTypeOptions}
            selected={draft.subType}
            onSelect={(value) => setDraft((prev) => ({ ...prev, subType: value }))}
          />
        </>
      )}

      <div className="form-section-title">색상</div>
      <FilterChips
        options={COLOR_OPTIONS}
        selected={draft.color}
        onSelect={(value) => setDraft((prev) => ({ ...prev, color: value }))}
      />

      {allTags.length > 0 && (
        <>
          <div className="form-section-title">자유 태그</div>
          <MultiFilterChips options={allTags} selected={draft.tags} onToggle={toggleTag} />
        </>
      )}

      <div className="action-row">
        <button type="button" className="btn btn-secondary" onClick={handleReset}>
          필터 초기화
        </button>
        <button type="button" className="btn btn-primary" onClick={handleApply}>
          필터 적용
        </button>
      </div>

      <div className="form-section-title">결과</div>
      {loading ? (
        <LoadingState />
      ) : (
        <PhotoGrid
          photos={results}
          emptyTitle="조건에 맞는 코디 사진이 없어요."
          emptyDescription="필터를 바꿔 다시 확인해 보세요."
        />
      )}
    </div>
  );
}
