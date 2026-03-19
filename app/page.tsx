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
    desc: "월·주·일 캘린더로 포스트 일정을 한눈에 파악하세요. 드래그 앤 드롭으로 일정을 자유롭게 조정할 수 있어요.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    title: "AI 글쓰기",
    desc: "주제만 입력하면 Claude AI가 플랫폼 특성에 맞는 글을 자동 작성해드려요. 해시태그 추천까지 한 번에.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: "분석 대시보드",
    desc: "플랫폼별 예약 현황, 월별 트렌드, 요일별 분포를 시각화해서 보여드려요. 더 스마트한 콘텐츠 전략을 세우세요.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
      </svg>
    ),
    title: "3개 플랫폼 지원",
    desc: "Instagram, Twitter/X, YouTube 3개 플랫폼을 한 곳에서 관리하세요. 플랫폼마다 다른 앱을 쓸 필요가 없어요.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    title: "팀 협업",
    desc: "팀원을 초대하고 포스트 승인 워크플로우를 운영하세요. 브랜드 목소리를 일관되게 유지할 수 있어요.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "반복 예약",
    desc: "매일, 매주, 매월 반복 포스트를 한 번에 예약하세요. 꾸준한 콘텐츠 발행이 훨씬 쉬워집니다.",
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
      "플랫폼 2개 (Instagram, Twitter)",
      "월 10개 예약",
      "캘린더 뷰 (월·주·일)",
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
      "플랫폼 무제한 (YouTube 포함)",
      "월 100개 예약",
      "AI 글쓰기 & 해시태그 추천",
      "분석 대시보드",
      "AI 최적 게시 시간 추천",
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
      "팀 협업 & 승인 워크플로우",
      "전담 고객 지원",
      "Pro 모든 기능 포함",
    ],
    cta: "Business 시작",
    ctaStyle: "border border-zinc-300 text-zinc-700 hover:bg-zinc-50",
  },
];

const testimonials = [
  {
    name: "김지수",
    role: "패션 인플루언서",
    avatar: "K",
    avatarColor: "bg-pink-500",
    content: "Postly 덕분에 매일 아침 SNS 올리던 스트레스가 사라졌어요. 일주일치를 한 번에 예약해두면 자동으로 올라가니까 정말 편해요. AI 글쓰기도 생각보다 퀄리티가 높아서 놀랐어요.",
  },
  {
    name: "박민준",
    role: "스타트업 마케터",
    avatar: "P",
    avatarColor: "bg-indigo-500",
    content: "인스타, 트위터, 유튜브를 따로따로 관리하다가 Postly로 통합했더니 업무 시간이 반으로 줄었어요. 팀원들과 포스트 승인하는 기능도 너무 유용해요.",
  },
  {
    name: "이수진",
    role: "뷰티 크리에이터",
    avatar: "L",
    avatarColor: "bg-emerald-500",
    content: "처음엔 무료 플랜으로 써봤는데 너무 좋아서 바로 Pro로 업그레이드했어요. 분석 대시보드에서 어떤 요일에 포스트가 잘 되는지 보이니까 전략적으로 운영할 수 있게 됐어요.",
  },
];

