"use client";

import { ScheduledPost, PLATFORM_CONFIG } from "../types";

interface DayViewProps {
  date: string;
  posts: ScheduledPost[];
  onEdit: (post: ScheduledPost) => void;
  onDelete: (id: string) => void;
  onDuplicate: (post: ScheduledPost) => void;
}

const PLATFORM_LABEL: Record<string, string> = {
  instagram: "📸 Instagram",
  twitter: "🐦 Twitter/X",
  youtube: "🎬 YouTube",
};

export default function DayView({ date, posts, onEdit, onDelete, onDuplicate }: DayViewProps) {
  const [year, month, day] = date.split("-").map(Number);
  const weekdays = ["일요일","월요일","화요일","수요일","목요일","금요일","토요일"];
  const dow = new Date(year, month - 1, day).getDay();
  const dateLabel = `${month}월 ${day}일 ${weekdays[dow]}`;

  const dayPosts = posts
    .filter(p => p.scheduledAt === date)
    .sort((a, b) => a.time.localeCompare(b.time));

  const byHour = dayPosts.reduce<Record<number, ScheduledPost[]>>((acc, p) => {
    const h = Math.max(0, Math.min(23, parseInt(p.time?.split(":")[0] ?? "0", 10) || 0));
    if (!acc[h]) acc[h] = [];
    acc[h].push(p);
    return acc;
  }, {});

  const postHours = Object.keys(byHour).map(Number);
  const skeletonHours = Array.from({ length: 17 }, (_, i) => i + 6);
  const visibleHours = Array.from(new Set([...skeletonHours, ...postHours])).sort((a, b) => a - b);

  return (
    <div className="rounded-2xl overflow-hidden" style={{background:"var(--bg-card)", border:"1px solid var(--border)"}}>
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between" style={{borderBottom:"1px solid var(--border-light)"}}>
        <div>
          <p className="text-sm font-semibold" style={{color:"var(--text-1)"}}>{dateLabel}</p>
          <p className="text-xs mt-0.5" style={{color:"var(--text-3)"}}>
            {dayPosts.length > 0 ? `${dayPosts.length}개 예약됨` : "예약 없음"}
          </p>
        </div>
        {dayPosts.length > 0 && (
          <div className="flex gap-1.5">
            {(["instagram","twitter","youtube"] as const).map(p => {
              const count = dayPosts.filter(post => post.platform === p).length;
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
        <div className="flex flex-col items-center justify-center py-14 text-center">
          <p className="text-3xl mb-3">🗓️</p>
          <p className="text-sm font-medium" style={{color:"var(--text-2)"}}>이 날 예약이 없어요</p>
          <p className="text-xs mt-1" style={{color:"var(--text-3)"}}>오른쪽 폼에서 포스트를 추가해보세요</p>
        </div>
      ) : (
        <div className="overflow-y-auto max-h-[520px]">
          {visibleHours.map(hour => {
            const hourPosts = byHour[hour] || [];
            const isEmpty = hourPosts.length === 0;
            return (
              <div key={hour} className={`flex gap-3 px-5 ${isEmpty ? "py-2" : "py-3"}`}
                style={{borderBottom:"1px solid var(--border-light)"}}>
                <span className="w-10 shrink-0 text-xs font-mono pt-0.5 tabular-nums"
                  style={{color: isEmpty ? "var(--border)" : "var(--text-2)", fontWeight: isEmpty ? 400 : 600}}>
                  {String(hour).padStart(2, "0")}:00
                </span>
                {isEmpty ? (
                  <div className="flex-1 flex items-center">
                    <div className="h-px w-full" style={{background:"var(--border-light)"}} />
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col gap-2">
                    {hourPosts.map(post => {
                      const cfg = PLATFORM_CONFIG[post.platform];
                      return (
                        <div key={post.id} className={`rounded-xl px-3 py-2.5 ${cfg.bg} ${cfg.border}`}
                          style={{borderWidth:"1px", borderStyle:"solid"}}>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className={`h-2 w-2 shrink-0 rounded-full mt-0.5 ${cfg.dot}`} />
                              <div>
                                <span className={`text-xs font-semibold ${cfg.color}`}>{PLATFORM_LABEL[post.platform]}</span>
                                <span className={`ml-1.5 text-xs ${cfg.color} opacity-60`}>{post.time}</span>
                              </div>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <button onClick={() => onEdit(post)} className={`text-[10px] ${cfg.color} opacity-50 hover:opacity-100 transition-opacity`}>편집</button>
                              <button onClick={() => onDuplicate(post)} className={`text-[10px] ${cfg.color} opacity-50 hover:opacity-100 transition-opacity`}>복제</button>
                              <button onClick={() => onDelete(post.id)} className="text-[10px] text-red-400 opacity-70 hover:opacity-100 transition-opacity">삭제</button>
                            </div>
                          </div>
                          <p className={`mt-1.5 text-xs ${cfg.color} opacity-75 break-words line-clamp-2 leading-relaxed`}>
                            {post.content}
                          </p>
                          {post.tags && post.tags.length > 0 && (
                            <div className="mt-1.5 flex flex-wrap gap-1">
                              {post.tags.map(tag => (
                                <span key={tag} className={`text-[9px] font-medium ${cfg.color} opacity-50`}>#{tag}</span>
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
