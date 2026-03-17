"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: 0,
    description: "개인 사용자를 위한 무료 플랜",
    features: ["플랫폼 2개", "월 10개 예약", "기본 캘린더", "이메일 지원"],
    priceId: null,
    cta: "무료로 시작",
    highlight: false,
  },
  {
    name: "Pro",
    price: 9,
    description: "성장하는 크리에이터를 위한 플랜",
    features: ["플랫폼 무제한", "월 100개 예약", "AI 글쓰기", "분석 대시보드", "우선 지원"],
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || "price_1TBy1uPEWcKrOZ8abJ0kzZ1A",
    cta: "Pro 시작하기",
    highlight: true,
  },
  {
    name: "Business",
    price: 29,
    description: "팀과 함께 성장하는 비즈니스 플랜",
    features: ["플랫폼 무제한", "월 무제한 예약", "AI 글쓰기", "분석 리포트", "팀 협업 기능", "전담 지원"],
    priceId: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID || "price_1TBy2MPEWcKrOZ8azo0arjGv",
    cta: "Business 시작하기",
    highlight: false,
  },
];

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleCheckout(priceId: string | null, planName: string) {
    if (!priceId) {
      router.push("/auth");
      return;
    }

    setLoading(planName);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, userId: user.id, userEmail: user.email }),
      });

      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (err) {
      alert("결제 페이지 이동 실패. 다시 시도해주세요.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600">
          <span className="bg-indigo-600 text-white rounded-lg px-2 py-0.5 text-sm">P</span>
          Postly
        </Link>
        <Link href="/dashboard" className="text-sm text-zinc-600 hover:text-zinc-900">
          대시보드 →
        </Link>
      </header>

      {/* Hero */}
      <div className="text-center py-16 px-4">
        <h1 className="text-4xl font-bold text-zinc-900 mb-4">
          심플한 가격, 강력한 기능
        </h1>
        <p className="text-zinc-500 text-lg max-w-xl mx-auto">
          무료로 시작하고, 성장에 맞춰 업그레이드하세요.
        </p>
      </div>

      {/* Plans */}
      <div className="max-w-5xl mx-auto px-4 pb-24 grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl border p-8 flex flex-col ${
              plan.highlight
                ? "border-indigo-500 bg-indigo-600 text-white shadow-xl shadow-indigo-200 scale-105"
                : "border-zinc-200 bg-white text-zinc-800 shadow-sm"
            }`}
          >
            {plan.highlight && (
              <span className="text-xs font-bold bg-white text-indigo-600 rounded-full px-3 py-1 w-fit mb-4">
                가장 인기
              </span>
            )}
            <h2 className={`text-2xl font-bold mb-1 ${plan.highlight ? "text-white" : "text-zinc-900"}`}>
              {plan.name}
            </h2>
            <p className={`text-sm mb-6 ${plan.highlight ? "text-indigo-200" : "text-zinc-500"}`}>
              {plan.description}
            </p>
            <div className="mb-6">
              <span className={`text-4xl font-bold ${plan.highlight ? "text-white" : "text-zinc-900"}`}>
                ${plan.price}
              </span>
              <span className={`text-sm ${plan.highlight ? "text-indigo-200" : "text-zinc-400"}`}>/월</span>
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <span className={`text-lg ${plan.highlight ? "text-indigo-200" : "text-indigo-500"}`}>✓</span>
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleCheckout(plan.priceId, plan.name)}
              disabled={loading === plan.name}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                plan.highlight
                  ? "bg-white text-indigo-600 hover:bg-indigo-50"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              } disabled:opacity-50`}
            >
              {loading === plan.name ? "처리 중..." : plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
