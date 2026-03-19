"use client";

import { useState, useEffect } from "react";
import { Platform, ScheduledPost, PLATFORM_CONFIG, PLATFORM_CHAR_LIMIT } from "../types";

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
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (post) {
      setContent(post.content);
      setPlatform(post.platform);
      setDate(post.scheduledAt);
      setTime(post.time);
      setTags(post.tags ?? []);
      setTagInput("");
      setError("");
      setIsDirty(false);
    }
  }, [post]);

  if (!post) return null;

  const charLimit = PLATFORM_CHAR_LIMIT[platform];
  const charCount = content.length;
  const isOverLimit = charCount > charLimit;
  const charWarning = charCount > charLimit * 0.9;

  function handleClose() {
    if (isDirty) {
      if (!window.confirm("변경사항이 있습니다. 저장하지 않고 닫을까요?")) return;
    }
    onClose();
  }

  async function handleSave() {
    if (!content.trim()) { setError("내용을 입력해 주세요."); return; }
    if (isOverLimit) { setError(`내용이 너무 깁니다. ${charLimit}자 이내로 작성해주세요.`); return; }
    if (!date) { setError("날짜를 선택해 주세요."); return; }
    setSaving(true);
    await onSave({ ...post!, id: post!.id, createdAt: post!.createdAt, content: content.trim(), platform, scheduledAt: date, time, tags });
    setSaving(false);
    setIsDirty(false);
    onClose();
  }

  function addTag() {
    const t = tagInput.trim().replace(/^#/, "");
    if (t && !tags.includes(t)) {
      setTags((prev) => [...prev, t]);
      setIsDirty(true);
    }
    setTagInput("");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl border border-zinc-200 dark:border-zinc-700 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 dark:border-zinc-800 shrink-0">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">포스트 편집</h2>
          <button onClick={handleClose} className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Platform selector */}
          <div className="flex gap-2">
            {(["instagram", "twitter", "youtube"] as Platform[]).map((p) => {
              const cfg = PLATFORM_CONFIG[p];
              const selected = platform === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => { setPlatform(p); setIsDirty(true); }}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border transition-all
                    ${selected
                      ? `${cfg.bg} ${cfg.color} ${cfg.border} shadow-sm`
                      : "bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-600 hover:border-zinc-300 dark:hover:border-zinc-500"
                    }`}
                >
                  <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                  {cfg.label.split(" ")[0]}
                </button>
              );
            })}
          </div>

          {/* Content textarea + character counter */}
          <div>
            <textarea
              value={content}
              onChange={(e) => { setContent(e.target.value); setError(""); setIsDirty(true); }}
              rows={5}
              placeholder="포스트 내용을 입력하세요..."
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-3 text-sm text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition"
            />
            <div className="flex items-center justify-between mt-1">
              {error ? (
                <p className="text-xs text-red-500">{error}</p>
              ) : (
                <span />
              )}
              <span className={`text-xs font-medium ml-auto ${
                isOverLimit ? "text-red-500" : charWarning ? "text-amber-500" : "text-zinc-400 dark:text-zinc-500"
              }`}>
                {charCount.toLocaleString()} / {charLimit.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">태그</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
                    e.preventDefault();
                    addTag();
                  } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
                    setTags((prev) => prev.slice(0, -1));
                    setIsDirty(true);
                  }
                }}
                placeholder="태그 입력 후 Enter"
                className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
            {tags.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2 py-0.5 text-xs text-zinc-600 dark:text-zinc-300"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => { setTags((prev) => prev.filter((t) => t !== tag)); setIsDirty(true); }}
                      className="text-zinc-400 hover:text-red-500 transition-colors ml-0.5"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Date & time */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">날짜</label>
              <input
                type="date"
                value={date}
                onChange={(e) => { setDate(e.target.value); setIsDirty(true); }}
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
            <div className="w-32">
              <label className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1.5">시간</label>
              <input
                type="time"
                value={time}
                onChange={(e) => { setTime(e.target.value); setIsDirty(true); }}
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800 flex gap-3 shrink-0">
          <button
            onClick={handleClose}
            className="flex-1 rounded-xl border border-zinc-200 dark:border-zinc-700 py-2.5 text-sm font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={saving || isOverLimit}
            className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}
