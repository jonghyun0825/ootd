import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { PhotosProvider } from "./context/PhotosContext";
import { BottomNav } from "./components/BottomNav";
import { LoadingState } from "./components/LoadingState";
import { LoginPage } from "./pages/LoginPage";
import { HomePage } from "./pages/HomePage";
import { FilterPage } from "./pages/FilterPage";
import { UploadPage } from "./pages/UploadPage";
import { ArchivePage } from "./pages/ArchivePage";
import { DetailPage } from "./pages/DetailPage";
import { EditPage } from "./pages/EditPage";

function AuthenticatedApp() {
  return (
    <PhotosProvider>
      <div className="app-shell">
        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/filter" element={<FilterPage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/archive" element={<ArchivePage />} />
            <Route path="/photos/:photoId" element={<DetailPage />} />
            <Route path="/photos/:photoId/edit" element={<EditPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </PhotosProvider>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingState label="로그인 정보를 확인하는 중..." />;
  }

  if (!user) {
    return <LoginPage />;
  }

  return <AuthenticatedApp />;
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </HashRouter>
  );
}
