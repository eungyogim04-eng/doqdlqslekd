import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-10 border-b border-zinc-100 bg-white/80 backdrop-blur-md">
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
          <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">← 홈으로</Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">개인정보처리방침</h1>
        <p className="text-sm text-zinc-400 mb-10">최종 수정일: 2026년 3월 19일</p>

        <div className="prose prose-zinc max-w-none space-y-8 text-sm text-zinc-600 leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 mb-3">1. 개요</h2>
            <p>
              Postly(이하 &ldquo;서비스&rdquo;)는 이용자의 개인정보를 중요하게 생각하며, 「개인정보 보호법」을 준수합니다.
              본 방침은 Postly가 어떤 정보를 수집하고, 어떻게 사용하며, 어떻게 보호하는지 설명합니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 mb-3">2. 수집하는 개인정보</h2>
            <p>서비스 이용 과정에서 다음과 같은 정보를 수집합니다:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>계정 정보:</strong> 이메일 주소, 비밀번호(암호화 저장)</li>
              <li><strong>서비스 이용 정보:</strong> 예약한 포스트 내용, 플랫폼, 예약 일시</li>
              <li><strong>결제 정보:</strong> 결제는 Stripe를 통해 처리되며, 카드 정보는 당사 서버에 저장되지 않습니다</li>
              <li><strong>자동 수집 정보:</strong> 서비스 접속 로그, 쿠키, IP 주소</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 mb-3">3. 개인정보의 이용 목적</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>서비스 제공 및 운영 (포스트 예약, 관리)</li>
              <li>계정 인증 및 보안</li>
              <li>결제 처리 및 구독 관리</li>
              <li>서비스 개선 및 통계 분석</li>
              <li>공지사항 및 서비스 안내 이메일 발송</li>
              <li>법적 의무 준수</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 mb-3">4. 개인정보의 보관 및 파기</h2>
            <p>
              이용자의 개인정보는 서비스 이용 기간 동안 보관됩니다.
              계정 삭제 시 관련 개인정보는 지체 없이 파기합니다. 단, 관계 법령에 따라 일정 기간 보관이 필요한 정보는 해당 기간 동안 별도 보관 후 파기합니다.
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>계약 또는 청약철회 기록: 5년 (전자상거래법)</li>
              <li>소비자 불만 또는 분쟁처리 기록: 3년 (전자상거래법)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 mb-3">5. 개인정보의 제3자 제공</h2>
            <p>
              Postly는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.
              단, 아래의 경우 예외적으로 제공될 수 있습니다:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>이용자가 사전에 동의한 경우</li>
              <li>법령의 규정에 의거하거나 수사기관의 요청이 있는 경우</li>
            </ul>
            <p className="mt-2">
              서비스 운영을 위해 다음 수탁 업체에 개인정보를 위탁합니다:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Supabase:</strong> 데이터 저장 및 인증</li>
              <li><strong>Stripe:</strong> 결제 처리</li>
              <li><strong>Resend:</strong> 이메일 발송</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 mb-3">6. 이용자의 권리</h2>
            <p>이용자는 언제든지 다음 권리를 행사할 수 있습니다:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>개인정보 열람 요청</li>
              <li>개인정보 수정 및 삭제 요청</li>
              <li>개인정보 처리 정지 요청</li>
              <li>계정 설정 페이지에서 직접 정보 수정 및 계정 삭제 가능</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 mb-3">7. 쿠키 사용</h2>
            <p>
              Postly는 서비스 이용 편의를 위해 쿠키를 사용합니다.
              브라우저 설정에서 쿠키 사용을 거부할 수 있으나, 일부 서비스 기능이 제한될 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 mb-3">8. 보안</h2>
            <p>
              Postly는 이용자의 개인정보를 보호하기 위해 다음과 같은 보안 조치를 취합니다:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>HTTPS를 통한 데이터 암호화 전송</li>
              <li>비밀번호 bcrypt 암호화 저장</li>
              <li>접근 권한 최소화</li>
              <li>정기적인 보안 점검</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 mb-3">9. 개인정보 보호책임자</h2>
            <p>
              개인정보 관련 문의사항은 아래 연락처로 문의해주세요.
              접수 후 10일 이내에 처리 결과를 안내드립니다.
            </p>
            <div className="mt-2 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="font-medium text-zinc-800">개인정보 보호책임자</p>
              <p className="mt-1">이메일: privacy@postly.app</p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 mb-3">10. 방침 변경</h2>
            <p>
              본 개인정보처리방침은 법령, 정부 지침 또는 서비스 정책에 따라 변경될 수 있습니다.
              변경 시 서비스 내 공지사항을 통해 7일 전 사전 공지합니다.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-zinc-100 py-8 mt-12">
        <div className="mx-auto max-w-5xl px-6 flex items-center justify-between text-sm text-zinc-400">
          <span>© 2026 Postly</span>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-zinc-600 transition-colors">이용약관</Link>
            <Link href="/privacy" className="hover:text-zinc-600 transition-colors text-zinc-600">개인정보처리방침</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
