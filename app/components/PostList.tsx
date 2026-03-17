"use client";

import { ScheduledPost, PLATFORM_CONFIG } from "../types";

interface PostListProps {
  posts: ScheduledPost[];
  selectedDate: string | null;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export default function PostList({
  posts,
  selectedDate,
  onDelete,
  onClose,
}: PostListProps) {
  if (!selectedDate) return null;

  const dayPosts = posts
    .filter((p) => p.scheduledAt === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  const [year, month, day] = selectedDate.split("-").map(Number);
  const dateLabel = `${year}년 ${month}월 ${day}일`;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
        <h3 className="text-sm font-semibold text-zinc-800">
          {dateLabel} 예약 포스트
        </h3>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-zinc-600 text-lg leading-none"
        >
          ✕
        </button>
      </div>

      {dayPosts.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-zinc-400">
          이 날 예약된 포스트가 없습니다.
        </p>
      ) : (
        <ul className="divide-y divide-zinc-100">
          {dayPosts.map((post) => {
            const cfg = PLATFORM_CONFIG[post.platform];
            return (
              <li key={post.id} className="flex items-start gap-3 px-5 py-4">
                <div
                  className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${cfg.dot}`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs font-semibold ${cfg.color}`}
                    >
                      {cfg.label}
                    </span>
                    <span className="text-xs text-zinc-400">{post.time}</span>
                  </div>
                  <p className="text-sm text-zinc-700 break-words">
                    {post.content}
                  </p>
                </div>
                <button
                  onClick={() => onDelete(post.id)}
                  className="shrink-0 text-xs text-zinc-400 hover:text-red-500 transition-colors"
                >
                  삭제
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
