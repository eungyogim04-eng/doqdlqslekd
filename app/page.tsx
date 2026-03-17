import Link from "next/link";

const features = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    title: "캘린더 예약 관리",
    desc: "월별 캘린더로 포스트 일정을 한눈에 파악하고 쉽게 관리하세요.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    title: "AI 글쓰기",
    desc: "주제만 입력하면 AI가 플랫폼에 맞는 포스트를 자동으로 작성해드려요.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: "분석 대시보드",
    desc: "플랫폼별 예약 현황, 월별 트렌드 등 데이터를 시각화해서 보여드려요.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
      </svg>
    ),
    title: "3개 플랫폼 지원",
    desc: "Instagram, Twitter/X, YouTube 3개 플랫폼을 한 곳에서 관리하세요.",
  },
];

const plans = [
  {
    name: "Free",
    price: "0",
    desc: "개인 사용자를 위한 무료 플랜",
    color: "border-zinc-200",
    badge: "",
    features: [
      "플랫폼 2개",
      "월 10개 예약",
      "캘린더 뷰",
      "기본 통계",
    ],
    cta: "무료로 시작",
    ctaStyle: "border border-zinc-300 text-zinc-700 hover:bg-zinc-50",
  },
  {
    name: "Pro",
    price: "9",
    desc: "개인 크리에이터를 위한 플랜",
    color: "border-indigo-500 ring-2 ring-indigo-500",
    badge: "인기",
    features: [
      "플랫폼 무제한",
      "월 100개 예약",
      "AI 글쓰기",
      "분석 대시보드",
    ],
    cta: "Pro 시작하기",
    ctaStyle: "bg-indigo-600 text-white hover:bg-indigo-700",
  },
  {
    name: "Business",
    price: "29",
    desc: "팀과 함께 사용하는 플랜",
    color: "border-zinc-200",
    badge: "",
    features: [
      "플랫폼 무제한",
      "월 무제한 예약",
      "팀 협업 기능",
      "우선 고객 지원",
    ],
    cta: "Business 시작",
    ctaStyle: "border border-zinc-300 text-zinc-700 hover:bg-zinc-50",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="sticky top-0 z-10 border-b border-zinc-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
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
          <nav className="hidden sm:flex items-center gap-6 text-sm text-zinc-500">
            <a href="#features" className="hover:text-zinc-900 transition-colors">기능</a>
            <a href="#pricing" className="hover:text-zinc-900 transition-colors">가격</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/auth" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
              로그인
            </Link>
            <Link href="/auth" className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">
              무료 시작
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pt-20 pb-24 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600 mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
          AI 글쓰기 탑재
        </span>
        <h1 className="text-5xl font-extrabold text-zinc-900 tracking-tight mb-6 leading-tight">
          소셜 미디어 포스트,<br />
          <span className="text-indigo-600">한 곳에서 예약·관리</span>
        </h1>
        <p className="text-lg text-zinc-500 max-w-xl mx-auto mb-10">
          Instagram, Twitter/X, YouTube 포스트를 캘린더로 관리하고 AI로 글까지 자동 작성하세요. 지금 바로 무료로 시작할 수 있어요.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/auth" className="rounded-2xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
            무료로 시작하기 →
          </Link>
          <Link href="/dashboard" className="rounded-2xl border border-zinc-200 px-8 py-3.5 text-base font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors">
            데모 보기
          </Link>
        </div>
        <p className="mt-4 text-xs text-zinc-400">신용카드 불필요 · 무료 플랜 영구 제공</p>

        {/* App preview */}
        <div className="mt-16 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 shadow-xl shadow-zinc-100">
          <div className="rounded-xl bg-white border border-zinc-100 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-100 bg-zinc-50">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-amber-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
              <div className="mx-auto text-xs text-zinc-400">doqdlqslekd.vercel.app/dashboard</div>
            </div>
            <div className="grid grid-cols-4 gap-3 p-4">
              {[
                { label: "이번 달 예약", value: "12", color: "text-indigo-600" },
                { label: "오늘 예정", value: "3", color: "text-emerald-600" },
                { label: "Instagram", value: "5", color: "text-pink-600" },
                { label: "Twitter/X", value: "4", color: "text-sky-600" },
              ].map((card) => (
                <div key={card.label} className="rounded-xl border border-zinc-100 p-3 text-center">
                  <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{card.label}</p>
                </div>
              ))}
            </div>
            <div className="mx-4 mb-4 rounded-xl border border-zinc-100 bg-zinc-50 h-32 flex items-center justify-center">
              <p className="text-sm text-zinc-300">📅 캘린더 뷰</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-zinc-50 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-zinc-900 mb-3">필요한 기능, 다 있어요</h2>
            <p className="text-zinc-500">복잡한 설정 없이 바로 사용할 수 있어요.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl bg-white border border-zinc-200 p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-4">
                  {f.icon}
                </div>
                <h3 className="text-base font-semibold text-zinc-900 mb-2">{f.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-zinc-900 mb-3">심플한 가격</h2>
            <p className="text-zinc-500">숨겨진 비용 없이 투명하게.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div key={plan.name} className={`rounded-2xl border bg-white p-7 shadow-sm relative ${plan.color}`}>
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
                    {plan.badge}
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
                <Link href="/auth" className={`block w-full rounded-xl py-2.5 text-center text-sm font-semibold transition-colors ${plan.ctaStyle}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 py-20">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">지금 바로 시작하세요</h2>
          <p className="text-indigo-200 mb-8">무료로 가입하고 소셜 미디어 관리를 훨씬 쉽게 만들어보세요.</p>
          <Link href="/auth" className="inline-block rounded-2xl bg-white px-8 py-3.5 text-base font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors shadow-lg">
            무료로 시작하기 →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100 py-8">
        <div className="mx-auto max-w-5xl px-6 flex items-center justify-between text-sm text-zinc-400">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600">
              <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <span className="font-semibold text-zinc-600">Postly</span>
          </div>
          <p>© 2026 Postly. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
