import Link from "next/link";

export default function TermsPage() {
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
        <h1 className="text-3xl font-bold text-zinc-900 mb-2">이용약관</h1>
        <p className="text-sm text-zinc-400 mb-10">최종 수정일: 2026년 3월 19일</p>

        <div className="space-y-8 text-sm text-zinc-600 leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 mb-3">제1조 (목적)</h2>
            <p>
              본 약관은 Postly(이하 &ldquo;서비스&rdquo;)가 제공하는 소셜 미디어 스케줄링 서비스의 이용에 관한 조건 및 절차, 회사와 이용자의 권리·의무를 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 mb-3">제2조 (정의)</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>&ldquo;서비스&rdquo;</strong>란 Postly가 제공하는 소셜 미디어 포스트 예약 및 관리 플랫폼을 의미합니다.</li>
              <li><strong>&ldquo;이용자&rdquo;</strong>란 본 약관에 동의하고 서비스를 이용하는 자를 의미합니다.</li>
              <li><strong>&ldquo;계정&rdquo;</strong>이란 이용자가 서비스 이용을 위해 생성한 이메일 기반 식별 정보를 의미합니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 mb-3">제3조 (약관의 효력 및 변경)</h2>
            <p>
              본 약관은 서비스 이용 시작과 함께 효력이 발생합니다. 회사는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 서비스 내 공지 후 7일이 경과한 날부터 효력이 발생합니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 mb-3">제4조 (회원가입)</h2>
            <p>이용자는 서비스가 정한 가입 양식에 따라 이메일 주소와 비밀번호를 제공하여 회원가입을 신청할 수 있습니다. 다음의 경우 가입 신청을 거절하거나 취소할 수 있습니다:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>허위 정보를 기재한 경우</li>
              <li>타인의 정보를 이용한 경우</li>
              <li>관련 법령을 위반하여 이용 자격을 상실한 경우</li>
              <li>만 14세 미만인 경우</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 mb-3">제5조 (서비스의 제공)</h2>
            <p>Postly는 다음과 같은 서비스를 제공합니다:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>소셜 미디어 포스트 예약 및 캘린더 관리</li>
              <li>AI 기반 포스트 내용 생성 및 해시태그 추천</li>
              <li>포스트 발행 현황 분석 대시보드</li>
              <li>팀 협업 및 포스트 승인 워크플로우</li>
            </ul>
            <p className="mt-2">서비스는 연중무휴 24시간 제공을 원칙으로 하나, 시스템 점검 등의 사유로 서비스가 일시 중단될 수 있습니다.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 mb-3">제6조 (유료 서비스 및 결제)</h2>
            <p>
              일부 서비스 기능은 유료로 제공됩니다. 유료 서비스 이용을 위해서는 Stripe를 통한 결제가 필요합니다.
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>구독은 매월 자동 갱신됩니다.</li>
              <li>구독 취소는 설정 페이지에서 언제든 가능하며, 취소 시 해당 결제 기간 종료까지 서비스를 계속 이용할 수 있습니다.</li>
              <li>구독 후 30일 이내 환불을 요청할 수 있습니다. 단, AI 기능을 과도하게 사용한 경우 환불이 제한될 수 있습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 mb-3">제7조 (이용자의 의무)</h2>
            <p>이용자는 다음의 행위를 해서는 안 됩니다:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>타인의 계정을 무단으로 사용하는 행위</li>
              <li>서비스의 정상적인 운영을 방해하는 행위</li>
              <li>저작권 등 제3자의 권리를 침해하는 콘텐츠를 등록하는 행위</li>
              <li>음란, 폭력적, 불법적인 콘텐츠를 등록하는 행위</li>
              <li>스팸성 콘텐츠를 대량으로 예약하는 행위</li>
              <li>관련 법령 및 본 약관을 위반하는 행위</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 mb-3">제8조 (서비스 이용 제한)</h2>
            <p>
              이용자가 제7조의 의무를 위반한 경우, 서비스 이용을 제한하거나 계정을 삭제할 수 있습니다.
              이 경우 이용자에게 사전 통보하는 것을 원칙으로 하나, 긴급한 경우 즉시 조치 후 통보할 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 mb-3">제9조 (면책)</h2>
            <p>Postly는 다음의 경우 책임을 지지 않습니다:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>천재지변, 전쟁, 해킹 등 불가항력으로 인한 서비스 중단</li>
              <li>이용자의 귀책으로 인한 서비스 이용 장애</li>
              <li>각 소셜 미디어 플랫폼의 API 정책 변경으로 인한 서비스 기능 제한</li>
              <li>이용자가 서비스를 통해 등록한 콘텐츠로 인한 분쟁</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 mb-3">제10조 (분쟁 해결)</h2>
            <p>
              본 약관에 관한 분쟁은 대한민국 법률에 따르며, 분쟁 발생 시 서울중앙지방법원을 관할 법원으로 합니다.
              분쟁 발생 전 먼저 고객 지원을 통해 해결을 시도합니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-900 mb-3">문의</h2>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="font-medium text-zinc-800">고객 지원</p>
              <p className="mt-1">이메일: support@postly.app</p>
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-zinc-100 py-8 mt-12">
        <div className="mx-auto max-w-5xl px-6 flex items-center justify-between text-sm text-zinc-400">
          <span>© 2026 Postly</span>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-zinc-600 transition-colors text-zinc-600">이용약관</Link>
            <Link href="/privacy" className="hover:text-zinc-600 transition-colors">개인정보처리방침</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