const faqs = [
  {
    q: "무료 플랜에서 유료 플랜으로 언제든 업그레이드할 수 있나요?",
    a: "네, 언제든지 업그레이드할 수 있어요. 업그레이드하면 즉시 추가 기능을 사용할 수 있고, 기존에 예약한 포스트도 그대로 유지됩니다.",
  },
  {
    q: "실제로 소셜 미디어에 자동으로 포스트가 올라가나요?",
    a: "현재는 일정 예약 및 관리 기능을 제공하며, 자동 발행 기능은 순차적으로 추가 중입니다. Twitter/X 자동 발행이 먼저 지원될 예정이에요.",
  },
  {
    q: "AI 글쓰기는 어떤 AI를 사용하나요?",
    a: "Anthropic의 Claude AI를 사용해요. 플랫폼 특성에 맞는 글을 작성해주고, 해시태그 추천과 최적 게시 시간도 AI가 분석해드려요.",
  },
  {
    q: "구독을 취소하면 데이터가 삭제되나요?",
    a: "구독을 취소해도 예약한 포스트 데이터는 삭제되지 않아요. 무료 플랜으로 다운그레이드되며, 무료 플랜 한도 내에서 계속 사용 가능해요.",
  },
  {
    q: "팀 기능은 몇 명까지 사용할 수 있나요?",
    a: "Business 플랜에서 팀 기능을 제공하며, 팀원 수 제한 없이 초대할 수 있어요. 각 팀원의 포스트 승인 워크플로우도 설정할 수 있어요.",
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
            <a href="#testimonials" className="hover:text-zinc-900 transition-colors">후기</a>
            <Link href="/pricing" className="hover:text-zinc-900 transition-colors">가격</Link>
            <a href="#faq" className="hover:text-zinc-900 transition-colors">FAQ</a>
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
          Claude AI 글쓰기 탑재
        </span>
        <h1 className="text-5xl font-extrabold text-zinc-900 tracking-tight mb-6 leading-tight">
          소셜 미디어 포스트,<br />
          <span className="text-indigo-600">한 곳에서 예약·관리</span>
        </h1>
        <p className="text-lg text-zinc-500 max-w-xl mx-auto mb-10">
          Instagram, Twitter/X, YouTube 포스트를 캘린더로 관리하고 AI로 글까지 자동 작성하세요. 콘텐츠 크리에이터를 위한 가장 똑똑한 스케줄러.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/auth" className="rounded-2xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
            무료로 시작하기 →
          </Link>
          <Link href="/dashboard" className="rounded-2xl border border-zinc-200 px-8 py-3.5 text-base font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors">
            데모 보기
          </Link>
        </div>
        <p className="mt-4 text-xs text-zinc-400">신용카드 불필요 · 무료 플랜 영구 제공 · 언제든 취소 가능</p>

        {/* Social proof */}
        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-zinc-400">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {["bg-pink-400", "bg-indigo-400", "bg-emerald-400", "bg-amber-400"].map((c, i) => (
                <div key={i} className={`h-7 w-7 rounded-full ${c} border-2 border-white`} />
              ))}
            </div>
            <span>1,200+ 크리에이터가 사용 중</span>
          </div>
          <div className="hidden sm:flex items-center gap-1">
            {"★★★★★".split("").map((s, i) => <span key={i} className="text-amber-400">{s}</span>)}
            <span className="ml-1">4.9/5</span>
          </div>
        </div>

        {/* App preview */}
        <div className="mt-16 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 shadow-xl shadow-zinc-100">
          <div className="rounded-xl bg-white border border-zinc-100 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-100 bg-zinc-50">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-amber-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
              <div className="mx-auto text-xs text-zinc-400">postly.app/dashboard</div>
            </div>
            <div className="grid grid-cols-4 gap-3 p-4">
              {[
                { label: "이번 달 예약", value: "24", color: "text-indigo-600" },
                { label: "오늘 예정", value: "3", color: "text-emerald-600" },
                { label: "Instagram", value: "11", color: "text-pink-600" },
                { label: "Twitter/X", value: "9", color: "text-sky-600" },
              ].map((card) => (
                <div key={card.label} className="rounded-xl border border-zinc-100 p-3 text-center">
                  <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{card.label}</p>
                </div>
              ))}
            </div>
            <div className="mx-4 mb-4 rounded-xl border border-zinc-100 bg-zinc-50 overflow-hidden">
              {/* Mini calendar mock */}
              <div className="grid grid-cols-7 gap-px bg-zinc-100">
                {["일","월","화","수","목","금","토"].map(d => (
                  <div key={d} className="bg-zinc-50 text-center py-1 text-[10px] text-zinc-400 font-medium">{d}</div>
                ))}
                {[...Array(35)].map((_, i) => {
                  const day = i - 3;
                  const hasPost = [4, 8, 11, 15, 18, 22, 25].includes(i);
                  const isToday = i === 22;
                  return (
                    <div key={i} className={`bg-white relative py-2 text-center text-xs ${day < 1 || day > 31 ? 'text-zinc-200' : isToday ? 'text-indigo-600 font-bold' : 'text-zinc-600'}`}>
                      {day > 0 && day <= 31 ? day : ''}
                      {hasPost && day > 0 && day <= 31 && (
                        <div className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full ${isToday ? 'bg-indigo-500' : 'bg-pink-400'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl bg-white border border-zinc-200 p-6 shadow-sm hover:shadow-md transition-shadow">
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

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-zinc-900 mb-3">크리에이터들의 이야기</h2>
            <p className="text-zinc-500">Postly를 사용하는 분들의 실제 후기예요.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-1">
                  {"★★★★★".split("").map((s, i) => <span key={i} className="text-amber-400 text-sm">{s}</span>)}
                </div>
                <p className="text-sm text-zinc-600 leading-relaxed flex-1">&ldquo;{t.content}&rdquo;</p>
                <div className="flex items-center gap-3 pt-2 border-t border-zinc-100">
                  <div className={`h-9 w-9 rounded-full ${t.avatarColor} flex items-center justify-center text-white text-sm font-bold`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">{t.name}</p>
                    <p className="text-xs text-zinc-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-zinc-50 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-zinc-900 mb-3">심플한 가격</h2>
            <p className="text-zinc-500">숨겨진 비용 없이 투명하게. 언제든 취소할 수 있어요.</p>
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
                    <li key={f} className="flex items-start gap-2 text-sm text-zinc-700">
                      <svg className="h-4 w-4 text-indigo-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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
          <p className="text-center mt-8 text-sm text-zinc-400">
            모든 플랜 30일 환불 보장 · 연간 결제 시 2개월 무료
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-zinc-900 mb-3">자주 묻는 질문</h2>
            <p className="text-zinc-500">궁금한 점이 있으시면 언제든지 문의해주세요.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-zinc-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 py-20">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">지금 바로 시작하세요</h2>
          <p className="text-indigo-200 mb-8">무료로 가입하고 소셜 미디어 관리를 훨씬 쉽게 만들어보세요.<br className="hidden sm:block" />신용카드 없이도 시작할 수 있어요.</p>
          <Link href="/auth" className="inline-block rounded-2xl bg-white px-8 py-3.5 text-base font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors shadow-lg">
            무료로 시작하기 →
          </Link>
          <p className="mt-4 text-xs text-indigo-300">이미 1,200명 이상의 크리에이터가 사용 중이에요</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100 py-12">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
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
              <p className="text-xs text-zinc-400">소셜 미디어 스케줄러 · 크리에이터를 위한 도구</p>
            </div>
            <nav className="flex flex-wrap gap-6 text-sm text-zinc-400">
              <a href="#features" className="hover:text-zinc-600 transition-colors">기능</a>
              <Link href="/pricing" className="hover:text-zinc-600 transition-colors">가격</Link>
              <a href="#faq" className="hover:text-zinc-600 transition-colors">FAQ</a>
              <Link href="/privacy" className="hover:text-zinc-600 transition-colors">개인정보처리방침</Link>
              <Link href="/terms" className="hover:text-zinc-600 transition-colors">이용약관</Link>
            </nav>
          </div>
          <div className="mt-8 pt-6 border-t border-zinc-100 text-center text-xs text-zinc-400">
            © 2026 Postly. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
