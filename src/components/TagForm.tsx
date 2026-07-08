import {
  CATEGORY_SUBTYPE_OPTIONS,
  COLOR_OPTIONS,
  SEASON_OPTIONS,
} from "../constants/options";
import type { CategoryValue, DraftItem, SeasonValue } from "../types/outfit";

export type TagFormValue = {
  season: SeasonValue;
  top: DraftItem;
  bottom: DraftItem;
  shoes: DraftItem;
  outer: DraftItem;
  tagsText: string;
  memo: string;
};

type TagFormProps = {
  value: TagFormValue;
  onChange: (next: TagFormValue) => void;
  idPrefix: string;
};

function ItemSelectRow({
  idPrefix,
  category,
  label,
  item,
  onChange,
}: {
  idPrefix: string;
  category: CategoryValue;
  label: string;
  item: DraftItem;
  onChange: (patch: Partial<DraftItem>) => void;
}) {
  const subTypeOptions = CATEGORY_SUBTYPE_OPTIONS[category];
  return (
    <div className="field-row">
      <div className="field">
        <label htmlFor={`${idPrefix}-${category}-subtype`}>{label} 종류</label>
        <select
          id={`${idPrefix}-${category}-subtype`}
          value={item.subType}
          onChange={(event) => onChange({ subType: event.target.value })}
        >
          <option value="">선택 안 함</option>
          {subTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor={`${idPrefix}-${category}-color`}>{label} 색상</label>
        <select
          id={`${idPrefix}-${category}-color`}
          value={item.color}
          onChange={(event) => onChange({ color: event.target.value as DraftItem["color"] })}
        >
          {COLOR_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export function TagForm({ value, onChange, idPrefix }: TagFormProps) {
  const updateItem = (category: CategoryValue, patch: Partial<DraftItem>) => {
    onChange({ ...value, [category]: { ...value[category], ...patch } });
  };

  return (
    <div>
      <div className="form-section-title">기본 정보</div>
      <div className="field">
        <label htmlFor={`${idPrefix}-season`}>계절</label>
        <select
          id={`${idPrefix}-season`}
          value={value.season}
          onChange={(event) => onChange({ ...value, season: event.target.value as SeasonValue })}
        >
          {SEASON_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-section-title">상의 / 하의</div>
      <ItemSelectRow
        idPrefix={idPrefix}
        category="top"
        label="상의"
        item={value.top}
        onChange={(patch) => updateItem("top", patch)}
      />
      <ItemSelectRow
        idPrefix={idPrefix}
        category="bottom"
        label="하의"
        item={value.bottom}
        onChange={(patch) => updateItem("bottom", patch)}
      />

      <div className="form-section-title">신발 / 아우터</div>
      <ItemSelectRow
        idPrefix={idPrefix}
        category="shoes"
        label="신발"
        item={value.shoes}
        onChange={(patch) => updateItem("shoes", patch)}
      />
      <ItemSelectRow
        idPrefix={idPrefix}
        category="outer"
        label="아우터"
        item={value.outer}
        onChange={(patch) => updateItem("outer", patch)}
      />

      <div className="form-section-title">태그 / 메모</div>
      <div className="field">
        <label htmlFor={`${idPrefix}-tags`}>자유 태그 (쉼표로 구분)</label>
        <input
          id={`${idPrefix}-tags`}
          type="text"
          placeholder="예: 데일리룩, 출근룩"
          value={value.tagsText}
          onChange={(event) => onChange({ ...value, tagsText: event.target.value })}
        />
      </div>
      <div className="field">
        <label htmlFor={`${idPrefix}-memo`}>메모</label>
        <textarea
          id={`${idPrefix}-memo`}
          placeholder="이 코디에 대한 메모를 남겨보세요."
          value={value.memo}
          onChange={(event) => onChange({ ...value, memo: event.target.value })}
        />
      </div>
    </div>
  );
}
