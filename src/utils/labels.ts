import {
  CATEGORY_OPTIONS,
  CATEGORY_SUBTYPE_OPTIONS,
  COLOR_OPTIONS,
  SEASON_OPTIONS,
} from "../constants/options";
import type { CategoryValue, ColorValue, SeasonValue } from "../types/outfit";

function findLabel<T extends string>(options: { value: T; label: string }[], value: T): string {
  return options.find((option) => option.value === value)?.label ?? value;
}

export function seasonLabel(value: SeasonValue): string {
  return findLabel(SEASON_OPTIONS, value);
}

export function categoryLabel(value: CategoryValue): string {
  return findLabel(CATEGORY_OPTIONS, value);
}

export function colorLabel(value: ColorValue): string {
  return findLabel(COLOR_OPTIONS, value);
}

export function subTypeLabel(category: CategoryValue, subType: string): string {
  return findLabel(CATEGORY_SUBTYPE_OPTIONS[category], subType);
}
