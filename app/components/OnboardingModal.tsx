"use client";

import { useState } from "react";

const STEPS = [
  {
    icon: (
      <svg className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    title: "Postly에 오신 걸 환영해요! 🎉",
    desc: "소셜 미디어 포스트를 미리 작성하고 날짜별로 예약 관리할 수 있는 스케줄러예요. 간단하게 시작하는 방법을 알려드릴게요.",
    tip: null,
  },
  {
    icon: (
      <svg className="h-10 w-10 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    ),
    title: "첫 포스트 예약하기",
    desc: "오른쪽 '새 포스트 예약' 폼에 내용을 입력하고 날짜/시간을 설정하세요. AI 글쓰기로 내용을 자동 생성할 수도 있어요.",
    tip: "💡 주제를 입력하고 '생성' 버튼을 누르면 AI가 포스트를 써줘요!",
  },
  {
    icon: (
      <svg className="h-10 w-10 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
      </svg>
    ),
    title: "캘린더로 한눈에 확인",
    desc: "달력에서 날짜를 클릭하면 그날 예약된 포스트를 확인하고 편집할 수 있어요. 드래그&드롭으로 날짜를 바꿀 수도 있어요!",
    tip: "💡 헤더의 월·주·일 탭으로 보기 방식을 바꿔보세요.",
  },
  {
    icon: (
      <svg className="h-10 w-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: "분석으로 성과 확인",
    desc: "상단 '분석' 메뉴에서 플랫폼별 포스트 통계를 확인하세요. Pro 플랜으로 업그레이드하면 더 많은 포스트를 예약할 수 있어요.",
    tip: "💡 팀 메뉴에서 팀원을 초대하고 함께 콘텐츠를 관리하세요.",
  },
];

interface OnboardingModalProps {
  onComplete: () => void;
}

export default function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-200 dark:border-zinc-700 p-7">

        {/* Skip */}
        <button
          onClick={onComplete}
          className="absolute top-4 right-4 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
        >
          건너뛰기
        </button>

        {/* Step indicator */}
        <div className="flex gap-1.5 mb-6">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                i <= step ? "bg-indigo-600" : "bg-zinc-200 dark:bg-zinc-700"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-zinc-50 dark:bg-zinc-800 mb-5">
            {current.icon}
          </div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            {current.title}
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {current.desc}
          </p>
          {current.tip && (
            <div className="mt-4 w-full rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900 px-4 py-2.5">
              <p className="text-xs text-indigo-600 dark:text-indigo-400 text-left">{current.tip}</p>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-7 flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-700 py-2.5 text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              이전
            </button>
          )}
          <button
            onClick={() => {
              if (isLast) onComplete();
              else setStep((s) => s + 1);
            }}
            className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            {isLast ? "시작하기 🚀" : "다음"}
          </button>
        </div>

        {/* Step counter */}
        <p className="mt-4 text-center text-xs text-zinc-400 dark:text-zinc-500">
          {step + 1} / {STEPS.length}
        </p>
      </div>
    </div>
  );
}
