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
        setMessage("비밀번호 재설정 링크를 이메일로 보내드렸습니다. 이메일을 확인해주세요.");
      }
    }

    setLoading(false);
  }

  const titles: Record<Mode, string> = {
    login: "로그인",
    signup: "회원가입",
    forgot: "비밀번호 찾기",
  };

  const buttonLabels: Record<Mode, string> = {
    login: "로그인",
    signup: "회원가입",
    forgot: "재설정 링크 보내기",
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600">
            <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <span className="text-xl font-bold text-zinc-900">Postly</span>
        </Link>

        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-8">
          {mode !== "forgot" ? (
            <>
              {/* Login / Signup Tabs */}
              <div className="flex rounded-xl bg-zinc-100 p-1 mb-6">
                <button
                  onClick={() => { setMode("login"); reset(); }}
                  className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
                    mode === "login" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                  }`}
                >
                  로그인
                </button>
                <button
                  onClick={() => { setMode("signup"); reset(); }}
                  className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
                    mode === "signup" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
                  }`}
                >
                  회원가입
                </button>
              </div>
            </>
          ) : (
            <div className="mb-6">
              <button
                onClick={() => { setMode("login"); reset(); }}
                className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-600 transition-colors mb-4"
              >
                ← 로그인으로 돌아가기
              </button>
              <h2 className="text-lg font-bold text-zinc-900">비밀번호 찾기</h2>
              <p className="text-xs text-zinc-500 mt-1">가입한 이메일 주소를 입력하면 재설정 링크를 보내드려요.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@example.com"
                required
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            {mode !== "forgot" && (
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">비밀번호</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="6자리 이상"
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>
            )}

            {error && (
              <p className="rounded-lg bg-red-50 border border-red-200 px-4 py-2.5 text-xs text-red-600">{error}</p>
            )}
            {message && (
              <p className="rounded-lg bg-green-50 border border-green-200 px-4 py-2.5 text-xs text-green-600">{message}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 active:bg-indigo-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "처리 중..." : buttonLabels[mode]}
            </button>

            {mode === "login" && (
              <button
                type="button"
                onClick={() => { setMode("forgot"); reset(); }}
                className="w-full text-center text-xs text-zinc-400 hover:text-indigo-600 transition-colors"
              >
                비밀번호를 잊으셨나요?
              </button>
            )}
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-zinc-400">
          계속하면{" "}
          <Link href="/terms" className="underline hover:text-zinc-600">이용약관</Link>
          {" "}및{" "}
          <Link href="/privacy" className="underline hover:text-zinc-600">개인정보처리방침</Link>
          에 동의하는 것으로 간주됩니다.
        </p>
      </div>
    </div>
  );
}
