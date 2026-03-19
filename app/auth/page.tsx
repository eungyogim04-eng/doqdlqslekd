"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import Link from "next/link";

type Mode = "login" | "signup" | "forgot";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function reset() {
    setError("");
    setMessage("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    reset();
    setLoading(true);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else {
        router.push("/dashboard");
      }
    } else if (mode === "signup") {
      if (password.length < 6) {
        setError("비밀번호는 6자리 이상이어야 합니다.");
        setLoading(false);
        return;
      }
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        if (error.message.includes("already registered")) {
          setError("이미 가입된 이메일입니다. 로그인을 시도해보세요.");
        } else {
          setError("회원가입에 실패했습니다. 다시 시도해 주세요.");
        }
      } else {
        setMessage("이메일을 확인해 주세요! 인증 링크를 보내드렸습니다.");
      }
    } else if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset`,
      });
      if (error) {
        setError("비밀번호 재설정 이메일 발송에 실패했습니다. 다시 시도해 주세요.");
      } else {
        setMessage("비밀번호 재설정 링크를 이메일로 보내드렸습니다.");
      }
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* Left — brand panel */}
      <div
        className="hidden lg:flex flex-col justify-between bg-zinc-950 p-12"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 60% at 30% 40%, rgba(99,102,241,0.14) 0%, transparent 70%)",
          }}
        />
        <Link href="/" className="relative text-xl font-bold text-white">
          Postly
        </Link>

        <div className="relative">
          <p className="text-4xl font-bold text-white leading-tight mb-6">
            소셜 미디어 관리,
            <br />
            <span className="text-zinc-500">이제 한 곳에서.</span>
          </p>
          <div className="space-y-4">
            {[
              "세 플랫폼 포스트를 캘린더 하나로 관리",
              "AI가 플랫폼 맞춤 글을 자동으로 작성",
              "팀 협업 & 포스트 승인 워크플로우",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0" />
                <p className="text-sm text-zinc-400">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <p className="text-sm text-zinc-600 italic">
            &ldquo;일주일치 포스트를 한 번에 예약해두면 자동으로 올라가니까 정말 편해요.&rdquo;
          </p>
          <p className="text-xs text-zinc-700 mt-2">김지수 · 패션 인플루언서</p>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="flex flex-col items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <Link href="/" className="flex lg:hidden justify-center mb-10 text-xl font-bold text-zinc-900">
            Postly
          </Link>

          {mode === "forgot" ? (
            <div className="mb-8">
              <button
                onClick={() => { setMode("login"); reset(); }}
                className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-600 transition-colors mb-6"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                로그인으로 돌아가기
              </button>
              <h1 className="text-2xl font-bold text-zinc-900">비밀번호 찾기</h1>
              <p className="text-sm text-zinc-500 mt-2">가입한 이메일 주소를 입력하면 재설정 링크를 보내드려요.</p>
            </div>
          ) : (
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-zinc-900 mb-1">
                {mode === "login" ? "다시 만나서 반가워요" : "계정 만들기"}
              </h1>
              <p className="text-sm text-zinc-500">
                {mode === "login" ? (
                  <>
                    처음 오셨나요?{" "}
                    <button
                      type="button"
                      onClick={() => { setMode("signup"); reset(); }}
                      className="text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
                    >
                      무료로 가입하기
                    </button>
                  </>
                ) : (
                  <>
                    이미 계정이 있나요?{" "}
                    <button
                      type="button"
                      onClick={() => { setMode("login"); reset(); }}
                      className="text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
                    >
                      로그인
                    </button>
                  </>
                )}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-2">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@example.com"
                required
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            {mode !== "forgot" && (
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-2">비밀번호</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="6자리 이상"
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
                <svg className="h-4 w-4 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}
            {message && (
              <div className="flex items-start gap-2.5 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3">
                <svg className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <p className="text-xs text-emerald-600">{message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white hover:bg-zinc-700 active:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  처리 중...
                </span>
              ) : mode === "login" ? "로그인" : mode === "signup" ? "회원가입" : "재설정 링크 보내기"}
            </button>

            {mode === "login" && (
              <button
                type="button"
                onClick={() => { setMode("forgot"); reset(); }}
                className="w-full text-center text-xs text-zinc-400 hover:text-zinc-600 transition-colors pt-1"
              >
                비밀번호를 잊으셨나요?
              </button>
            )}
          </form>

          <p className="mt-8 text-center text-xs text-zinc-400">
            계속하면{" "}
            <Link href="/terms" className="underline underline-offset-2 hover:text-zinc-600">이용약관</Link>
            {" "}및{" "}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-zinc-600">개인정보처리방침</Link>
            에 동의하는 것으로 간주됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
