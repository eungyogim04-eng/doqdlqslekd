"use client";

import { ScheduledPost, PLATFORM_CONFIG } from "../types";

interface StatsCardsProps {
  posts: ScheduledPost[];
  today: string;
  currentMonth: string; // YYYY-MM
}

export default function StatsCards({
  posts,
  today,
  currentMonth,
}: StatsCardsProps) {
  const monthPosts = posts.filter((p) =>
    p.scheduledAt.startsWith(currentMonth)
  );
  const todayPosts = posts.filter((p) => p.scheduledAt === today);

  const platformCounts = (list: ScheduledPost[]) =>
    (["instagram", "twitter", "youtube"] as const).map((platform) => ({
      platform,
      count: list.filter((p) => p.platform === platform).length,
    }));

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {/* This month */}
      <div className="col-span-2 sm:col-span-1 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-5 shadow-sm">
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
          이번 달 예약
        </p>
        <p className="mt-1 text-4xl font-bold text-zinc-900 dark:text-zinc-100">
          {monthPosts.length}
        </p>
        <div className="mt-3 flex gap-2 flex-wrap">
          {platformCounts(monthPosts).map(({ platform, count }) => (
            <span
              key={platform}
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${PLATFORM_CONFIG[platform].bg} ${PLATFORM_CONFIG[platform].color}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${PLATFORM_CONFIG[platform].dot}`}
              />
              {count}
            </span>
          ))}
        </div>
      </div>

      {/* Today */}
      <div className="col-span-2 sm:col-span-1 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-5 shadow-sm">
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
          오늘 예정
        </p>
        <p className="mt-1 text-4xl font-bold text-zinc-900 dark:text-zinc-100">
          {todayPosts.length}
        </p>
        <div className="mt-3 flex gap-2 flex-wrap">
          {platformCounts(todayPosts).map(({ platform, count }) =>
            count > 0 ? (
              <span
                key={platform}
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${PLATFORM_CONFIG[platform].bg} ${PLATFORM_CONFIG[platform].color}`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${PLATFORM_CONFIG[platform].dot}`}
                />
                {count}
              </span>
            ) : null
          )}
          {todayPosts.length === 0 && (
            <span className="text-xs text-zinc-400 dark:text-zinc-500">없음</span>
          )}
        </div>
      </div>

      {/* Platform breakdown */}
      {(["instagram", "twitter", "youtube"] as const).slice(0, 2).map((platform) => {
        const cfg = PLATFORM_CONFIG[platform];
        const count = posts.filter((p) => p.platform === platform).length;
        return (
          <div
            key={platform}
            className={`rounded-2xl border ${cfg.border} ${cfg.bg} p-5 shadow-sm`}
          >
            <p className={`text-xs font-medium uppercase tracking-wide ${cfg.color}`}>
              {cfg.label}
            </p>
            <p className="mt-1 text-4xl font-bold text-zinc-900 dark:text-zinc-100">{count}</p>
            <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">전체 예약</p>
          </div>
        );
      })}
    </div>
  );
}
