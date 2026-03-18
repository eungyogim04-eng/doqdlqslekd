"use client";

import { useState } from "react";
import { ScheduledPost, PLATFORM_CONFIG } from "../types";

interface PostListProps {
  posts: ScheduledPost[];
  selectedDate: string | null;
  onDelete: (id: string) => void;
  onEdit: (post: ScheduledPost) => void;
  onClose: () => void;
  onDuplicate: (post: ScheduledPost) => void;
}

export default function PostList({
  posts,
  selectedDate,
  onDelete,
  onEdit,
  onClose,
  onDuplicate,
}: PostListProps) {
  const [publishing, setPublishing] = useState<string | null>(null);
  const [published, setPublished] = useState<Set<string>>(new Set());

  if (!selectedDate) return null;

  const dayPosts = posts
    .filter((p) => p.scheduledAt === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  const [year, month, day] = selectedDate.split("-").map(Number);
  const dateLabel = `${year}년 ${month}월 ${day}일`;

  async function handlePublish(post: ScheduledPost) {
    if (post.platform !== "twitter") {
      alert("현재 Twitter/X만 즉시 발행을 지원합니다.");
      return;
    }
    setPublishing(post.id);
    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: post.content, platform: post.platform }),
      });
      const data = await res.json();
      if (res.ok) {
        setPublished((prev) => new Set(prev).add(post.id));
        alert("트위터에 성공적으로 발행됐습니다! 🎉");
      } else {
        alert(`발행 실패: ${data.error}`);
      }
    } catch {
      alert("발행 중 오류가 발생했습니다.");
    } finally {
      setPublishing(null);
    }
  }

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
            const isPublished = published.has(post.id);
            return (
              <li key={post.id} className="flex items-start gap-3 px-5 py-4">
                <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${cfg.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold ${cfg.color}`}>
                      {cfg.label}
                    </span>
                    <span className="text-xs text-zinc-400">{post.time}</span>
                    {isPublished && (
                      <span className="text-xs bg-green-100 text-green-600 rounded-full px-2 py-0.5 font-medium">
                        발행완료
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-700 break-words">{post.content}</p>
                  {post.imageUrl && (
                    <img src={post.imageUrl} alt="" className="mt-2 rounded-lg w-full h-28 object-cover border border-zinc-100" />
                  )}
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  {post.platform === "twitter" && !isPublished && (
                    <button
                      onClick={() => handlePublish(post)}
                      disabled={publishing === post.id}
                      className="text-xs text-sky-500 hover:text-sky-700 font-semibold transition-colors disabled:opacity-50"
                    >
                      {publishing === post.id ? "발행 중..." : "지금 발행"}
                    </button>
                  )}
                  <button
                    onClick={() => onEdit(post)}
                    className="text-xs text-zinc-400 hover:text-indigo-500 transition-colors"
                  >
                    편집
                  </button>
                  <button
                    onClick={() => onDuplicate(post)}
                    className="text-xs text-zinc-400 hover:text-green-500 transition-colors"
                  >
                    복제
                  </button>
                  <button
                    onClick={() => onDelete(post.id)}
                    className="text-xs text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    삭제
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
