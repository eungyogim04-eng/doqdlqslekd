import Link from "next/link";

const features = [
  {
    eyebrow: "스케줄링",
    title: "캘린더 하나로 세 플랫폼 관리",
    desc: "월·주·일 캘린더에서 Instagram, Twitter/X, YouTube 포스트를 한눈에 확인하세요. 드래그 앤 드롭으로 일정을 즉시 변경할 수 있어요.",
    visual: (
      <div className="rounded-2xl overflow-hidden" style={{background:"#FDFAF6", border:"1px solid #DDD5C8"}}>
        <div className="px-4 pt-4 pb-3" style={{borderBottom:"1px solid #E8E0D4"}}>
          <p className="text-xs font-semibold" style={{color:"#7A6E67"}}>3월 · 2026</p>
        </div>
        <div className="grid grid-cols-7 gap-px p-3" style={{background:"#E8E0D4"}}>
          {["일","월","화","수","목","금","토"].map((d,i) => (
            <div key={d} className="bg-transparent text-center py-1 text-[9px] font-semibold" style={{color: i===0?"#F472B6":i===6?"#60A5FA":"#B0A49C"}}>{d}</div>
          ))}
          {Array.from({length:35},(_,i)=>{
            const day=i-2; const isToday=i===20;
            const hasPost=[4,7,11,14,18,20,25,28].includes(i);
            return (
              <div key={i} className="py-2.5 text-center relative" style={{background:"#FDFAF6"}}>
                <span className="text-[10px]" style={{
                  color: isToday?"white":day<1||day>31?"#DDD5C8":i%7===0?"#F472B6":i%7===6?"#60A5FA":"#2C2420",
                  background: isToday?"#9B7FE8":"transparent",
                  borderRadius:"50%", padding:"2px 4px", fontWeight: isToday?700:400
                }}>{day>0&&day<=31?day:""}</span>
                {hasPost&&day>0&&day<=31&&!isToday&&(
                  <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-px">
                    <div className="h-1 w-1 rounded-full" style={{background:i%3===0?"#F472B6":i%3===1?"#2DD4BF":"#F87171"}} />
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
      <div className="rounded-2xl p-4 space-y-3" style={{background:"#FDFAF6", border:"1px solid #DDD5C8"}}>
        <div className="rounded-xl p-3" style={{background:"#F5EFE6", border:"1px solid #DDD5C8"}}>
          <p className="text-[10px] font-medium mb-1" style={{color:"#B0A49C"}}>오늘의 주제</p>
          <p className="text-xs" style={{color:"#2C2420"}}>봄 신상품 출시 이벤트 안내</p>
        </div>
        <div className="flex items-center gap-2 text-[10px]" style={{color:"#9B7FE8"}}>
          <div className="h-1.5 w-1.5 rounded-full animate-pulse" style={{background:"#9B7FE8"}} />
          Claude AI 작성 중...
        </div>
        <div className="rounded-xl p-3" style={{background:"#FFF0F4", border:"1px solid #FFCDD9"}}>
          <p className="text-xs leading-relaxed" style={{color:"#C2185B", opacity:0.85}}>
            🌸 봄이 찾아왔습니다! 기다리고 기다리던 신상품이 드디어 출시됩니다...
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {["#봄신상", "#신제품출시", "#패션"].map(t => (
              <span key={t} className="text-[9px]" style={{color:"#F472B6"}}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    eyebrow: "분석",
    title: "무엇이 잘 되고 있는지 한눈에",
    desc: "플랫폼별 예약 현황, 월별 트렌드를 시각화해서 보여드려요. 데이터 기반으로 더 스마트한 콘텐츠 전략을 세우세요.",
    visual: (
      <div className="rounded-2xl p-4" style={{background:"#FDFAF6", border:"1px solid #DDD5C8"}}>
        <p className="text-xs font-semibold mb-3" style={{color:"#7A6E67"}}>이번 달 기록</p>
        <div className="flex items-end gap-1.5 h-16 mb-3">
          {[35,55,40,70,45,80,60,75,50,85,65,90].map((h,i)=>(
            <div key={i} className="flex-1 rounded-sm"
              style={{height:`${h}%`, background: i===11?"#9B7FE8":`color-mix(in srgb, #9B7FE8 ${30+i*5}%, #F0EBFF)`}} />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 mt-3">
          {[
            {emoji:"📸",label:"Instagram",value:"11",color:"#C2185B",bg:"#FFF0F4"},
            {emoji:"🐦",label:"Twitter",value:"9",color:"#0D7A72",bg:"#EDFCFA"},
            {emoji:"🎬",label:"YouTube",value:"4",color:"#C62828",bg:"#FFF3F3"},
          ].map(s=>(
            <div key={s.label} className="rounded-xl p-2 text-center" style={{background:s.bg}}>
              <p className="text-base">{s.emoji}</p>
              <p className="text-base font-bold" style={{color:s.color}}>{s.value}</p>
              <p className="text-[9px]" style={{color:s.color, opacity:0.7}}>{s.label}</p>
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
    desc: "시작은 무료로",
    featured: false,
    features: ["Instagram, Twitter 2개 플랫폼","월 10개 포스트 예약","캘린더 뷰 (월·주·일)","기본 통계"],
    cta: "무료로 시작",
  },
  {
    name: "Pro",
    price: "9",
    desc: "크리에이터를 위한 플랜",
    featured: true,
    features: ["YouTube 포함 3개 플랫폼","월 100개 포스트 예약","AI 글쓰기 & 해시태그","분석 대시보드","AI 최적 게시 시간"],
    cta: "Pro 시작하기",
  },
  {
    name: "Business",
    price: "29",
    desc: "팀과 함께",
    featured: false,
    features: ["무제한 플랫폼","무제한 포스트 예약","팀 협업 & 승인 워크플로우","전담 고객 지원","Pro 모든 기능"],
    cta: "팀으로 시작",
  },
];

const testimonials = [
  {
    quote: "일주일치 포스트를 한 번에 예약해두면 자동으로 올라가니까 정말 편해요. AI 글쓰기도 퀄리티가 높아서 놀랐어요.",
    name: "김지수",
    role: "패션 인플루언서",
  },
  {
    quote: "인스타, 트위터, 유튜브를 따로 관리하다가 Postly로 통합했더니 업무 시간이 반으로 줄었어요.",
    name: "박민준",
    role: "스타트업 마케터",
  },
  {
    quote: "분석 대시보드에서 어떤 요일이 잘 되는지 보이니까 전략적으로 콘텐츠를 운영하게 됐어요.",
    name: "이수진",
    role: "뷰티 크리에이터",
  },
];

const faqs = [
  {q:"무료 플랜에서 유료로 언제든 업그레이드할 수 있나요?",a:"네, 언제든 업그레이드 가능해요. 즉시 추가 기능을 이용할 수 있고 기존 예약 포스트도 유지됩니다."},
  {q:"실제로 소셜 미디어에 자동으로 포스트가 올라가나요?",a:"현재는 일정 예약 및 관리 기능을 제공하며, 자동 발행 기능은 순차적으로 추가 중입니다."},
  {q:"AI 글쓰기는 어떤 AI를 사용하나요?",a:"Anthropic의 Claude AI를 사용해요. 플랫폼 특성에 맞는 글과 해시태그, 최적 게시 시간을 분석해드려요."},
  {q:"구독을 취소하면 데이터가 삭제되나요?",a:"취소해도 포스트 데이터는 삭제되지 않아요. 무료 플랜으로 다운그레이드되며 계속 사용 가능해요."},
  {q:"팀 기능은 몇 명까지 사용할 수 있나요?",a:"Business 플랜에서 팀원 수 제한 없이 초대할 수 있어요."},
];

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{background:"#F5EFE6"}}>

      {/* Nav */}
      <header className="sticky top-0 z-20 backdrop-blur-md" style={{background:"rgba(245,239,230,0.9)", borderBottom:"1px solid #DDD5C8"}}>
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 h-14">
          <span className="text-base font-bold tracking-tight" style={{color:"#2C2420"}}>Postly ✦</span>
          <nav className="hidden md:flex items-center gap-8 text-sm" style={{color:"#7A6E67"}}>
            <a href="#features" className="hover:opacity-70 transition-opacity">기능</a>
            <a href="#pricing" className="hover:opacity-70 transition-opacity">가격</a>
            <a href="#faq" className="hover:opacity-70 transition-opacity">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/auth" className="text-sm font-medium transition-opacity hover:opacity-70" style={{color:"#7A6E67"}}>로그인</Link>
            <Link href="/auth" className="rounded-full px-5 py-2 text-sm font-semibold text-white transition-colors hover:opacity-90"
              style={{background:"#9B7FE8"}}>
              무료 시작
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium mb-8"
          style={{background:"#F0EBFF", color:"#6D3FD1", border:"1px solid #D8CCFF"}}>
          ✦ SNS 루틴 다이어리
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold leading-tight mb-6" style={{color:"#2C2420", letterSpacing:"-0.02em"}}>
          매일 기록하고<br />
          <span style={{color:"#9B7FE8"}}>쌓아가는</span> SNS 루틴
        </h1>
        <p className="text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-10" style={{color:"#7A6E67"}}>
          Instagram, Twitter/X, YouTube 포스트를 캘린더 다이어리처럼 관리하세요.
          <br className="hidden sm:block" />
          AI가 글까지 써드려서 매일 꾸준히 올리는 게 훨씬 쉬워집니다.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/auth"
            className="rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
            style={{background:"#9B7FE8", boxShadow:"0 4px 20px rgba(155,127,232,0.35)"}}>
            무료로 시작하기 →
          </Link>
          <Link href="/dashboard"
            className="rounded-full px-8 py-3.5 text-sm font-semibold transition-colors hover:opacity-80"
            style={{background:"#FDFAF6", color:"#2C2420", border:"1px solid #DDD5C8"}}>
            데모 보기
          </Link>
        </div>
        <p className="mt-4 text-xs" style={{color:"#B0A49C"}}>신용카드 없이 시작 · 무료 플랜 영구 제공 · 언제든 취소</p>

        {/* App preview — diary style */}
        <div className="mt-16 rounded-2xl overflow-hidden shadow-xl text-left" style={{background:"#FDFAF6", border:"1px solid #DDD5C8", boxShadow:"0 20px 60px rgba(155,127,232,0.12)"}}>
          <div className="flex items-center gap-2 px-5 py-3" style={{borderBottom:"1px solid #E8E0D4", background:"#F5EFE6"}}>
            <div className="h-3 w-3 rounded-full" style={{background:"#FFBDBD"}} />
            <div className="h-3 w-3 rounded-full" style={{background:"#FFDA9E"}} />
            <div className="h-3 w-3 rounded-full" style={{background:"#A8EEC1"}} />
            <div className="mx-auto flex items-center gap-1.5 rounded-full px-4 py-1" style={{background:"#EDE4D8"}}>
              <div className="h-1.5 w-1.5 rounded-full" style={{background:"#B0A49C"}} />
              <span className="text-[11px]" style={{color:"#7A6E67"}}>postly.app/dashboard</span>
            </div>
          </div>
          <div className="p-5">
            <div className="mb-4">
              <p className="text-xs" style={{color:"#B0A49C"}}>✏️ 오늘도 하나씩 기록해봐요</p>
              <p className="text-lg font-bold mt-0.5" style={{color:"#2C2420"}}>3월 19일 수요일</p>
            </div>
            <div className="grid grid-cols-5 gap-2 mb-4">
              {[
                {emoji:"✍️",val:"24",label:"이번달",color:"#6D3FD1",bg:"#F0EBFF"},
                {emoji:"📅",val:"3",label:"오늘예정",color:"#0D7A72",bg:"#EDFCFA"},
                {emoji:"📸",val:"11",label:"Instagram",color:"#C2185B",bg:"#FFF0F4"},
                {emoji:"🐦",val:"9",label:"Twitter",color:"#0D7A72",bg:"#EDFCFA"},
                {emoji:"🎬",val:"4",label:"YouTube",color:"#C62828",bg:"#FFF3F3"},
              ].map(c=>(
                <div key={c.label} className="rounded-xl p-2.5 text-center" style={{background:c.bg}}>
                  <p className="text-sm">{c.emoji}</p>
                  <p className="text-base font-bold" style={{color:c.color}}>{c.val}</p>
                  <p className="text-[9px]" style={{color:c.color,opacity:0.7}}>{c.label}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl overflow-hidden" style={{border:"1px solid #DDD5C8"}}>
              <div className="grid grid-cols-7" style={{borderBottom:"1px solid #E8E0D4", background:"#F5EFE6"}}>
                {["일","월","화","수","목","금","토"].map((d,i)=>(
                  <div key={d} className="py-1.5 text-center text-[9px] font-semibold"
                    style={{color:i===0?"#F472B6":i===6?"#60A5FA":"#B0A49C"}}>{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {Array.from({length:35},(_,i)=>{
                  const day=i-2; const isToday=i===20;
                  const pink=[4,11,25].includes(i); const teal=[7,21,28].includes(i);
                  return (
                    <div key={i} className="min-h-[44px] p-1" style={{borderRight:i%7===6?"none":"1px solid #E8E0D4",borderBottom:"1px solid #E8E0D4", background:isToday?"#F0EBFF":"#FDFAF6"}}>
                      <span className="text-[9px]" style={{color:isToday?"#9B7FE8":day<1||day>31?"#DDD5C8":"#2C2420",fontWeight:isToday?700:400}}>
                        {day>0&&day<=31?day:""}
                      </span>
                      {day>0&&day<=31&&(
                        <div className="mt-0.5 flex flex-col gap-0.5">
                          {pink&&<div className="rounded-sm px-1 py-px text-[7px]" style={{background:"#FFF0F4",color:"#C2185B"}}>📸 9:00</div>}
                          {teal&&<div className="rounded-sm px-1 py-px text-[7px]" style={{background:"#EDFCFA",color:"#0D7A72"}}>🐦 14:00</div>}
                        </div>
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
      <section id="features" className="py-24" style={{background:"#FDFAF6"}}>
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-16">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{color:"#9B7FE8"}}>기능</p>
            <h2 className="text-3xl font-bold" style={{color:"#2C2420"}}>필요한 건 다 있어요</h2>
            <p className="mt-3 text-base" style={{color:"#7A6E67"}}>복잡한 설정 없이 바로 쓸 수 있어요.</p>
          </div>
          <div className="space-y-20">
            {features.map((f, i) => (
              <div key={f.title} className={`flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16 ${i%2===1?"lg:flex-row-reverse":""}`}>
                <div className="flex-1">
                  <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{color:"#9B7FE8"}}>{f.eyebrow}</p>
                  <h3 className="text-2xl sm:text-3xl font-bold mb-4" style={{color:"#2C2420"}}>{f.title}</h3>
                  <p className="text-base leading-relaxed" style={{color:"#7A6E67"}}>{f.desc}</p>
                </div>
                <div className="w-full lg:w-[400px] shrink-0">{f.visual}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20" style={{background:"#F5EFE6"}}>
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-xs font-semibold tracking-widest uppercase mb-12" style={{color:"#B0A49C"}}>크리에이터들의 이야기</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(t => (
              <div key={t.name} className="rounded-2xl p-6" style={{background:"#FDFAF6", border:"1px solid #DDD5C8"}}>
                <p className="text-sm leading-relaxed mb-5" style={{color:"#7A6E67"}}>&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="text-sm font-semibold" style={{color:"#2C2420"}}>{t.name}</p>
                  <p className="text-xs mt-0.5" style={{color:"#B0A49C"}}>{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24" style={{background:"#FDFAF6"}}>
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-14 text-center">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{color:"#9B7FE8"}}>가격</p>
            <h2 className="text-3xl font-bold" style={{color:"#2C2420"}}>심플한 가격</h2>
            <p className="mt-3" style={{color:"#7A6E67"}}>숨겨진 비용 없이 투명하게. 언제든 취소할 수 있어요.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {plans.map(plan => (
              <div key={plan.name} className="relative rounded-2xl p-7"
                style={plan.featured
                  ? {background:"#9B7FE8", color:"white"}
                  : {background:"#FDFAF6", border:"1px solid #DDD5C8"}}>
                {plan.featured && (
                  <span className="absolute -top-3 left-6 rounded-full px-3 py-1 text-[11px] font-semibold text-white"
                    style={{background:"#6D3FD1"}}>인기</span>
                )}
                <p className="text-sm font-semibold mb-1" style={{color:plan.featured?"rgba(255,255,255,0.7)":"#7A6E67"}}>{plan.name}</p>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-4xl font-bold" style={{color:plan.featured?"white":"#2C2420"}}>${plan.price}</span>
                  <span className="text-sm mb-1" style={{color:plan.featured?"rgba(255,255,255,0.5)":"#B0A49C"}}>/월</span>
                </div>
                <p className="text-xs mb-6" style={{color:plan.featured?"rgba(255,255,255,0.55)":"#B0A49C"}}>{plan.desc}</p>
                <ul className="space-y-2.5 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <span style={{color:plan.featured?"rgba(255,255,255,0.7)":"#9B7FE8"}}>✓</span>
                      <span style={{color:plan.featured?"rgba(255,255,255,0.85)":"#7A6E67"}}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/auth" className="block w-full rounded-full py-2.5 text-center text-sm font-semibold transition-all hover:opacity-90"
                  style={plan.featured
                    ? {background:"white", color:"#6D3FD1"}
                    : {background:"#F0EBFF", color:"#6D3FD1", border:"1px solid #D8CCFF"}}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center mt-8 text-sm" style={{color:"#B0A49C"}}>
            모든 플랜 30일 환불 보장 · 연간 결제 시 2개월 무료
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24" style={{background:"#F5EFE6", borderTop:"1px solid #DDD5C8"}}>
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-14">
            <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{color:"#9B7FE8"}}>FAQ</p>
            <h2 className="text-3xl font-bold" style={{color:"#2C2420"}}>자주 묻는 질문</h2>
          </div>
          <div style={{borderTop:"1px solid #DDD5C8"}}>
            {faqs.map((faq,i) => (
              <div key={i} className="py-6" style={{borderBottom:"1px solid #DDD5C8"}}>
                <h3 className="text-sm font-semibold mb-2" style={{color:"#2C2420"}}>{faq.q}</h3>
                <p className="text-sm leading-relaxed" style={{color:"#7A6E67"}}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24" style={{background:"#9B7FE8"}}>
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">지금 바로 시작하세요</h2>
          <p className="mb-10 leading-relaxed" style={{color:"rgba(255,255,255,0.75)"}}>
            무료로 가입하고 SNS 루틴을 만들어보세요.<br />신용카드 없이도 시작할 수 있어요.
          </p>
          <Link href="/auth" className="inline-block rounded-full px-10 py-4 text-sm font-semibold transition-colors hover:opacity-90"
            style={{background:"white", color:"#6D3FD1"}}>
            무료로 시작하기 →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10" style={{background:"#F5EFE6", borderTop:"1px solid #DDD5C8"}}>
        <div className="mx-auto max-w-5xl px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-bold" style={{color:"#2C2420"}}>Postly ✦</p>
            <p className="text-xs mt-1" style={{color:"#B0A49C"}}>SNS 루틴 다이어리</p>
          </div>
          <nav className="flex flex-wrap gap-6 text-sm" style={{color:"#B0A49C"}}>
            <a href="#features" className="hover:opacity-70 transition-opacity">기능</a>
            <Link href="/pricing" className="hover:opacity-70 transition-opacity">가격</Link>
            <a href="#faq" className="hover:opacity-70 transition-opacity">FAQ</a>
            <Link href="/privacy" className="hover:opacity-70 transition-opacity">개인정보처리방침</Link>
            <Link href="/terms" className="hover:opacity-70 transition-opacity">이용약관</Link>
          </nav>
        </div>
        <div className="mx-auto max-w-5xl px-6 mt-8 pt-6 text-xs" style={{borderTop:"1px solid #DDD5C8", color:"#B0A49C"}}>
          © 2026 Postly. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
