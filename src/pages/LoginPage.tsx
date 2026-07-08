import { useState, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const { requestLogin, verifyCode, isMockMode } = useAuth();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(
    null,
  );

  const handleRequestCode = async (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    setMessage(null);
    const result = await requestLogin(email.trim());
    setSubmitting(false);
    if (result.error) {
      setMessage({ type: "error", text: result.error });
      return;
    }
    if (result.codeSent) {
      setStep("code");
      setMessage({
        type: "success",
        text: "인증코드를 이메일로 보냈어요. 메일함에서 6자리 코드를 확인해 주세요.",
      });
    }
  };

  const handleVerifyCode = async (event: FormEvent) => {
    event.preventDefault();
    if (!code.trim()) return;
    setSubmitting(true);
    setMessage(null);
    const result = await verifyCode(email.trim(), code.trim());
    setSubmitting(false);
    if (result.error) {
      setMessage({ type: "error", text: result.error });
    }
  };

  return (
    <div className="login-page">
      <div className="login-title">패션 코디 아카이브</div>
      <p className="login-desc">
        내가 입은 코디 사진을 태그로 정리하고, 태그 선택만으로 다시 찾아보는 개인용 아카이브예요.
      </p>

      {step === "email" && (
        <form onSubmit={handleRequestCode}>
          <div className="field">
            <label htmlFor="login-email">이메일</label>
            <input
              id="login-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          {message && (
            <div className={`status-banner ${message.type === "error" ? "error" : "success"}`}>
              {message.text}
            </div>
          )}
          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "처리 중..." : isMockMode ? "로그인" : "인증코드 받기"}
          </button>
        </form>
      )}

      {step === "code" && (
        <form onSubmit={handleVerifyCode}>
          <div className="field">
            <label htmlFor="login-code">인증코드 (6자리)</label>
            <input
              id="login-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="123456"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              required
            />
          </div>
          {message && (
            <div className={`status-banner ${message.type === "error" ? "error" : "success"}`}>
              {message.text}
            </div>
          )}
          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "확인 중..." : "로그인"}
          </button>
          <button
            type="button"
            className="btn-text btn-block"
            onClick={() => {
              setStep("email");
              setCode("");
              setMessage(null);
            }}
          >
            이메일 다시 입력하기
          </button>
        </form>
      )}

      <p className="login-hint">
        같은 이메일로 로그인하면 새 폰에서도 저장한 코디 사진을 다시 볼 수 있어요.
      </p>

      {isMockMode && (
        <div className="notice-box">
          지금은 Supabase가 연결되지 않아 테스트용 로그인으로 동작해요. 실제 서비스로 사용하려면
          관리자가 Supabase 설정을 완료해야 해요.
        </div>
      )}

      <div className="notice-box">
        사진과 태그 정보는 Supabase에 저장됩니다. 다만 어떤 서비스도 영구 보관을 100% 보장할 수
        없으므로, 중요한 원본 사진은 아이폰 갤러리나 별도 클라우드에도 보관해 주세요.
      </div>
    </div>
  );
}
