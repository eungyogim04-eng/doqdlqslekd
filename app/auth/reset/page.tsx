"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase handles the token from the URL hash automatically
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("비밀번호는 6자리 이상이어야 합니다.");
      return;
    }
    if (password !== confirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError("비밀번호 변경에 실패했습니다. 링크가 만료되었을 수 있어요.");
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 2000);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
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
          <h2 className="text-lg font-bold text-zinc-900 mb-1">새 비밀번호 설정</h2>
          <p className="text-xs text-zinc-500 mb-6">새로 사용할 비밀번호를 입력해주세요.</p>

          {success ? (
            <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-4 text-sm text-green-700 text-center">
              비밀번호가 변경되었습니다. 대시보드로 이동합니다...
            </div>
          ) : !ready ? (
            <div className="text-center py-4">
              <div className="h-6 w-6 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mx-auto mb-3" />
              <p className="text-sm text-zinc-400">링크를 확인하는 중...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">새 비밀번호</label>
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
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1.5">비밀번호 확인</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="비밀번호 재입력"
                  required
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 border border-red-200 px-4 py-2.5 text-xs text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors disabled:opacity-60"
              >
                {loading ? "변경 중..." : "비밀번호 변경"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
