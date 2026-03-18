"use client";

import { ScheduledPost, PLATFORM_CONFIG } from "../types";

interface WeekViewProps {
  baseDate: string; // any date in the week (YYYY-MM-DD)
  posts: ScheduledPost[];
  today: string;
  onDayClick: (dateStr: string) => void;
}

const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

function getWeekDates(baseDate: string): string[] {
  const d = new Date(baseDate);
  const day = d.getDay(); // 0=Sun
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(d);
    date.setDate(d.getDate() - day + i);
    dates.push(date.toISOString().split("T")[0]);
  }
  return dates;
}

export default function WeekView({ baseDate, posts, today, onDayClick }: WeekViewProps) {
  const weekDates = getWeekDates(baseDate);

  const postsByDate = posts.reduce<Record<string, ScheduledPost[]>>((acc, post) => {
    if (!acc[post.scheduledAt]) acc[post.scheduledAt] = [];
    acc[post.scheduledAt].push(post);
    return acc;
  }, {});

  const weekLabel = (() => {
    const start = weekDates[0];
    const end = weekDates[6];
    const [sy, sm, sd] = start.split("-").map(Number);
    const [, em, ed] = end.split("-").map(Number);
    if (sm === em) return `${sy}년 ${sm}월 ${sd}일 – ${ed}일`;
    return `${sy}년 ${sm}월 ${sd}일 – ${em}월 ${ed}일`;
  })();

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
      {/* Week label */}
      <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">{weekLabel}</p>
      </div>

      <div className="grid grid-cols-7">
        {weekDates.map((dateStr, idx) => {
          const [, , d] = dateStr.split("-").map(Number);
          const isToday = dateStr === today;
          const dayPosts = (postsByDate[dateStr] || []).sort((a, b) => a.time.localeCompare(b.time));
          const isWeekend = idx === 0 || idx === 6;

          return (
            <div
              key={dateStr}
              onClick={() => onDayClick(dateStr)}
              className={`min-h-[160px] border-r border-zinc-100 dark:border-zinc-800 last:border-r-0 cursor-pointer transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800 ${
                isToday ? "bg-indigo-50/40 dark:bg-indigo-950/20" : ""
              }`}
            >
              {/* Day header */}
              <div className="flex flex-col items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
                <span className={`text-[10px] font-semibold uppercase ${
                  isWeekend ? (idx === 0 ? "text-red-400" : "text-blue-400") : "text-zinc-500 dark:text-zinc-400"
                }`}>
                  {WEEKDAY_LABELS[idx]}
                </span>
                <span className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                  isToday ? "bg-indigo-600 text-white" : isWeekend ? (idx === 0 ? "text-red-500" : "text-blue-500") : "text-zinc-800 dark:text-zinc-200"
                }`}>
                  {d}
                </span>
              </div>

              {/* Posts */}
              <div className="p-1 flex flex-col gap-1">
                {dayPosts.slice(0, 4).map((post) => {
                  const cfg = PLATFORM_CONFIG[post.platform];
                  return (
                    <div
                      key={post.id}
                      onClick={(e) => e.stopPropagation()}
                      className={`rounded px-1 py-0.5 ${cfg.bg}`}
                    >
                      <div className="flex items-center gap-1">
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${cfg.dot}`} />
                        <span className={`text-[9px] font-semibold ${cfg.color}`}>{post.time}</span>
                      </div>
                      <p className={`text-[9px] leading-tight mt-0.5 truncate ${cfg.color} opacity-80`}>
                        {post.content.slice(0, 20)}
                      </p>
                    </div>
                  );
                })}
                {dayPosts.length > 4 && (
                  <span className="text-[9px] text-zinc-400 dark:text-zinc-500 pl-1">+{dayPosts.length - 4}개</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
