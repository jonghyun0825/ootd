import { isSupabaseConfigured, supabase } from "./supabaseClient";
import { loadMockPhotos, saveMockPhotos } from "./mockPhotoStore";
import { createResizedImages } from "./imageResize";
import { blobToDataUrl } from "../utils/blob";
import { deletePhotoFiles, getSignedUrls, uploadPhotoFiles } from "./storageService";
import type { CategoryValue, DraftItem, OutfitItem, OutfitPhoto, SeasonValue } from "../types/outfit";

export type SavePhotoInput = {
  season: SeasonValue;
  top: DraftItem;
  bottom: DraftItem;
  shoes: DraftItem;
  outer: DraftItem;
  tags: string[];
  memo: string;
};

function draftItemsToList(photoId: string, input: SavePhotoInput): OutfitItem[] {
  const build = (category: CategoryValue, draft: DraftItem): OutfitItem => ({
    id: crypto.randomUUID(),
    photoId,
    category,
    subType: draft.subType,
    color: draft.color,
  });
  return [
    build("top", input.top),
    build("bottom", input.bottom),
    build("shoes", input.shoes),
    build("outer", input.outer),
  ];
}

// ---------- Mock (Supabase 미설정 시 localStorage 기반) ----------

async function mockListPhotos(userId: string): Promise<OutfitPhoto[]> {
  return [...loadMockPhotos(userId)].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

async function mockGetPhoto(userId: string, photoId: string): Promise<OutfitPhoto | null> {
  const photos = loadMockPhotos(userId);
  return photos.find((photo) => photo.id === photoId) ?? null;
}

async function mockCreatePhoto(
  userId: string,
  file: File,
  input: SavePhotoInput,
): Promise<OutfitPhoto> {
  const { large, thumbnail } = await createResizedImages(file);
  const [imageUrl, thumbnailUrl] = await Promise.all([
    blobToDataUrl(large),
    blobToDataUrl(thumbnail),
  ]);
  const photoId = crypto.randomUUID();
  const now = new Date().toISOString();

  const photo: OutfitPhoto = {
    id: photoId,
    userId,
    imagePath: "",
    thumbnailPath: "",
    imageUrl,
    thumbnailUrl,
    createdAt: now,
    updatedAt: now,
    season: input.season,
    items: draftItemsToList(photoId, input),
    tags: input.tags,
    memo: input.memo,
  };

  const photos = loadMockPhotos(userId);
  photos.unshift(photo);
  saveMockPhotos(userId, photos);
  return photo;
}

async function mockUpdatePhoto(
  userId: string,
  photo: OutfitPhoto,
  input: SavePhotoInput,
): Promise<OutfitPhoto> {
  const photos = loadMockPhotos(userId);
  const index = photos.findIndex((p) => p.id === photo.id);
  if (index === -1) throw new Error("사진을 찾을 수 없습니다.");

  const updated: OutfitPhoto = {
    ...photos[index],
    season: input.season,
    items: draftItemsToList(photo.id, input),
    tags: input.tags,
    memo: input.memo,
    updatedAt: new Date().toISOString(),
  };
  photos[index] = updated;
  saveMockPhotos(userId, photos);
  return updated;
}

async function mockDeletePhoto(userId: string, photo: OutfitPhoto): Promise<void> {
  const photos = loadMockPhotos(userId).filter((p) => p.id !== photo.id);
  saveMockPhotos(userId, photos);
}

// ---------- 실제 Supabase 연동 ----------

type PhotoRow = {
  id: string;
  user_id: string;
  image_path: string;
  thumbnail_path: string;
  season: SeasonValue;
  tags: string[] | null;
  memo: string | null;
  created_at: string;
  updated_at: string;
};

type ItemRow = {
  id: string;
  photo_id: string;
  category: CategoryValue;
  sub_type: string;
  color: OutfitItem["color"];
};

function requireSupabase() {
  if (!supabase) throw new Error("Supabase가 설정되지 않았습니다.");
  return supabase;
}

function assemblePhoto(
  row: PhotoRow,
  items: ItemRow[],
  imageUrl?: string,
  thumbnailUrl?: string,
): OutfitPhoto {
  return {
    id: row.id,
    userId: row.user_id,
    imagePath: row.image_path,
    thumbnailPath: row.thumbnail_path,
    imageUrl,
    thumbnailUrl,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    season: row.season,
    items: items.map((item) => ({
      id: item.id,
      photoId: item.photo_id,
      category: item.category,
      subType: item.sub_type,
      color: item.color,
    })),
    tags: row.tags ?? [],
    memo: row.memo ?? "",
  };
}

async function supabaseListPhotos(userId: string): Promise<OutfitPhoto[]> {
  const client = requireSupabase();
  const { data: photoRows, error } = await client
    .from("outfit_photos")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;

  const rows = (photoRows ?? []) as PhotoRow[];
  if (rows.length === 0) return [];

  const photoIds = rows.map((row) => row.id);
  const { data: itemRows, error: itemsError } = await client
    .from("outfit_items")
    .select("*")
    .in("photo_id", photoIds);
  if (itemsError) throw itemsError;

  const thumbnailPaths = rows.map((row) => row.thumbnail_path);
  const signedUrlMap = await getSignedUrls(thumbnailPaths);

  return rows.map((row) =>
    assemblePhoto(
      row,
      ((itemRows ?? []) as ItemRow[]).filter((item) => item.photo_id === row.id),
      undefined,
      signedUrlMap[row.thumbnail_path],
    ),
  );
}

async function supabaseGetPhoto(userId: string, photoId: string): Promise<OutfitPhoto | null> {
  const client = requireSupabase();
  const { data: row, error } = await client
    .from("outfit_photos")
    .select("*")
    .eq("id", photoId)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  if (!row) return null;

  const photoRow = row as PhotoRow;
  const { data: itemRows, error: itemsError } = await client
    .from("outfit_items")
    .select("*")
    .eq("photo_id", photoId);
  if (itemsError) throw itemsError;

  const urlMap = await getSignedUrls([photoRow.image_path, photoRow.thumbnail_path]);
  return assemblePhoto(
    photoRow,
    (itemRows ?? []) as ItemRow[],
    urlMap[photoRow.image_path],
    urlMap[photoRow.thumbnail_path],
  );
}

async function supabaseCreatePhoto(
  userId: string,
  file: File,
  input: SavePhotoInput,
): Promise<OutfitPhoto> {
  const client = requireSupabase();
  const photoId = crypto.randomUUID();
  const { large, thumbnail } = await createResizedImages(file);
  const { imagePath, thumbnailPath } = await uploadPhotoFiles(userId, photoId, large, thumbnail);

  const now = new Date().toISOString();
  const { error: insertError } = await client.from("outfit_photos").insert({
    id: photoId,
    user_id: userId,
    image_path: imagePath,
    thumbnail_path: thumbnailPath,
    season: input.season,
    tags: input.tags,
    memo: input.memo,
    created_at: now,
    updated_at: now,
  });
  if (insertError) throw insertError;

  const items = draftItemsToList(photoId, input);
  const { error: itemsError } = await client.from("outfit_items").insert(
    items.map((item) => ({
      id: item.id,
      photo_id: photoId,
      user_id: userId,
      category: item.category,
      sub_type: item.subType,
      color: item.color,
      created_at: now,
      updated_at: now,
    })),
  );
  if (itemsError) throw itemsError;

  const urlMap = await getSignedUrls([imagePath, thumbnailPath]);
  return assemblePhoto(
    {
      id: photoId,
      user_id: userId,
      image_path: imagePath,
      thumbnail_path: thumbnailPath,
      season: input.season,
      tags: input.tags,
      memo: input.memo,
      created_at: now,
      updated_at: now,
    },
    items.map((item) => ({
      id: item.id,
      photo_id: photoId,
      category: item.category,
      sub_type: item.subType,
      color: item.color,
    })),
    urlMap[imagePath],
    urlMap[thumbnailPath],
  );
}

async function supabaseUpdatePhoto(
  userId: string,
  photo: OutfitPhoto,
  input: SavePhotoInput,
): Promise<OutfitPhoto> {
  const client = requireSupabase();
  const now = new Date().toISOString();

  const { error: updateError } = await client
    .from("outfit_photos")
    .update({ season: input.season, tags: input.tags, memo: input.memo, updated_at: now })
    .eq("id", photo.id)
    .eq("user_id", userId);
  if (updateError) throw updateError;

  const { error: deleteItemsError } = await client
    .from("outfit_items")
    .delete()
    .eq("photo_id", photo.id);
  if (deleteItemsError) throw deleteItemsError;

  const items = draftItemsToList(photo.id, input);
  const { error: insertItemsError } = await client.from("outfit_items").insert(
    items.map((item) => ({
      id: item.id,
      photo_id: photo.id,
      user_id: userId,
      category: item.category,
      sub_type: item.subType,
      color: item.color,
      created_at: now,
      updated_at: now,
    })),
  );
  if (insertItemsError) throw insertItemsError;

  const urlMap = await getSignedUrls([photo.imagePath, photo.thumbnailPath]);
  return {
    ...photo,
    season: input.season,
    items,
    tags: input.tags,
    memo: input.memo,
    updatedAt: now,
    imageUrl: urlMap[photo.imagePath],
    thumbnailUrl: urlMap[photo.thumbnailPath],
  };
}

async function supabaseDeletePhoto(userId: string, photo: OutfitPhoto): Promise<void> {
  const client = requireSupabase();
  await deletePhotoFiles([photo.imagePath, photo.thumbnailPath]);

  const { error: deleteItemsError } = await client
    .from("outfit_items")
    .delete()
    .eq("photo_id", photo.id);
  if (deleteItemsError) throw deleteItemsError;

  const { error: deletePhotoError } = await client
    .from("outfit_photos")
    .delete()
    .eq("id", photo.id)
    .eq("user_id", userId);
  if (deletePhotoError) throw deletePhotoError;
}

// ---------- 공개 API ----------

export async function listPhotos(userId: string): Promise<OutfitPhoto[]> {
  return isSupabaseConfigured ? supabaseListPhotos(userId) : mockListPhotos(userId);
}

export async function getPhoto(userId: string, photoId: string): Promise<OutfitPhoto | null> {
  return isSupabaseConfigured ? supabaseGetPhoto(userId, photoId) : mockGetPhoto(userId, photoId);
}

export async function createPhoto(
  userId: string,
  file: File,
  input: SavePhotoInput,
): Promise<OutfitPhoto> {
  return isSupabaseConfigured
    ? supabaseCreatePhoto(userId, file, input)
    : mockCreatePhoto(userId, file, input);
}

export async function updatePhoto(
  userId: string,
  photo: OutfitPhoto,
  input: SavePhotoInput,
): Promise<OutfitPhoto> {
  return isSupabaseConfigured
    ? supabaseUpdatePhoto(userId, photo, input)
    : mockUpdatePhoto(userId, photo, input);
}

export async function deletePhoto(userId: string, photo: OutfitPhoto): Promise<void> {
  return isSupabaseConfigured
    ? supabaseDeletePhoto(userId, photo)
    : mockDeletePhoto(userId, photo);
}
