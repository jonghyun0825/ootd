import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { OutfitPhoto } from "../types/outfit";
import { listPhotos } from "../services/photoService";
import { useAuth } from "./AuthContext";

type PhotosContextValue = {
  photos: OutfitPhoto[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  upsertPhoto: (photo: OutfitPhoto) => void;
  removePhoto: (photoId: string) => void;
};

const PhotosContext = createContext<PhotosContextValue | undefined>(undefined);

export function PhotosProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [photos, setPhotos] = useState<OutfitPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setPhotos([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await listPhotos(user.id);
      setPhotos(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "사진을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const upsertPhoto = (photo: OutfitPhoto) => {
    setPhotos((prev) => {
      const exists = prev.some((p) => p.id === photo.id);
      if (exists) return prev.map((p) => (p.id === photo.id ? photo : p));
      return [photo, ...prev];
    });
  };

  const removePhoto = (photoId: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  };

  return (
    <PhotosContext.Provider
      value={{ photos, loading, error, refresh, upsertPhoto, removePhoto }}
    >
      {children}
    </PhotosContext.Provider>
  );
}

export function usePhotos(): PhotosContextValue {
  const ctx = useContext(PhotosContext);
  if (!ctx) throw new Error("usePhotos must be used within PhotosProvider");
  return ctx;
}
