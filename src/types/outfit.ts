export type SeasonValue = "spring_fall" | "summer" | "winter" | "unknown";

export type CategoryValue = "top" | "bottom" | "shoes" | "outer";

export type ColorValue =
  | "black"
  | "charcoal"
  | "gray"
  | "white"
  | "cream"
  | "ivory"
  | "beige"
  | "camel"
  | "brown"
  | "khaki"
  | "olive"
  | "green"
  | "navy"
  | "blue"
  | "sky_blue"
  | "purple"
  | "pink"
  | "burgundy"
  | "red"
  | "yellow"
  | "orange"
  | "denim"
  | "multi"
  | "none"
  | "unknown";

export type OutfitItem = {
  id: string;
  photoId: string;
  category: CategoryValue;
  subType: string;
  color: ColorValue;
};

export type OutfitPhoto = {
  id: string;
  userId: string;
  imagePath: string;
  thumbnailPath: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt: string;
  season: SeasonValue;
  items: OutfitItem[];
  tags: string[];
  memo?: string;
};

export type AppUser = {
  id: string;
  email?: string;
  createdAt: string;
};

export type BackupData = {
  version: "1.0";
  exportedAt: string;
  photos: OutfitPhoto[];
};

export type PhotoFilter = {
  season?: SeasonValue;
  category?: CategoryValue;
  subType?: string;
  color?: ColorValue;
  tag?: string;
};

export type DraftItem = {
  category: CategoryValue;
  subType: string;
  color: ColorValue;
};

export type UploadDraft = {
  localId: string;
  file: File;
  previewUrl: string;
  season: SeasonValue;
  top: DraftItem;
  bottom: DraftItem;
  shoes: DraftItem;
  outer: DraftItem;
  tagsText: string;
  memo: string;
  status: "idle" | "uploading" | "success" | "error";
  errorMessage?: string;
};
