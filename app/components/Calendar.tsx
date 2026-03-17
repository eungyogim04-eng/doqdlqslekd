"use client";

import { ScheduledPost, PLATFORM_CONFIG } from "../types";

interface CalendarProps {
  year: number;
  month: number; // 0-indexed
  posts: ScheduledPost[];
  today: string;
  onDayClick: (dateStr: string) => void;
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function Calendar({
  year,
  month,
  posts,
  today,
  onDayClick,
}: CalendarProps) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: Array<{ day: number; thisMonth: boolean; dateStr: string }> = [];

  // Leading days from previous month
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    cells.push({
      day,
      thisMonth: false,
      dateStr: toDateStr(prevYear, prevMonth, day),
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, thisMonth: true, dateStr: toDateStr(year, month, d) });
  }

  // Trailing days to fill grid (6 rows × 7 cols = 42)
  const trailing = 42 - cells.length;
  for (let d = 1; d <= trailing; d++) {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    cells.push({
      day: d,
      thisMonth: false,
      dateStr: toDateStr(nextYear, nextMonth, d),
    });
  }

  const postsByDate = posts.reduce<Record<string, ScheduledPost[]>>(
    (acc, post) => {
      if (!acc[post.scheduledAt]) acc[post.scheduledAt] = [];
      acc[post.scheduledAt].push(post);
      return acc;
    },
    {}
  );

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-zinc-100">
        {WEEKDAYS.map((d, i) => (
          <div
            key={d}
            className={`py-3 text-center text-xs font-semibold uppercase tracking-wide ${
              i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-zinc-500"
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {cells.map((cell, idx) => {
          const isToday = cell.dateStr === today;
          const dayPosts = postsByDate[cell.dateStr] || [];
          const isWeekend = idx % 7 === 0 || idx % 7 === 6;

          return (
            <button
              key={idx}
              onClick={() => onDayClick(cell.dateStr)}
              className={`min-h-[88px] p-2 text-left border-b border-r border-zinc-100 transition-colors hover:bg-zinc-50 focus:outline-none focus:bg-zinc-50
                ${!cell.thisMonth ? "bg-zinc-50/60" : ""}
                ${idx % 7 === 6 ? "border-r-0" : ""}
              `}
            >
              {/* Day number */}
              <span
                className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium
                  ${isToday ? "bg-indigo-600 text-white" : ""}
                  ${!isToday && isWeekend && cell.thisMonth ? (idx % 7 === 0 ? "text-red-400" : "text-blue-400") : ""}
                  ${!isToday && !isWeekend && cell.thisMonth ? "text-zinc-800" : ""}
                  ${!cell.thisMonth && !isToday ? "text-zinc-300" : ""}
                `}
              >
                {cell.day}
              </span>

              {/* Post dots */}
              {dayPosts.length > 0 && (
                <div className="mt-1 flex flex-col gap-0.5">
                  {dayPosts.slice(0, 3).map((post, pi) => {
                    const cfg = PLATFORM_CONFIG[post.platform];
                    return (
                      <div
                        key={pi}
                        className={`flex items-center gap-1 rounded px-1 py-0.5 ${cfg.bg}`}
                      >
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${cfg.dot}`} />
                        <span className={`truncate text-[10px] font-medium leading-none ${cfg.color}`}>
                          {post.time} {post.content.slice(0, 12)}
                          {post.content.length > 12 ? "…" : ""}
                        </span>
                      </div>
                    );
                  })}
                  {dayPosts.length > 3 && (
                    <span className="text-[10px] text-zinc-400 pl-1">
                      +{dayPosts.length - 3}개 더
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
