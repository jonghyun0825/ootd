import { OUTFIT_PHOTOS_BUCKET, supabase } from "./supabaseClient";

const SIGNED_URL_EXPIRES_IN_SECONDS = 60 * 60; // 1시간

function requireSupabase() {
  if (!supabase) {
    throw new Error("Supabase가 설정되지 않았습니다.");
  }
  return supabase;
}

export function buildImagePath(userId: string, photoId: string): string {
  return `photos/${userId}/${photoId}.jpg`;
}

export function buildThumbnailPath(userId: string, photoId: string): string {
  return `thumbnails/${userId}/${photoId}.jpg`;
}

export async function uploadPhotoFiles(
  userId: string,
  photoId: string,
  large: Blob,
  thumbnail: Blob,
): Promise<{ imagePath: string; thumbnailPath: string }> {
  const client = requireSupabase();
  const imagePath = buildImagePath(userId, photoId);
  const thumbnailPath = buildThumbnailPath(userId, photoId);

  const [imageUpload, thumbnailUpload] = await Promise.all([
    client.storage.from(OUTFIT_PHOTOS_BUCKET).upload(imagePath, large, {
      contentType: "image/jpeg",
      upsert: true,
    }),
    client.storage.from(OUTFIT_PHOTOS_BUCKET).upload(thumbnailPath, thumbnail, {
      contentType: "image/jpeg",
      upsert: true,
    }),
  ]);

  if (imageUpload.error) throw imageUpload.error;
  if (thumbnailUpload.error) throw thumbnailUpload.error;

  return { imagePath, thumbnailPath };
}

export async function getSignedUrl(path: string): Promise<string> {
  const client = requireSupabase();
  const { data, error } = await client.storage
    .from(OUTFIT_PHOTOS_BUCKET)
    .createSignedUrl(path, SIGNED_URL_EXPIRES_IN_SECONDS);
  if (error || !data) {
    throw error ?? new Error("이미지 URL을 생성할 수 없습니다.");
  }
  return data.signedUrl;
}

export async function getSignedUrls(paths: string[]): Promise<Record<string, string>> {
  const client = requireSupabase();
  if (paths.length === 0) return {};
  const { data, error } = await client.storage
    .from(OUTFIT_PHOTOS_BUCKET)
    .createSignedUrls(paths, SIGNED_URL_EXPIRES_IN_SECONDS);
  if (error || !data) {
    throw error ?? new Error("이미지 URL을 생성할 수 없습니다.");
  }
  const result: Record<string, string> = {};
  data.forEach((entry) => {
    if (entry.signedUrl && entry.path) {
      result[entry.path] = entry.signedUrl;
    }
  });
  return result;
}

export async function deletePhotoFiles(paths: string[]): Promise<void> {
  const client = requireSupabase();
  const { error } = await client.storage.from(OUTFIT_PHOTOS_BUCKET).remove(paths);
  if (error) throw error;
}
