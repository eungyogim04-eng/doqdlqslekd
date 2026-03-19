"use client";

import { ScheduledPost, PLATFORM_CONFIG } from "../types";

interface DayViewProps {
  date: string; // YYYY-MM-DD
  posts: ScheduledPost[];
  onEdit: (post: ScheduledPost) => void;
  onDelete: (id: string) => void;
  onDuplicate: (post: ScheduledPost) => void;
}

export default function DayView({ date, posts, onEdit, onDelete, onDuplicate }: DayViewProps) {
  const [year, month, day] = date.split("-").map(Number);
  const dateLabel = `${year}년 ${month}월 ${day}일`;

  const dayPosts = posts
    .filter((p) => p.scheduledAt === date)
    .sort((a, b) => a.time.localeCompare(b.time));

  // Group posts by hour
  const byHour = dayPosts.reduce<Record<number, ScheduledPost[]>>((acc, p) => {
    const h = Math.max(0, Math.min(23, parseInt(p.time?.split(":")[0] ?? "0", 10) || 0));
    if (!acc[h]) acc[h] = [];
    acc[h].push(p);
    return acc;
  }, {});

  const postHours = Object.keys(byHour).map(Number);

  // Show hours that have posts, plus adjacent empty hours for context (6am-10pm skeleton)
  const skeletonHours = Array.from({ length: 17 }, (_, i) => i + 6); // 6-22
  const visibleHours = Array.from(
    new Set([...skeletonHours, ...postHours])
  ).sort((a, b) => a - b);

  const PLATFORM_LABEL: Record<string, string> = {
    instagram: "Instagram",
    twitter: "Twitter/X",
    youtube: "YouTube",
  };

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{dateLabel}</p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
            {dayPosts.length > 0 ? `${dayPosts.length}개 예약됨` : "예약 없음"}
          </p>
        </div>
        {dayPosts.length > 0 && (
          <div className="flex gap-1.5">
            {(["instagram", "twitter", "youtube"] as const).map((p) => {
              const count = dayPosts.filter((post) => post.platform === p).length;
              if (!count) return null;
              const cfg = PLATFORM_CONFIG[p];
              return (
                <span key={p} className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${cfg.bg} ${cfg.color}`}>
                  <span className={`h-1 w-1 rounded-full ${cfg.dot}`} />
                  {count}
                </span>
              );
            })}
          </div>
        )}
      </div>

      {dayPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-3xl mb-3">🗓️</div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">이 날 예약이 없습니다</p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">오른쪽 폼에서 포스트를 추가해보세요</p>
        </div>
      ) : (
        <div className="overflow-y-auto max-h-[520px]">
          {visibleHours.map((hour) => {
            const hourPosts = byHour[hour] || [];
            const isEmpty = hourPosts.length === 0;
            return (
              <div
                key={hour}
                className={`flex gap-3 px-4 border-b border-zinc-50 dark:border-zinc-800/50 last:border-b-0 ${
                  isEmpty ? "py-1.5 min-h-[32px]" : "py-2.5 min-h-[52px]"
                }`}
              >
                <span className={`w-10 shrink-0 text-xs font-mono pt-0.5 tabular-nums ${
                  isEmpty ? "text-zinc-300 dark:text-zinc-700" : "text-zinc-500 dark:text-zinc-400 font-semibold"
                }`}>
                  {String(hour).padStart(2, "0")}:00
                </span>
                {isEmpty ? (
                  <div className="flex-1 flex items-center">
                    <div className="h-px w-full bg-zinc-100 dark:bg-zinc-800" />
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col gap-1.5">
                    {hourPosts.map((post) => {
                      const cfg = PLATFORM_CONFIG[post.platform];
                      return (
                        <div
                          key={post.id}
                          className={`rounded-lg px-3 py-2 ${cfg.bg} border ${cfg.border}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className={`h-2 w-2 shrink-0 rounded-full mt-0.5 ${cfg.dot}`} />
                              <div>
                                <span className={`text-xs font-semibold ${cfg.color}`}>{PLATFORM_LABEL[post.platform]}</span>
                                <span className={`ml-1.5 text-xs ${cfg.color} opacity-70`}>{post.time}</span>
                              </div>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <button onClick={() => onEdit(post)} className="text-[10px] text-zinc-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">편집</button>
                              <button onClick={() => onDuplicate(post)} className="text-[10px] text-zinc-400 hover:text-emerald-500 transition-colors">복제</button>
                              <button onClick={() => onDelete(post.id)} className="text-[10px] text-zinc-400 hover:text-red-500 transition-colors">삭제</button>
                            </div>
                          </div>
                          <p className={`mt-1 text-xs ${cfg.color} opacity-80 break-words line-clamp-2 leading-relaxed`}>{post.content}</p>
                          {post.tags && post.tags.length > 0 && (
                            <div className="mt-1.5 flex flex-wrap gap-1">
                              {post.tags.map((tag) => (
                                <span key={tag} className={`text-[9px] font-medium ${cfg.color} opacity-60`}>#{tag}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
