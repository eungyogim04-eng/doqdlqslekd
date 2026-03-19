import Link from "next/link";

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100">
            <svg className="h-8 w-8 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-zinc-900 mb-2">결제가 취소되었습니다</h1>
        <p className="text-zinc-500 mb-2">결제 과정에서 취소하셨습니다.</p>
        <p className="text-sm text-zinc-400 mb-8">언제든지 다시 업그레이드할 수 있어요. 무료 플랜은 계속 사용 가능합니다.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/pricing"
            className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            다시 업그레이드하기
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            대시보드로 이동
          </Link>
        </div>
      </div>
    </div>
  );
}
