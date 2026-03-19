"use client";

import Link from "next/link";
import { ScheduledPost, PLATFORM_CONFIG } from "../types";

interface StatsCardsProps {
  posts: ScheduledPost[];
  today: string;
  currentMonth: string; // YYYY-MM
  userPlan: "free" | "pro" | "business";
}

const PLAN_LIMITS: Record<string, number> = {
  free: 10,
  pro: 100,
  business: Infinity,
};

export default function StatsCards({
  posts,
  today,
  currentMonth,
  userPlan,
}: StatsCardsProps) {
  const monthPosts = posts.filter((p) => p.scheduledAt.startsWith(currentMonth));
  const todayPosts = posts.filter((p) => p.scheduledAt === today);
  const limit = PLAN_LIMITS[userPlan];
  const usedCount = monthPosts.length;
  const pct = limit === Infinity ? 0 : Math.min(100, Math.round((usedCount / limit) * 100));
  const isNearLimit = limit !== Infinity && usedCount >= limit * 0.8;
  const isAtLimit = limit !== Infinity && usedCount >= limit;

  const allPlatforms = (["instagram", "twitter", "youtube"] as const);

  const platformMonthCounts = allPlatforms.map((platform) => ({
    platform,
    count: monthPosts.filter((p) => p.platform === platform).length,
  }));

  const platformTotalCounts = allPlatforms.map((platform) => ({
    platform,
    count: posts.filter((p) => p.platform === platform).length,
  }));

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      {/* This month + usage */}
      <div className="col-span-2 lg:col-span-1 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-5 shadow-sm">
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
          이번 달 예약
        </p>
        <p className="mt-1 text-4xl font-bold text-zinc-900 dark:text-zinc-100">
          {usedCount}
          {limit !== Infinity && (
            <span className="ml-1 text-base font-normal text-zinc-400 dark:text-zinc-500">
              / {limit}
            </span>
          )}
        </p>

        {/* Usage bar */}
        {limit !== Infinity && (
          <div className="mt-2">
            <div className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isAtLimit ? "bg-red-500" : isNearLimit ? "bg-amber-400" : "bg-indigo-500"
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
            {isAtLimit ? (
              <p className="mt-1 text-[10px] text-red-500 font-medium">
                한도 초과 —{" "}
                <Link href="/pricing" className="underline hover:no-underline">업그레이드</Link>
              </p>
            ) : (
              <p className={`mt-1 text-[10px] font-medium ${isNearLimit ? "text-amber-500" : "text-zinc-400 dark:text-zinc-500"}`}>
                {limit - usedCount}개 남음
              </p>
            )}
          </div>
        )}
        {limit === Infinity && (
          <p className="mt-1 text-[10px] text-indigo-500 font-medium">무제한 ✓</p>
        )}

        {/* Platform breakdown for month */}
        <div className="mt-3 flex gap-1.5 flex-wrap">
          {platformMonthCounts.map(({ platform, count }) => {
            const cfg = PLATFORM_CONFIG[platform];
            return (
              <span
                key={platform}
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${cfg.bg} ${cfg.color}`}
                title={`${cfg.label}: ${count}개`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                {count}
              </span>
            );
          })}
        </div>
      </div>

      {/* Today */}
      <div className="col-span-2 lg:col-span-1 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-5 shadow-sm">
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
          오늘 예정
        </p>
        <p className="mt-1 text-4xl font-bold text-zinc-900 dark:text-zinc-100">
          {todayPosts.length}
        </p>
        <div className="mt-3 flex gap-1.5 flex-wrap min-h-[20px]">
          {todayPosts.length === 0 ? (
            <span className="text-xs text-zinc-400 dark:text-zinc-500">없음</span>
          ) : (
            allPlatforms.map((platform) => {
              const count = todayPosts.filter((p) => p.platform === platform).length;
              if (count === 0) return null;
              const cfg = PLATFORM_CONFIG[platform];
              return (
                <span
                  key={platform}
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${cfg.bg} ${cfg.color}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                  {count}
                </span>
              );
            })
          )}
        </div>
      </div>

      {/* Platform breakdown — all 3 */}
      {platformTotalCounts.map(({ platform, count }) => {
        const cfg = PLATFORM_CONFIG[platform];
        return (
          <div
            key={platform}
            className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
              <p className={`text-xs font-semibold uppercase tracking-wide ${cfg.color}`}>
                {cfg.label}
              </p>
            </div>
            <p className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">{count}</p>
            <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">전체 예약</p>
          </div>
        );
      })}
    </div>
  );
}
