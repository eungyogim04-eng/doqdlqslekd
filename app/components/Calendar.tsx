"use client";

import { useState } from "react";
import { ScheduledPost, PLATFORM_CONFIG } from "../types";

interface CalendarProps {
  year: number;
  month: number;
  posts: ScheduledPost[];
  today: string;
  onDayClick: (dateStr: string) => void;
  onMovePost?: (postId: string, newDate: string) => void;
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function Calendar({ year, month, posts, today, onDayClick, onMovePost }: CalendarProps) {
  const [draggingPostId, setDraggingPostId] = useState<string | null>(null);
  const [dragOverDate, setDragOverDate] = useState<string | null>(null);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells: Array<{ day: number; thisMonth: boolean; dateStr: string }> = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    cells.push({ day, thisMonth: false, dateStr: toDateStr(prevYear, prevMonth, day) });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, thisMonth: true, dateStr: toDateStr(year, month, d) });
  }
  const trailing = 42 - cells.length;
  for (let d = 1; d <= trailing; d++) {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    cells.push({ day: d, thisMonth: false, dateStr: toDateStr(nextYear, nextMonth, d) });
  }

  const postsByDate = posts.reduce<Record<string, ScheduledPost[]>>((acc, post) => {
    if (!acc[post.scheduledAt]) acc[post.scheduledAt] = [];
    acc[post.scheduledAt].push(post);
    return acc;
  }, {});

  return (
    <div className="overflow-hidden rounded-2xl" style={{background:"var(--bg-card)", border:"1px solid var(--border)"}}>
      {/* Weekday headers */}
      <div className="grid grid-cols-7" style={{borderBottom:"1px solid var(--border-light)"}}>
        {WEEKDAYS.map((d, i) => (
          <div
            key={d}
            className="py-3 text-center text-xs font-semibold tracking-wide"
            style={{
              color: i === 0 ? "#FB7185" : i === 6 ? "#60A5FA" : "var(--text-3)",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Cells */}
      <div className="grid grid-cols-7">
        {cells.map((cell, idx) => {
          const isToday = cell.dateStr === today;
          const dayPosts = postsByDate[cell.dateStr] || [];
          const isWeekend = idx % 7 === 0 || idx % 7 === 6;
          const isDragOver = dragOverDate === cell.dateStr;
          const isSunday = idx % 7 === 0;
          const isSaturday = idx % 7 === 6;

          return (
            <div
              key={idx}
              onClick={() => onDayClick(cell.dateStr)}
              onDragOver={(e) => { e.preventDefault(); setDragOverDate(cell.dateStr); }}
              onDragLeave={() => setDragOverDate(null)}
              onDrop={(e) => {
                e.preventDefault();
                if (draggingPostId && onMovePost) onMovePost(draggingPostId, cell.dateStr);
                setDraggingPostId(null);
                setDragOverDate(null);
              }}
              className="cursor-pointer transition-all"
              style={{
                minHeight: "84px",
                padding: "8px",
                borderBottom: "1px solid var(--border-light)",
                borderRight: idx % 7 === 6 ? "none" : "1px solid var(--border-light)",
                background: isDragOver
                  ? "var(--accent-bg)"
                  : !cell.thisMonth
                  ? "color-mix(in srgb, var(--bg) 70%, transparent)"
                  : undefined,
                boxShadow: isDragOver ? "inset 0 0 0 2px var(--accent)" : undefined,
              }}
              onMouseEnter={e => { if (cell.thisMonth && !isDragOver) (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = isDragOver ? "var(--accent-bg)" : !cell.thisMonth ? "color-mix(in srgb, var(--bg) 70%, transparent)" : ""; }}
            >
              {/* Day number */}
              <span
                className="inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold"
                style={{
                  background: isToday ? "var(--accent)" : undefined,
                  color: isToday
                    ? "white"
                    : !cell.thisMonth
                    ? "var(--text-3)"
                    : isSunday
                    ? "#FB7185"
                    : isSaturday
                    ? "#60A5FA"
                    : "var(--text-1)",
                }}
              >
                {cell.day}
              </span>

              {/* Post stickers */}
              {dayPosts.length > 0 && (
                <div className="mt-1 flex flex-col gap-0.5">
                  {dayPosts.slice(0, 3).map((post, pi) => {
                    const cfg = PLATFORM_CONFIG[post.platform];
                    return (
                      <div
                        key={pi}
                        draggable
                        onDragStart={(e) => {
                          e.stopPropagation();
                          setDraggingPostId(post.id);
                          e.dataTransfer.effectAllowed = "move";
                        }}
                        onDragEnd={() => { setDraggingPostId(null); setDragOverDate(null); }}
                        onClick={(e) => e.stopPropagation()}
                        className={`flex items-center gap-1 rounded-md px-1 py-0.5 ${cfg.bg} cursor-grab active:cursor-grabbing ${draggingPostId === post.id ? "opacity-40" : ""}`}
                        style={{border:`1px solid`, borderColor: "transparent"}}
                      >
                        <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${cfg.dot}`} />
                        <span className={`truncate text-[10px] font-medium leading-none ${cfg.color}`}>
                          {post.time} {post.content.slice(0, 10)}{post.content.length > 10 ? "…" : ""}
                        </span>
                      </div>
                    );
                  })}
                  {dayPosts.length > 3 && (
                    <span className="text-[10px] pl-1" style={{color:"var(--text-3)"}}>+{dayPosts.length - 3}개</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
