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

const PLATFORM_LABELS: Record<string, string> = {
  instagram: "📸 Instagram",
  twitter: "🐦 Twitter/X",
  youtube: "🎬 YouTube",
};

export default function PostList({ posts, selectedDate, onDelete, onEdit, onClose, onDuplicate }: PostListProps) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [publishMsg, setPublishMsg] = useState<string | null>(null);

  if (!selectedDate) return null;

  const [, m, d] = selectedDate.split("-").map(Number);
  const dateLabel = `${m}월 ${d}일`;

  const dayPosts = posts
    .filter(p => p.scheduledAt === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  async function handlePublish(post: ScheduledPost) {
    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post.id }),
      });
      const data = await res.json();
      setPublishMsg(data.message ?? "발행 요청이 전송됐어요 ✓");
      setTimeout(() => setPublishMsg(null), 3000);
    } catch {
      setPublishMsg("발행 중 오류가 발생했어요.");
      setTimeout(() => setPublishMsg(null), 3000);
    }
  }

  async function handleDeleteConfirm(id: string) {
    await onDelete(id);
    setConfirmDelete(null);
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{background:"var(--bg-card)", border:"1px solid var(--border)"}}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5" style={{borderBottom:"1px solid var(--border-light)"}}>
        <div>
          <p className="text-sm font-semibold" style={{color:"var(--text-1)"}}>{dateLabel}</p>
          <p className="text-xs mt-0.5" style={{color:"var(--text-3)"}}>
            {dayPosts.length > 0 ? `${dayPosts.length}개 예약됨` : "예약 없음"}
          </p>
        </div>
        <button onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-full transition-colors"
          style={{color:"var(--text-3)"}}
          onMouseEnter={e=>(e.currentTarget.style.background="var(--bg-hover)")}
          onMouseLeave={e=>(e.currentTarget.style.background="")}>
          ✕
        </button>
      </div>

      {publishMsg && (
        <div className="mx-4 mt-3 rounded-xl px-3 py-2 text-xs font-medium"
          style={{background:"var(--accent-bg)", color:"var(--accent-text)"}}>
          {publishMsg}
        </div>
      )}

      {dayPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <p className="text-2xl mb-2">🗓️</p>
          <p className="text-sm font-medium" style={{color:"var(--text-2)"}}>예약된 포스트가 없어요</p>
          <p className="text-xs mt-1" style={{color:"var(--text-3)"}}>아래 폼으로 추가해보세요</p>
        </div>
      ) : (
        <div className="max-h-[400px] overflow-y-auto">
          {dayPosts.map((post) => {
            const cfg = PLATFORM_CONFIG[post.platform];
            const isConfirming = confirmDelete === post.id;
            return (
              <div key={post.id} className="px-4 py-3 transition-colors"
                style={{borderBottom:"1px solid var(--border-light)"}}
                onMouseEnter={e=>(e.currentTarget.style.background="var(--bg-hover)")}
                onMouseLeave={e=>(e.currentTarget.style.background="")}>

                <div className={`rounded-xl p-3 ${cfg.bg} ${cfg.border}`} style={{borderWidth:"1px", borderStyle:"solid"}}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full shrink-0 ${cfg.dot}`} />
                      <span className={`text-xs font-semibold ${cfg.color}`}>
                        {PLATFORM_LABELS[post.platform]}
                      </span>
                      <span className={`text-xs ${cfg.color} opacity-60`}>{post.time}</span>
                    </div>
                    {post.status && (
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold shrink-0 ${
                        post.status === "approved" ? "bg-emerald-100 text-emerald-700" :
                        post.status === "rejected" ? "bg-red-100 text-red-600" :
                        "bg-amber-100 text-amber-700"
                      }`}>
                        {post.status === "approved" ? "✓ 승인" : post.status === "rejected" ? "✗ 반려" : "대기"}
                      </span>
                    )}
                  </div>
                  <p className={`mt-2 text-xs leading-relaxed line-clamp-3 ${cfg.color} opacity-80`}>
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

                {!isConfirming ? (
                  <div className="flex items-center gap-3 mt-2 px-1">
                    <button onClick={() => onEdit(post)} className="text-[11px] font-medium hover:opacity-70 transition-opacity"
                      style={{color:"var(--text-3)"}}>✏️ 편집</button>
                    <button onClick={() => onDuplicate(post)} className="text-[11px] font-medium hover:opacity-70 transition-opacity"
                      style={{color:"var(--text-3)"}}>📋 복제</button>
                    <button onClick={() => handlePublish(post)} className="text-[11px] font-medium hover:opacity-70 transition-opacity"
                      style={{color:"var(--text-3)"}}>🚀 발행</button>
                    <button onClick={() => setConfirmDelete(post.id)}
                      className="text-[11px] font-medium ml-auto hover:opacity-70 transition-opacity"
                      style={{color:"#F87171"}}>삭제</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mt-2 px-1">
                    <p className="text-[11px]" style={{color:"var(--text-2)"}}>정말 삭제할까요?</p>
                    <button onClick={() => handleDeleteConfirm(post.id)}
                      className="text-[11px] font-semibold rounded-full px-2.5 py-1 text-white"
                      style={{background:"#F87171"}}>삭제</button>
                    <button onClick={() => setConfirmDelete(null)}
                      className="text-[11px] font-medium rounded-full px-2.5 py-1"
                      style={{background:"var(--bg-hover)", color:"var(--text-2)"}}>취소</button>
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
