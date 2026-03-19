"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import type { User } from "@supabase/supabase-js";

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userPlan, setUserPlan] = useState<"free" | "pro" | "business">("free");

  // Password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");

  // Email change
  const [newEmail, setNewEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");

  // Delete account
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteText, setDeleteText] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/auth");
      } else {
        setUser(data.user);
        setLoading(false);
      }
    });
  }, [router]);

  useEffect(() => {
    if (!user) return;
    supabase.from("user_plans").select("plan").eq("user_id", user.id).single().then(({ data }) => {
      if (data?.plan) setUserPlan(data.plan as "free" | "pro" | "business");
    });
  }, [user]);

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");

    if (newPassword.length < 6) {
      setPwError("새 비밀번호는 6자리 이상이어야 합니다.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    setPwLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setPwError("비밀번호 변경에 실패했습니다. 다시 로그인 후 시도해주세요.");
    } else {
      setPwSuccess("비밀번호가 성공적으로 변경되었습니다.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    setPwLoading(false);
  }

  async function handleEmailChange(e: React.FormEvent) {
    e.preventDefault();
    setEmailError("");
    setEmailSuccess("");

    if (!newEmail || !newEmail.includes("@")) {
      setEmailError("올바른 이메일 주소를 입력해주세요.");
      return;
    }

    setEmailLoading(true);
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) {
      setEmailError("이메일 변경에 실패했습니다. 다시 시도해주세요.");
    } else {
      setEmailSuccess("확인 이메일을 발송했습니다. 새 이메일을 확인해주세요.");
      setNewEmail("");
    }
    setEmailLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/auth");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  const PLAN_LABELS: Record<string, string> = {
    free: "무료",
    pro: "Pro",
    business: "Business",
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <span className="text-base font-bold text-zinc-900">Postly</span>
          </div>

          <nav className="flex items-center gap-1 text-sm">
            <Link href="/dashboard" className="rounded-lg px-3 py-1.5 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 transition-colors">캘린더</Link>
            <Link href="/analytics" className="rounded-lg px-3 py-1.5 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 transition-colors">분석</Link>
            <Link href="/team" className="rounded-lg px-3 py-1.5 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100 transition-colors">팀</Link>
            <Link href="/settings" className="rounded-lg px-3 py-1.5 font-medium text-indigo-600 bg-indigo-50">설정</Link>
          </nav>

          <div className="flex items-center gap-3">
            {user && (
              <span className="hidden sm:block text-xs text-zinc-500 truncate max-w-[140px]">{user.email}</span>
            )}
            <button
              onClick={handleLogout}
              className="rounded-xl border border-zinc-200 bg-white px-4 py-1.5 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold text-zinc-900 mb-6">계정 설정</h1>

        {/* Account Info */}
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-6 mb-4">
          <h2 className="text-sm font-semibold text-zinc-800 mb-4">계정 정보</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-zinc-500">이메일</span>
              <span className="text-sm font-medium text-zinc-800">{user?.email}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-zinc-100">
              <span className="text-sm text-zinc-500">현재 플랜</span>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold ${
                  userPlan === "pro" ? "text-indigo-600" :
                  userPlan === "business" ? "text-purple-600" :
                  "text-zinc-600"
                }`}>
                  {PLAN_LABELS[userPlan]} 플랜
                </span>
                {userPlan === "free" && (
                  <Link href="/pricing" className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full hover:bg-indigo-700 transition-colors">
                    업그레이드
                  </Link>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-zinc-100">
              <span className="text-sm text-zinc-500">가입일</span>
              <span className="text-sm text-zinc-600">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString("ko-KR") : "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Email Change */}
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-6 mb-4">
          <h2 className="text-sm font-semibold text-zinc-800 mb-4">이메일 변경</h2>
          <form onSubmit={handleEmailChange} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">새 이메일 주소</label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="new@example.com"
                required
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
            {emailError && (
              <p className="rounded-lg bg-red-50 border border-red-200 px-4 py-2.5 text-xs text-red-600">{emailError}</p>
            )}
            {emailSuccess && (
              <p className="rounded-lg bg-green-50 border border-green-200 px-4 py-2.5 text-xs text-green-600">{emailSuccess}</p>
            )}
            <button
              type="submit"
              disabled={emailLoading}
              className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors disabled:opacity-60"
            >
              {emailLoading ? "처리 중..." : "이메일 변경"}
            </button>
          </form>
        </div>

        {/* Password Change */}
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-6 mb-4">
          <h2 className="text-sm font-semibold text-zinc-800 mb-4">비밀번호 변경</h2>
          <form onSubmit={handlePasswordChange} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">새 비밀번호</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="6자리 이상"
                required
                minLength={6}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">새 비밀번호 확인</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호 재입력"
                required
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
            {pwError && (
              <p className="rounded-lg bg-red-50 border border-red-200 px-4 py-2.5 text-xs text-red-600">{pwError}</p>
            )}
            {pwSuccess && (
              <p className="rounded-lg bg-green-50 border border-green-200 px-4 py-2.5 text-xs text-green-600">{pwSuccess}</p>
            )}
            <button
              type="submit"
              disabled={pwLoading}
              className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors disabled:opacity-60"
            >
              {pwLoading ? "처리 중..." : "비밀번호 변경"}
            </button>
          </form>
        </div>

        {/* Notifications */}
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-6 mb-4">
          <h2 className="text-sm font-semibold text-zinc-800 mb-4">알림 설정</h2>
          <div className="space-y-3">
            {[
              { label: "예약 포스트 발행 알림", desc: "포스트가 발행될 때 이메일로 알려드려요" },
              { label: "주간 리포트", desc: "매주 월요일 지난 주 포스트 현황을 보내드려요" },
              { label: "플랜 한도 알림", desc: "월 예약 한도 80% 도달 시 알려드려요" },
            ].map((item, i) => (
              <label key={i} className="flex items-center justify-between cursor-pointer py-2 border-b border-zinc-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-zinc-800">{item.label}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{item.desc}</p>
                </div>
                <div className="relative">
                  <input type="checkbox" className="sr-only peer" defaultChecked={i === 0} />
                  <div className="w-10 h-5 bg-zinc-200 peer-checked:bg-indigo-600 rounded-full transition-colors peer-focus:ring-2 peer-focus:ring-indigo-500 peer-focus:ring-offset-1" />
                  <div className="absolute left-0.5 top-0.5 h-4 w-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Danger zone */}
        <div className="rounded-2xl border border-red-200 bg-white shadow-sm p-6">
          <h2 className="text-sm font-semibold text-red-700 mb-1">위험 구역</h2>
          <p className="text-xs text-zinc-500 mb-4">계정을 삭제하면 모든 포스트 데이터가 영구적으로 삭제됩니다.</p>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="rounded-xl border border-red-300 px-5 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
            >
              계정 삭제
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-zinc-600">계정 삭제를 확인하려면 <strong>DELETE</strong>를 입력하세요.</p>
              <input
                type="text"
                value={deleteText}
                onChange={(e) => setDeleteText(e.target.value)}
                placeholder="DELETE"
                className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => { setShowDeleteConfirm(false); setDeleteText(""); }}
                  className="rounded-xl border border-zinc-200 px-5 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition-colors"
                >
                  취소
                </button>
                <button
                  disabled={deleteText !== "DELETE"}
                  className="rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  계정 영구 삭제
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
