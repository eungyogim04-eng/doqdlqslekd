import Link from "next/link";

const features = [
  {
    eyebrow: "스케줄링",
    title: "캘린더 하나로 세 플랫폼 관리",
    desc: "월·주·일 캘린더에서 Instagram, Twitter/X, YouTube 포스트를 한눈에 확인하세요. 드래그 앤 드롭으로 일정을 즉시 변경할 수 있어요.",
    visual: (
      <div className="rounded-xl bg-zinc-950 p-4 font-mono text-xs">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-2 w-2 rounded-full bg-red-500" />
          <div className="h-2 w-2 rounded-full bg-yellow-500" />
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span className="ml-2 text-zinc-500 text-[10px]">postly / calendar</span>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["일","월","화","수","목","금","토"].map(d => (
            <div key={d} className="text-center text-zinc-600 text-[9px] py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({length: 35}, (_, i) => {
            const day = i - 2;
            const dots: {color: string}[] = [];
            if ([4,5,11,18,25].includes(i)) dots.push({color: "bg-pink-500"});
            if ([6,13,20,27].includes(i)) dots.push({color: "bg-sky-500"});
            if ([10,17,24].includes(i)) dots.push({color: "bg-red-500"});
            const isToday = i === 18;
            return (
              <div key={i} className={`rounded py-1.5 text-center text-[9px] relative ${isToday ? "bg-indigo-600 text-white" : day < 1 || day > 31 ? "text-zinc-700" : "text-zinc-400"}`}>
                {day > 0 && day <= 31 ? day : ""}
                {dots.length > 0 && !isToday && (
                  <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-px">
                    {dots.map((d, di) => <div key={di} className={`h-1 w-1 rounded-full ${d.color}`} />)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    ),
  },
  {
    eyebrow: "AI 글쓰기",
    title: "주제만 입력하면 글이 완성돼요",
    desc: "Claude AI가 플랫폼 특성에 맞는 글을 자동으로 작성해드려요. 해시태그 추천, 최적 게시 시간 분석까지 한 번에.",
    visual: (
      <div className="rounded-xl bg-zinc-950 p-4 space-y-3">
        <div className="rounded-lg bg-white/5 border border-white/10 p-3">
          <p className="text-zinc-500 text-[10px] mb-1.5">주제</p>
          <p className="text-zinc-300 text-xs">봄 신상품 출시 이벤트 안내</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-indigo-400">
          <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Claude AI 작성 중...
        </div>
        <div className="rounded-lg bg-indigo-950/50 border border-indigo-900 p-3">
          <p className="text-zinc-300 text-xs leading-relaxed">🌸 봄이 찾아왔습니다! 기다리고 기다리던 신상품이 드디어 출시됩니다. 이번 시즌 가장 트렌디한 컬러와 감각적인 디자인으로 여러분을 찾아갑니다...</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {["#봄신상", "#신제품출시", "#패션"].map(t => (
              <span key={t} className="text-indigo-400 text-[9px]">{t}</span>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    eyebrow: "분석",
    title: "무엇이 잘 되고 있는지 한눈에",
    desc: "플랫폼별 예약 현황, 월별 트렌드, 요일별 발행 패턴을 시각화해서 보여드려요. 데이터 기반으로 더 스마트한 콘텐츠 전략을 세우세요.",
    visual: (
      <div className="rounded-xl bg-zinc-950 p-4">
        <div className="flex items-end gap-1.5 h-20 mb-3">
          {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 65].map((h, i) => (
            <div key={i} className="flex-1 rounded-sm" style={{height: `${h}%`, background: i === 10 ? "#6366f1" : `rgba(99,102,241,${0.2 + i * 0.04})`}} />
          ))}
        </div>
        <div className="flex justify-between text-[9px] text-zinc-600">
          {["1월","3월","5월","7월","9월","11월"].map(m => <span key={m}>{m}</span>)}
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            {label:"Instagram", value:"11", color:"text-pink-400"},
            {label:"Twitter", value:"9", color:"text-sky-400"},
            {label:"YouTube", value:"4", color:"text-red-400"},
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className={`text-base font-bold ${s.color}`}>{s.value}</p>
              <p className="text-zinc-600 text-[9px]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

const plans = [
  {
    name: "Free",
    price: "0",
    desc: "개인 사용자를 위한 시작 플랜",
    featured: false,
    features: [
      "Instagram, Twitter 2개 플랫폼",
      "월 10개 포스트 예약",
      "캘린더 뷰 (월·주·일)",
      "기본 통계",
    ],
    cta: "무료로 시작",
  },
  {
    name: "Pro",
    price: "9",
    desc: "개인 크리에이터에게 딱 맞는 플랜",
    featured: true,
    features: [
      "YouTube 포함 3개 플랫폼",
      "월 100개 포스트 예약",
      "AI 글쓰기 & 해시태그 추천",
      "분석 대시보드",
      "AI 최적 게시 시간",
    ],
    cta: "Pro 시작하기",
  },
  {
    name: "Business",
    price: "29",
    desc: "팀이 함께 쓰는 브랜드 플랜",
    featured: false,
    features: [
      "무제한 플랫폼",
      "무제한 포스트 예약",
      "팀 협업 & 승인 워크플로우",
      "전담 고객 지원",
      "Pro 모든 기능 포함",
    ],
    cta: "팀으로 시작",
  },
];

const testimonials = [
  {
    quote: "일주일치 포스트를 한 번에 예약해두면 자동으로 올라가니까 정말 편해요. AI 글쓰기도 퀄리티가 생각보다 훨씬 높아요.",
    name: "김지수",
    role: "패션 인플루언서",
  },
  {
    quote: "인스타, 트위터, 유튜브를 따로 관리하다가 Postly로 통합했더니 업무 시간이 반으로 줄었어요.",
    name: "박민준",
    role: "스타트업 마케터",
  },
  {
    quote: "분석 대시보드에서 어떤 요일이 잘 되는지 보이니까 전략적으로 콘텐츠를 운영할 수 있게 됐어요.",
    name: "이수진",
    role: "뷰티 크리에이터",
  },
];

const faqs = [
  {
    q: "무료 플랜에서 유료로 언제든 업그레이드할 수 있나요?",
    a: "네, 언제든 업그레이드 가능해요. 즉시 추가 기능을 이용할 수 있고 기존 예약 포스트도 유지됩니다.",
  },
  {
    q: "실제로 소셜 미디어에 자동으로 포스트가 올라가나요?",
    a: "현재는 일정 예약 및 관리 기능을 제공하며, 자동 발행 기능은 순차적으로 추가 중입니다. Twitter/X 자동 발행이 먼저 지원될 예정이에요.",
  },
  {
    q: "AI 글쓰기는 어떤 AI를 사용하나요?",
    a: "Anthropic의 Claude AI를 사용해요. 플랫폼 특성에 맞는 글과 해시태그 추천, 최적 게시 시간도 AI가 분석해드려요.",
  },
  {
    q: "구독을 취소하면 데이터가 삭제되나요?",
    a: "취소해도 포스트 데이터는 삭제되지 않아요. 무료 플랜으로 다운그레이드되며 무료 한도 내에서 계속 사용 가능해요.",
  },
  {
    q: "팀 기능은 몇 명까지 사용할 수 있나요?",
    a: "Business 플랜에서 팀원 수 제한 없이 초대할 수 있어요. 각 팀원의 포스트 승인 워크플로우도 설정할 수 있어요.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Navigation */}
      <header className="fixed top-0 z-20 w-full">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-lg font-bold tracking-tight text-white mix-blend-difference">Postly</span>
          <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-500">
            <a href="#features" className="hover:text-zinc-900 transition-colors">기능</a>
            <a href="#pricing" className="hover:text-zinc-900 transition-colors">가격</a>
            <a href="#faq" className="hover:text-zinc-900 transition-colors">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/auth" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
              로그인
            </Link>
            <Link
              href="/auth"
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
            >
              무료 시작
            </Link>
          </div>
        </div>
      </header>

      {/* Hero — dark */}
      <section
        className="relative overflow-hidden bg-zinc-950 pt-32 pb-28 sm:pt-40 sm:pb-36"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      >
        {/* Glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.18) 0%, transparent 60%)",
          }}
        />

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <p className="mb-6 text-sm font-medium tracking-widest text-zinc-500 uppercase">
            Instagram · Twitter/X · YouTube
          </p>
          <h1 className="text-5xl sm:text-7xl font-bold text-white tracking-tight leading-[1.06] mb-8">
            소셜 콘텐츠,
            <br />
            <span className="text-zinc-400">더 스마트하게.</span>
          </h1>
          <p className="text-zinc-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-12">
            세 개 플랫폼 포스트를 캘린더 하나로 예약하고 관리하세요.
            <br className="hidden sm:block" />
            AI가 글까지 써드려서 콘텐츠 제작이 훨씬 빠릅니다.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/auth"
              className="rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-100 transition-colors shadow-lg shadow-white/5"
            >
              무료로 시작하기 →
            </Link>
            <Link
              href="/dashboard"
              className="rounded-xl border border-white/12 px-8 py-3.5 text-sm font-semibold text-zinc-300 hover:border-white/25 hover:text-white transition-colors"
            >
              데모 보기
            </Link>
          </div>
          <p className="mt-5 text-xs text-zinc-600">신용카드 없이 시작 · 무료 플랜 영구 제공 · 언제든 취소</p>

          {/* Dashboard preview */}
          <div className="mt-20 rounded-2xl border border-white/8 bg-zinc-900 overflow-hidden shadow-2xl shadow-black/50 text-left">
            {/* Titlebar */}
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/6 bg-zinc-900">
              <div className="h-3 w-3 rounded-full bg-zinc-700" />
              <div className="h-3 w-3 rounded-full bg-zinc-700" />
              <div className="h-3 w-3 rounded-full bg-zinc-700" />
              <div className="mx-auto flex items-center gap-2 rounded-md bg-zinc-800 px-4 py-1">
                <div className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
                <span className="text-[11px] text-zinc-500">postly.app/dashboard</span>
              </div>
            </div>
            {/* App UI */}
            <div className="p-4 sm:p-6 grid grid-cols-4 gap-3">
              {[
                { label: "이번 달", value: "24", col: "text-indigo-400" },
                { label: "오늘 예정", value: "3", col: "text-emerald-400" },
                { label: "Instagram", value: "11", col: "text-pink-400" },
                { label: "Twitter/X", value: "9", col: "text-sky-400" },
              ].map((c) => (
                <div key={c.label} className="rounded-xl bg-zinc-800/60 border border-white/5 p-3 sm:p-4 text-center">
                  <p className={`text-xl sm:text-2xl font-bold ${c.col}`}>{c.value}</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">{c.label}</p>
                </div>
              ))}
            </div>
            <div className="px-4 sm:px-6 pb-6">
              <div className="rounded-xl bg-zinc-800/40 border border-white/5 overflow-hidden">
                <div className="grid grid-cols-7 border-b border-white/5">
                  {["일","월","화","수","목","금","토"].map((d, i) => (
                    <div key={d} className={`py-2 text-center text-[10px] font-medium ${i===0?"text-red-400":i===6?"text-blue-400":"text-zinc-600"}`}>{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7">
                  {Array.from({length: 35}, (_, i) => {
                    const day = i - 2;
                    const isToday = i === 22;
                    const hasPink = [4,11,18].includes(i);
                    const hasSky = [6,13,27].includes(i);
                    return (
                      <div key={i} className={`min-h-[40px] sm:min-h-[52px] p-1.5 border-b border-r border-white/4 last:border-r-0 ${isToday ? "bg-indigo-600/20" : ""}`}>
                        <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${isToday ? "bg-indigo-500 text-white font-bold" : day < 1 || day > 31 ? "text-zinc-700" : "text-zinc-400"}`}>
                          {day > 0 && day <= 31 ? day : ""}
                        </span>
                        <div className="mt-0.5 flex flex-col gap-0.5">
                          {hasPink && day > 0 && day <= 31 && <div className="hidden sm:block rounded-sm bg-pink-500/30 border border-pink-500/40 px-1 py-0.5 text-[8px] text-pink-400 truncate">Instagram</div>}
                          {hasSky && day > 0 && day <= 31 && <div className="hidden sm:block rounded-sm bg-sky-500/20 border border-sky-500/30 px-1 py-0.5 text-[8px] text-sky-400 truncate">Twitter</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-28">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-20 max-w-xl">
            <p className="text-xs font-semibold tracking-widest text-indigo-600 uppercase mb-4">기능</p>
            <h2 className="text-4xl font-bold text-zinc-900 tracking-tight">필요한 건 다 있어요</h2>
            <p className="mt-4 text-zinc-500 text-base leading-relaxed">복잡한 설정 없이 바로 쓸 수 있어요.</p>
          </div>

          <div className="space-y-24">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16 ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
              >
                <div className="flex-1">
                  <p className="text-xs font-semibold tracking-widest text-indigo-500 uppercase mb-3">{f.eyebrow}</p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight mb-4">{f.title}</h3>
                  <p className="text-zinc-500 text-base leading-relaxed">{f.desc}</p>
                </div>
                <div className="w-full lg:w-[420px] shrink-0">
                  {f.visual}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-zinc-950 py-24">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-xs font-semibold tracking-widest text-zinc-500 uppercase mb-12">크리에이터들의 이야기</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name}>
                <p className="text-zinc-300 text-sm leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-zinc-600 mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-28">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-16 text-center">
            <p className="text-xs font-semibold tracking-widest text-indigo-600 uppercase mb-4">가격</p>
            <h2 className="text-4xl font-bold text-zinc-900 tracking-tight">심플한 가격</h2>
            <p className="mt-4 text-zinc-500">숨겨진 비용 없이 투명하게. 언제든 취소할 수 있어요.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-7 ${
                  plan.featured
                    ? "bg-zinc-950 text-white"
                    : "border border-zinc-200 bg-white"
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-6 rounded-full bg-indigo-500 px-3 py-1 text-[11px] font-semibold text-white">
                    인기
                  </span>
                )}
                <p className={`text-sm font-semibold mb-1 ${plan.featured ? "text-zinc-400" : "text-zinc-500"}`}>
                  {plan.name}
                </p>
                <div className="flex items-end gap-1 mb-1">
                  <span className={`text-4xl font-bold ${plan.featured ? "text-white" : "text-zinc-900"}`}>
                    ${plan.price}
                  </span>
                  <span className={`text-sm mb-1 ${plan.featured ? "text-zinc-500" : "text-zinc-400"}`}>/월</span>
                </div>
                <p className={`text-xs mb-7 ${plan.featured ? "text-zinc-600" : "text-zinc-400"}`}>{plan.desc}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <svg
                        className={`h-4 w-4 shrink-0 mt-0.5 ${plan.featured ? "text-indigo-400" : "text-indigo-500"}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      <span className={plan.featured ? "text-zinc-300" : "text-zinc-600"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth"
                  className={`block w-full rounded-xl py-2.5 text-center text-sm font-semibold transition-colors ${
                    plan.featured
                      ? "bg-indigo-500 text-white hover:bg-indigo-400"
                      : "border border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                  }`}
                >
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
      <section id="faq" className="border-t border-zinc-100 py-28">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-16">
            <p className="text-xs font-semibold tracking-widest text-indigo-600 uppercase mb-4">FAQ</p>
            <h2 className="text-4xl font-bold text-zinc-900 tracking-tight">자주 묻는 질문</h2>
          </div>
          <div className="divide-y divide-zinc-100">
            {faqs.map((faq, i) => (
              <div key={i} className="py-6">
                <h3 className="text-sm font-semibold text-zinc-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — dark */}
      <section className="bg-zinc-950 py-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-4xl font-bold text-white tracking-tight mb-5">지금 바로 시작하세요</h2>
          <p className="text-zinc-500 mb-10 leading-relaxed">
            무료로 가입하고 소셜 미디어 관리를 훨씬 쉽게 만들어보세요.
            <br />
            신용카드 없이도 시작할 수 있어요.
          </p>
          <Link
            href="/auth"
            className="inline-block rounded-xl bg-white px-10 py-4 text-sm font-semibold text-zinc-900 hover:bg-zinc-100 transition-colors"
          >
            무료로 시작하기 →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100 py-10">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-bold text-zinc-900">Postly</p>
            <p className="text-xs text-zinc-400 mt-1">소셜 미디어 스케줄러</p>
          </div>
          <nav className="flex flex-wrap gap-6 text-sm text-zinc-400">
            <a href="#features" className="hover:text-zinc-600 transition-colors">기능</a>
            <Link href="/pricing" className="hover:text-zinc-600 transition-colors">가격</Link>
            <a href="#faq" className="hover:text-zinc-600 transition-colors">FAQ</a>
            <Link href="/privacy" className="hover:text-zinc-600 transition-colors">개인정보처리방침</Link>
            <Link href="/terms" className="hover:text-zinc-600 transition-colors">이용약관</Link>
          </nav>
        </div>
        <div className="mx-auto max-w-6xl px-6 mt-8 pt-6 border-t border-zinc-100 text-xs text-zinc-400">
          © 2026 Postly. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
