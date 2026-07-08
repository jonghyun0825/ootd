import type { CategoryValue, ColorValue, OutfitPhoto, SeasonValue } from "../types/outfit";

export type FilterState = {
  season?: SeasonValue;
  category?: CategoryValue;
  subType?: string;
  color?: ColorValue;
  tags: string[];
};

export const EMPTY_FILTER: FilterState = { tags: [] };

export function isFilterEmpty(filter: FilterState): boolean {
  return (
    !filter.season &&
    !filter.category &&
    !filter.subType &&
    !filter.color &&
    filter.tags.length === 0
  );
}

export function matchesFilter(photo: OutfitPhoto, filter: FilterState): boolean {
  if (filter.season && photo.season !== filter.season) {
    return false;
  }

  if (filter.category || filter.subType || filter.color) {
    const hasMatchingItem = photo.items.some((item) => {
      if (filter.category && item.category !== filter.category) return false;
      if (filter.subType && item.subType !== filter.subType) return false;
      if (filter.color && item.color !== filter.color) return false;
      return true;
    });
    if (!hasMatchingItem) return false;
  }

  if (filter.tags.length > 0) {
    const hasAllTags = filter.tags.every((tag) => photo.tags.includes(tag));
    if (!hasAllTags) return false;
  }

  return true;
}

export function filterPhotos(photos: OutfitPhoto[], filter: FilterState): OutfitPhoto[] {
  return photos.filter((photo) => matchesFilter(photo, filter));
}

export function collectAllTags(photos: OutfitPhoto[]): string[] {
  const tagSet = new Set<string>();
  for (const photo of photos) {
    for (const tag of photo.tags) {
      tagSet.add(tag);
    }
  }
  return Array.from(tagSet).sort((a, b) => a.localeCompare(b, "ko"));
}
