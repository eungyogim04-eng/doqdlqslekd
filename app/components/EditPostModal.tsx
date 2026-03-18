"use client";

import { useState, useEffect } from "react";
import { Platform, ScheduledPost, PLATFORM_CONFIG } from "../types";

interface EditPostModalProps {
  post: ScheduledPost | null;
  onClose: () => void;
  onSave: (updated: ScheduledPost) => void;
}

export default function EditPostModal({ post, onClose, onSave }: EditPostModalProps) {
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (post) {
      setContent(post.content);
      setPlatform(post.platform);
      setDate(post.scheduledAt);
      setTime(post.time);
      setError("");
    }
  }, [post]);

  if (!post) return null;

  async function handleSave() {
    if (!content.trim()) { setError("내용을 입력해 주세요."); return; }
    setSaving(true);
    await onSave({ ...post!, content: content.trim(), platform, scheduledAt: date, time });
    setSaving(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl p-6 border border-zinc-200 dark:border-zinc-700">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">포스트 편집</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Platform selector */}
        <div className="flex gap-2 mb-4">
          {(["instagram", "twitter", "youtube"] as Platform[]).map((p) => {
            const cfg = PLATFORM_CONFIG[p];
            const selected = platform === p;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setPlatform(p)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border transition-all
                  ${selected
                    ? `${cfg.bg} ${cfg.color} ${cfg.border} shadow-sm`
                    : "bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-600 hover:border-zinc-300 dark:hover:border-zinc-500"
                  }`}
              >
                <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                {cfg.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <textarea
          value={content}
          onChange={(e) => { setContent(e.target.value); setError(""); }}
          rows={5}
          className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-3 text-sm text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition"
        />
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

        {/* Date & time */}
        <div className="mt-3 flex gap-3">
          <div className="flex-1">
            <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">날짜</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>
          <div className="w-32">
            <label className="block text-xs text-zinc-500 dark:text-zinc-400 mb-1">시간</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-700 py-2.5 text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors disabled:opacity-60"
          >
            {saving ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}
