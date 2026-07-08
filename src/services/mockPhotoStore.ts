import type { OutfitPhoto } from "../types/outfit";
import { createSeedPhotos } from "./mockData";

const STORAGE_KEY_PREFIX = "outfit-archive:mock-photos:";

function storageKey(userId: string): string {
  return `${STORAGE_KEY_PREFIX}${userId}`;
}

export function loadMockPhotos(userId: string): OutfitPhoto[] {
  const raw = localStorage.getItem(storageKey(userId));
  if (!raw) {
    const seeded = createSeedPhotos(userId);
    saveMockPhotos(userId, seeded);
    return seeded;
  }
  try {
    return JSON.parse(raw) as OutfitPhoto[];
  } catch {
    return [];
  }
}

export function saveMockPhotos(userId: string, photos: OutfitPhoto[]): void {
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(photos));
  } catch {
    // localStorage 용량 초과 등은 데모(mock) 모드에서는 무시한다.
  }
}

export function clearMockPhotos(userId: string): void {
  localStorage.removeItem(storageKey(userId));
}
