"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

interface ReferralStats {
  referralCode: string;
  referralCount: number;
  referredBy: string | null;
}

export default function ReferralPage() {
  const router = useRouter();
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [codeMsg, setCodeMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/auth"); return; }

      // Ensure referral row exists for this user
      let { data: row } = await supabase
        .from("referrals")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!row) {
        const code = generateCode(user.id);
        const { data: inserted } = await supabase
          .from("referrals")
          .insert({ user_id: user.id, referral_code: code, referral_count: 0, referred_by: null })
          .select()
          .single();
        row = inserted;
      }

      // Count how many users used this code
      const { count } = await supabase
        .from("referrals")
        .select("*", { count: "exact", head: true })
        .eq("referred_by", row?.referral_code ?? "");

      setStats({
        referralCode: row?.referral_code ?? "",
        referralCount: count ?? 0,
        referredBy: row?.referred_by ?? null,
      });
      setLoading(false);
    }
    load();
  }, [router]);

  function generateCode(userId: string): string {
    return "POSTLY-" + userId.slice(0, 8).toUpperCase();
  }

  async function copyLink() {
    const url = `${window.location.origin}/auth?ref=${stats?.referralCode}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSubmitCode() {
    if (!inputCode.trim()) return;
    setSubmitting(true);
    setCodeMsg("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Check code exists
    const { data: refRow } = await supabase
      .from("referrals")
      .select("user_id, referral_code")
      .eq("referral_code", inputCode.trim().toUpperCase())
      .single();

    if (!refRow) {
      setCodeMsg("❌ 유효하지 않은 추천 코드예요.");
      setSubmitting(false);
      return;
    }

    if (refRow.user_id === user.id) {
      setCodeMsg("❌ 본인 코드는 사용할 수 없어요.");
      setSubmitting(false);
      return;
    }

    // Check already used
    const { data: myRow } = await supabase
      .from("referrals")
      .select("referred_by")
      .eq("user_id", user.id)
      .single();

    if (myRow?.referred_by) {
      setCodeMsg("❌ 이미 추천 코드를 사용했어요.");
      setSubmitting(false);
      return;
    }

    // Apply
    await supabase
      .from("referrals")
      .update({ referred_by: inputCode.trim().toUpperCase() })
      .eq("user_id", user.id);

    setCodeMsg("✅ 추천 코드가 적용됐어요! 감사합니다 🎉");
    setStats((prev) => prev ? { ...prev, referredBy: inputCode.trim().toUpperCase() } : prev);
    setInputCode("");
    setSubmitting(false);
  }

  const rewards = [
    { milestone: 1, label: "1명 초대", reward: "이번 달 포스트 +5개", achieved: (stats?.referralCount ?? 0) >= 1 },
    { milestone: 3, label: "3명 초대", reward: "Pro 플랜 1개월 무료", achieved: (stats?.referralCount ?? 0) >= 3 },
    { milestone: 10, label: "10명 초대", reward: "Business 플랜 1개월 무료", achieved: (stats?.referralCount ?? 0) >= 10 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        <svg className="animate-spin h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  const referralUrl = typeof window !== "undefined"
    ? `${window.location.origin}/auth?ref=${stats?.referralCode}`
    : "";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">Postly</span>
          </div>
          <nav className="flex items-center gap-1 text-sm">
            <Link href="/dashboard" className="rounded-lg px-3 py-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">캘린더</Link>
            <Link href="/analytics" className="rounded-lg px-3 py-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">분석</Link>
            <Link href="/referral" className="rounded-lg px-3 py-1.5 font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950">친구초대</Link>
            <Link href="/settings" className="rounded-lg px-3 py-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">설정</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">

        {/* Hero */}
        <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white p-8 text-center shadow-lg mb-6">
          <div className="text-5xl mb-3">🎁</div>
          <h2 className="text-2xl font-bold mb-2">친구를 초대하고 혜택 받기</h2>
          <p className="text-indigo-200 text-sm">
            Postly를 친구에게 소개하세요. 초대한 친구가 가입하면 둘 다 혜택을 받아요!
          </p>
        </div>

        {/* My referral code */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6 shadow-sm mb-4">
          <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-1">내 추천 코드</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">아래 링크나 코드를 친구에게 공유하세요</p>

          {/* Code display */}
          <div className="flex items-center gap-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 px-4 py-3 mb-3">
            <span className="flex-1 font-mono text-lg font-bold text-indigo-700 dark:text-indigo-400 tracking-widest">
              {stats?.referralCode}
            </span>
            <button
              onClick={copyLink}
              className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
              {copied ? "복사됨 ✓" : "링크 복사"}
            </button>
          </div>

          {/* URL preview */}
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 truncate">{referralUrl}</p>

          {/* Stats */}
          <div className="mt-4 flex gap-4">
            <div className="flex-1 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-4 text-center">
              <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{stats?.referralCount ?? 0}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">초대한 친구</p>
            </div>
            <div className="flex-1 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-4 text-center">
              <p className="text-3xl font-bold text-indigo-600">
                {rewards.filter((r) => r.achieved).length}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">달성한 리워드</p>
            </div>
          </div>
        </div>

        {/* Rewards */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6 shadow-sm mb-4">
          <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-4">리워드 현황</h3>
          <div className="flex flex-col gap-3">
            {rewards.map((r) => (
              <div
                key={r.milestone}
                className={`flex items-center gap-4 rounded-xl border px-4 py-3 transition-colors ${
                  r.achieved
                    ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30"
                    : "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800"
                }`}
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm shrink-0 ${
                  r.achieved ? "bg-emerald-500 text-white" : "bg-zinc-200 dark:bg-zinc-700 text-zinc-400"
                }`}>
                  {r.achieved ? "✓" : r.milestone}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${r.achieved ? "text-emerald-700 dark:text-emerald-400" : "text-zinc-700 dark:text-zinc-300"}`}>
                    {r.label}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{r.reward}</p>
                </div>
                {r.achieved && (
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">달성!</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Enter referral code */}
        {!stats?.referredBy && (
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mb-1">추천 코드 입력</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">친구에게 받은 추천 코드를 입력하세요</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                placeholder="POSTLY-XXXXXXXX"
                className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm font-mono text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                onClick={handleSubmitCode}
                disabled={submitting || !inputCode.trim()}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                적용
              </button>
            </div>
            {codeMsg && (
              <p className="mt-2 text-xs font-medium text-zinc-600 dark:text-zinc-300">{codeMsg}</p>
            )}
          </div>
        )}

        {stats?.referredBy && (
          <div className="rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/30 p-5 text-center">
            <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-400">
              ✓ 추천 코드 <span className="font-mono">{stats.referredBy}</span> 적용됨
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
