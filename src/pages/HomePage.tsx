import { Link } from "react-router-dom";
import { usePhotos } from "../context/PhotosContext";
import { PhotoGrid } from "../components/PhotoGrid";
import { LoadingState } from "../components/LoadingState";
import { SEASON_OPTIONS } from "../constants/options";

export function HomePage() {
  const { photos, loading } = usePhotos();
  const recentPhotos = [...photos]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  return (
    <div>
      <div className="page-title">패션 코디 아카이브</div>

      <div className="form-section-title">계절로 빠르게 보기</div>
      <div className="chip-group" style={{ marginBottom: 20 }}>
        {SEASON_OPTIONS.filter((option) => option.value !== "unknown").map((option) => (
          <Link key={option.value} to={`/filter?season=${option.value}`} className="chip">
            {option.label}
          </Link>
        ))}
      </div>

      <Link
        to="/upload"
        className="btn btn-primary btn-block"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
          textDecoration: "none",
        }}
      >
        사진 업로드
      </Link>

      <div className="form-section-title">최근 저장한 코디</div>
      {loading ? (
        <LoadingState />
      ) : (
        <PhotoGrid
          photos={recentPhotos}
          emptyTitle="아직 저장된 코디 사진이 없어요."
          emptyDescription="갤러리에서 사진을 업로드해 보세요."
        />
      )}
    </div>
  );
}
