import type { CategoryValue, ColorValue, SeasonValue } from "../types/outfit";

export type Option<T extends string> = { value: T; label: string };

export const SEASON_OPTIONS: Option<SeasonValue>[] = [
  { value: "spring_fall", label: "봄/가을" },
  { value: "summer", label: "여름" },
  { value: "winter", label: "겨울" },
  { value: "unknown", label: "미지정" },
];

export const CATEGORY_OPTIONS: Option<CategoryValue>[] = [
  { value: "top", label: "상의" },
  { value: "bottom", label: "하의" },
  { value: "shoes", label: "신발" },
  { value: "outer", label: "아우터" },
];

export const TOP_TYPE_OPTIONS: Option<string>[] = [
  { value: "t_shirt", label: "티셔츠" },
  { value: "shirt", label: "셔츠" },
  { value: "knit", label: "니트" },
  { value: "sweatshirt", label: "맨투맨" },
  { value: "hoodie", label: "후드티" },
  { value: "cardigan", label: "카디건" },
  { value: "polo_shirt", label: "폴로셔츠" },
  { value: "sleeveless", label: "민소매" },
  { value: "blouse", label: "블라우스" },
  { value: "other_top", label: "기타 상의" },
];

export const BOTTOM_TYPE_OPTIONS: Option<string>[] = [
  { value: "jeans", label: "청바지" },
  { value: "slacks", label: "슬랙스" },
  { value: "chino_pants", label: "치노 팬츠" },
  { value: "shorts", label: "반바지" },
  { value: "skirt", label: "스커트" },
  { value: "jogger_pants", label: "조거 팬츠" },
  { value: "wide_pants", label: "와이드 팬츠" },
  { value: "cargo_pants", label: "카고 팬츠" },
  { value: "leggings", label: "레깅스" },
  { value: "other_bottom", label: "기타 하의" },
];

export const SHOES_TYPE_OPTIONS: Option<string>[] = [
  { value: "athletic_shoes", label: "운동화" },
  { value: "dress_shoes", label: "구두" },
  { value: "sneakers", label: "스니커즈" },
  { value: "boots", label: "부츠" },
  { value: "slippers", label: "슬리퍼" },
];

export const OUTER_TYPE_OPTIONS: Option<string>[] = [
  { value: "none", label: "없음" },
  { value: "jacket", label: "자켓" },
  { value: "blazer", label: "블레이저" },
  { value: "coat", label: "코트" },
  { value: "trench_coat", label: "트렌치코트" },
  { value: "padding", label: "패딩" },
  { value: "cardigan", label: "카디건" },
  { value: "jumper", label: "점퍼" },
  { value: "leather_jacket", label: "가죽자켓" },
  { value: "denim_jacket", label: "데님자켓" },
  { value: "other_outer", label: "기타 아우터" },
];

export const COLOR_OPTIONS: Option<ColorValue>[] = [
  { value: "black", label: "검정" },
  { value: "charcoal", label: "차콜" },
  { value: "gray", label: "회색" },
  { value: "white", label: "흰색" },
  { value: "cream", label: "크림" },
  { value: "ivory", label: "아이보리" },
  { value: "beige", label: "베이지" },
  { value: "camel", label: "카멜" },
  { value: "brown", label: "브라운" },
  { value: "khaki", label: "카키" },
  { value: "olive", label: "올리브" },
  { value: "green", label: "초록" },
  { value: "navy", label: "네이비" },
  { value: "blue", label: "파랑" },
  { value: "sky_blue", label: "하늘색" },
  { value: "purple", label: "보라" },
  { value: "pink", label: "핑크" },
  { value: "burgundy", label: "버건디" },
  { value: "red", label: "빨강" },
  { value: "yellow", label: "노랑" },
  { value: "orange", label: "주황" },
  { value: "denim", label: "데님" },
  { value: "multi", label: "멀티컬러" },
  { value: "none", label: "없음" },
  { value: "unknown", label: "미지정" },
];

export const CATEGORY_SUBTYPE_OPTIONS: Record<CategoryValue, Option<string>[]> = {
  top: TOP_TYPE_OPTIONS,
  bottom: BOTTOM_TYPE_OPTIONS,
  shoes: SHOES_TYPE_OPTIONS,
  outer: OUTER_TYPE_OPTIONS,
};

export const DEFAULT_SUBTYPE: Record<CategoryValue, string> = {
  top: "",
  bottom: "",
  shoes: "",
  outer: "none",
};

export const PRESET_FREE_TAGS: string[] = [
  "미니멀",
  "데일리룩",
  "데이트룩",
  "여행룩",
  "출근룩",
];
