"use client";

import { ScheduledPost, PLATFORM_CONFIG } from "../types";

interface DayViewProps {
  date: string; // YYYY-MM-DD
  posts: ScheduledPost[];
  onEdit: (post: ScheduledPost) => void;
  onDelete: (id: string) => void;
  onDuplicate: (post: ScheduledPost) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function DayView({ date, posts, onEdit, onDelete, onDuplicate }: DayViewProps) {
  const [year, month, day] = date.split("-").map(Number);
  const dateLabel = `${year}년 ${month}월 ${day}일`;

  const dayPosts = posts
    .filter((p) => p.scheduledAt === date)
    .sort((a, b) => a.time.localeCompare(b.time));

  // Group posts by hour
  const byHour = dayPosts.reduce<Record<number, ScheduledPost[]>>((acc, p) => {
    const h = parseInt(p.time.split(":")[0], 10);
    if (!acc[h]) acc[h] = [];
    acc[h].push(p);
    return acc;
  }, {});

  // Show hours 6-23 + any post hours outside that range
  const postHours = Object.keys(byHour).map(Number);
  const visibleHours = Array.from(
    new Set([...HOURS.filter((h) => h >= 6 && h <= 23), ...postHours])
  ).sort((a, b) => a - b);

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{dateLabel}</p>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">
          {dayPosts.length > 0 ? `${dayPosts.length}개 예약` : "예약 없음"}
        </p>
      </div>

      <div className="overflow-y-auto max-h-[520px]">
        {visibleHours.map((hour) => {
          const hourPosts = byHour[hour] || [];
          const isEmpty = hourPosts.length === 0;
          return (
            <div
              key={hour}
              className={`flex gap-3 px-4 py-2 border-b border-zinc-50 dark:border-zinc-800/50 last:border-b-0 ${
                isEmpty ? "min-h-[36px]" : "min-h-[52px]"
              }`}
            >
              <span className={`w-10 shrink-0 text-xs font-mono pt-0.5 ${
                isEmpty ? "text-zinc-300 dark:text-zinc-600" : "text-zinc-500 dark:text-zinc-400 font-semibold"
              }`}>
                {String(hour).padStart(2, "0")}:00
              </span>
              <div className="flex-1 flex flex-col gap-1.5">
                {hourPosts.map((post) => {
                  const cfg = PLATFORM_CONFIG[post.platform];
                  return (
                    <div
                      key={post.id}
                      className={`rounded-lg px-3 py-2 ${cfg.bg} border ${cfg.border}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`h-2 w-2 shrink-0 rounded-full ${cfg.dot}`} />
                          <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
                          <span className={`text-xs ${cfg.color} opacity-70`}>{post.time}</span>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button onClick={() => onEdit(post)} className="text-[10px] text-zinc-400 hover:text-indigo-500 transition-colors">편집</button>
                          <button onClick={() => onDuplicate(post)} className="text-[10px] text-zinc-400 hover:text-green-500 transition-colors">복제</button>
                          <button onClick={() => onDelete(post.id)} className="text-[10px] text-zinc-400 hover:text-red-500 transition-colors">삭제</button>
                        </div>
                      </div>
                      <p className={`mt-1 text-xs ${cfg.color} opacity-80 break-words line-clamp-2`}>{post.content}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
