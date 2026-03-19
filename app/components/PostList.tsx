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
  const [publishMsg, setPublishMsg] = useState<{ id: string; text: string; ok: boolean } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  if (!selectedDate) return null;

  const dayPosts = posts
    .filter((p) => p.scheduledAt === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  const [year, month, day] = selectedDate.split("-").map(Number);
  const dateLabel = `${year}년 ${month}월 ${day}일`;

  async function handlePublish(post: ScheduledPost) {
    if (post.platform !== "twitter") {
      setPublishMsg({ id: post.id, text: "현재 Twitter/X만 즉시 발행을 지원합니다.", ok: false });
      setTimeout(() => setPublishMsg(null), 3000);
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
        setPublishMsg({ id: post.id, text: "트위터에 성공적으로 발행됐습니다!", ok: true });
      } else {
        setPublishMsg({ id: post.id, text: `발행 실패: ${data.error ?? "알 수 없는 오류"}`, ok: false });
      }
    } catch {
      setPublishMsg({ id: post.id, text: "발행 중 네트워크 오류가 발생했습니다.", ok: false });
    } finally {
      setPublishing(null);
      setTimeout(() => setPublishMsg(null), 3000);
    }
  }

  function handleDeleteClick(id: string) {
    setConfirmDelete(id);
  }

  function handleDeleteConfirm(id: string) {
    onDelete(id);
    setConfirmDelete(null);
  }

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
        <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
          {dateLabel}
          <span className="ml-2 text-xs font-normal text-zinc-400">{dayPosts.length}개</span>
        </h3>
        <button
          onClick={onClose}
          className="flex h-6 w-6 items-center justify-center rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-sm"
        >
          ✕
        </button>
      </div>

      {dayPosts.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <div className="text-2xl mb-2">📭</div>
          <p className="text-sm text-zinc-400 dark:text-zinc-500">이 날 예약된 포스트가 없습니다.</p>
          <p className="text-xs text-zinc-300 dark:text-zinc-600 mt-1">아래 폼에서 새 포스트를 등록해보세요.</p>
        </div>
      ) : (
        <ul className="divide-y divide-zinc-100 dark:divide-zinc-800 max-h-[420px] overflow-y-auto">
          {dayPosts.map((post) => {
            const cfg = PLATFORM_CONFIG[post.platform];
            const isPublished = published.has(post.id);
            const isConfirming = confirmDelete === post.id;

            return (
              <li key={post.id} className="flex items-start gap-3 px-5 py-4">
                <div className={`mt-1 h-2 w-2 shrink-0 rounded-full ${cfg.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-xs font-semibold ${cfg.color}`}>
                      {cfg.label}
                    </span>
                    <span className="text-xs text-zinc-400 dark:text-zinc-500">{post.time}</span>
                    {isPublished && (
                      <span className="text-[10px] bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400 rounded-full px-2 py-0.5 font-medium">
                        발행완료
                      </span>
                    )}
                    {post.status && post.status !== "draft" && !isPublished && (
                      <span className={`text-[10px] rounded-full px-2 py-0.5 font-medium ${
                        post.status === "approved" ? "bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400" :
                        post.status === "pending" ? "bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400" :
                        "bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400"
                      }`}>
                        {post.status === "approved" ? "승인됨" : post.status === "pending" ? "대기중" : "반려됨"}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 break-words leading-relaxed">{post.content}</p>
                  {post.tags && post.tags.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {post.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2 py-0.5 text-[10px] text-zinc-500 dark:text-zinc-400">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {post.imageUrl && (
                    <img src={post.imageUrl} alt="첨부 이미지" className="mt-2 rounded-lg w-full h-28 object-cover border border-zinc-100 dark:border-zinc-700" />
                  )}
                  {/* Inline publish message */}
                  {publishMsg?.id === post.id && (
                    <p className={`mt-2 text-xs font-medium ${publishMsg.ok ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
                      {publishMsg.text}
                    </p>
                  )}
                  {/* Delete confirmation */}
                  {isConfirming && (
                    <div className="mt-2 flex items-center gap-2">
                      <p className="text-xs text-red-500">정말 삭제할까요?</p>
                      <button
                        onClick={() => handleDeleteConfirm(post.id)}
                        className="text-xs font-semibold text-red-500 hover:text-red-700 underline"
                      >
                        삭제
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="text-xs text-zinc-400 hover:text-zinc-600"
                      >
                        취소
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1.5 shrink-0 pt-0.5">
                  {post.platform === "twitter" && !isPublished && (
                    <button
                      onClick={() => handlePublish(post)}
                      disabled={publishing === post.id}
                      className="text-xs text-sky-500 hover:text-sky-700 dark:hover:text-sky-300 font-semibold transition-colors disabled:opacity-50"
                    >
                      {publishing === post.id ? "발행 중..." : "지금 발행"}
                    </button>
                  )}
                  <button
                    onClick={() => onEdit(post)}
                    className="text-xs text-zinc-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                  >
                    편집
                  </button>
                  <button
                    onClick={() => onDuplicate(post)}
                    className="text-xs text-zinc-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                  >
                    복제
                  </button>
                  {!isConfirming && (
                    <button
                      onClick={() => handleDeleteClick(post.id)}
                      className="text-xs text-zinc-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    >
                      삭제
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
