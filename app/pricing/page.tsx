"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";
import type { User } from "@supabase/supabase-js";

const plans = [
  {
    key: "free",
    name: "Free",
    price: "0",
    desc: "개인 사용자를 위한 무료 플랜",
    color: "border-zinc-200",
    badge: "",
    features: ["플랫폼 2개", "월 10개 예약", "캘린더 뷰", "기본 통계"],
    cta: "현재 플랜",
    ctaStyle: "border border-zinc-300 text-zinc-400 cursor-default",
    disabled: true,
  },
  {
    key: "pro",
    name: "Pro",
    price: "9",
    desc: "개인 크리에이터를 위한 플랜",
    color: "border-indigo-500 ring-2 ring-indigo-500",
    badge: "인기",
    features: ["플랫폼 무제한", "월 100개 예약", "AI 글쓰기", "분석 대시보드", "이미지 첨부"],
    cta: "Pro 시작하기",
    ctaStyle: "bg-indigo-600 text-white hover:bg-indigo-700",
    disabled: false,
  },
  {
    key: "business",
    name: "Business",
    price: "29",
    desc: "팀과 함께 사용하는 플랜",
    color: "border-zinc-200",
    badge: "",
    features: ["플랫폼 무제한", "월 무제한 예약", "팀 협업 기능", "우선 고객 지원"],
    cta: "Business 시작",
    ctaStyle: "border border-zinc-300 text-zinc-700 hover:bg-zinc-50",
    disabled: false,
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [currentPlan, setCurrentPlan] = useState("free");
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        setUser(data.user);
        const { data: profile } = await supabase
          .from("profiles")
          .select("plan")
          .eq("id", data.user.id)
          .single();
        if (profile?.plan) setCurrentPlan(profile.plan);
      }
    });
  }, []);

  async function handleUpgrade(planKey: string) {
    if (!user) { router.push("/auth"); return; }
    setLoading(planKey);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: planKey, userId: user.id, userEmail: user.email }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    setLoading(null);
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-zinc-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <span className="text-base font-bold text-zinc-900">Postly</span>
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              <Link href="/dashboard" className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">
                대시보드
              </Link>
            ) : (
              <Link href="/auth" className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">
                로그인
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-20">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-extrabold text-zinc-900 mb-3">심플한 가격</h1>
          <p className="text-zinc-500">숨겨진 비용 없이 투명하게. 언제든지 취소 가능.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrent = currentPlan === plan.key;
            return (
              <div key={plan.key} className={`rounded-2xl border bg-white p-7 shadow-sm relative ${plan.color}`}>
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
                    {plan.badge}
                  </span>
                )}
                {isCurrent && (
                  <span className="absolute -top-3 right-4 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
                    현재
                  </span>
                )}
                <p className="text-sm font-semibold text-zinc-500 mb-1">{plan.name}</p>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-4xl font-extrabold text-zinc-900">${plan.price}</span>
                  <span className="text-sm text-zinc-400 mb-1">/월</span>
                </div>
                <p className="text-xs text-zinc-400 mb-6">{plan.desc}</p>
                <ul className="space-y-2.5 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-zinc-700">
                      <svg className="h-4 w-4 text-indigo-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => !plan.disabled && !isCurrent && handleUpgrade(plan.key)}
                  disabled={plan.disabled || isCurrent || loading === plan.key}
                  className={`w-full rounded-xl py-2.5 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isCurrent ? "border border-emerald-300 text-emerald-600 cursor-default" : plan.ctaStyle}`}
                >
                  {loading === plan.key ? "처리 중..." : isCurrent ? "현재 플랜" : plan.cta}
                </button>
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-xs text-zinc-400">
          신용카드 필요 · 언제든지 취소 가능 · Stripe으로 안전하게 결제
        </p>
      </div>
    </div>
  );
}
