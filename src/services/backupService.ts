import type { BackupData, OutfitPhoto } from "../types/outfit";
import { todayDateString } from "../utils/dates";
import { updatePhoto } from "./photoService";

export function buildBackupData(photos: OutfitPhoto[]): BackupData {
  return {
    version: "1.0",
    exportedAt: new Date().toISOString(),
    photos,
  };
}

export function downloadBackupFile(photos: OutfitPhoto[]): void {
  const backup = buildBackupData(photos);
  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `fashion-archive-backup-${todayDateString()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function parseBackupFile(text: string): BackupData {
  const parsed = JSON.parse(text) as BackupData;
  if (!parsed || parsed.version !== "1.0" || !Array.isArray(parsed.photos)) {
    throw new Error("올바른 백업 파일 형식이 아닙니다.");
  }
  return parsed;
}

export type RestoreSummary = {
  updated: number;
  skipped: number;
};

export async function restoreBackup(
  userId: string,
  backup: BackupData,
  currentPhotos: OutfitPhoto[],
): Promise<RestoreSummary> {
  let updated = 0;
  let skipped = 0;

  for (const backupPhoto of backup.photos) {
    const existing = currentPhotos.find((photo) => photo.id === backupPhoto.id);
    if (!existing) {
      skipped += 1;
      continue;
    }

    const top = backupPhoto.items.find((item) => item.category === "top");
    const bottom = backupPhoto.items.find((item) => item.category === "bottom");
    const shoes = backupPhoto.items.find((item) => item.category === "shoes");
    const outer = backupPhoto.items.find((item) => item.category === "outer");

    await updatePhoto(userId, existing, {
      season: backupPhoto.season,
      top: { category: "top", subType: top?.subType ?? "", color: top?.color ?? "unknown" },
      bottom: {
        category: "bottom",
        subType: bottom?.subType ?? "",
        color: bottom?.color ?? "unknown",
      },
      shoes: {
        category: "shoes",
        subType: shoes?.subType ?? "",
        color: shoes?.color ?? "unknown",
      },
      outer: {
        category: "outer",
        subType: outer?.subType ?? "none",
        color: outer?.color ?? "none",
      },
      tags: backupPhoto.tags,
      memo: backupPhoto.memo ?? "",
    });
    updated += 1;
  }

  return { updated, skipped };
}
