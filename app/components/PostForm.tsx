"use client";

import { useState } from "react";
import { Platform, ScheduledPost, PLATFORM_CONFIG } from "../types";

interface PostFormProps {
  defaultDate?: string;
  onAdd: (post: ScheduledPost) => void;
}

export default function PostForm({ defaultDate, onAdd }: PostFormProps) {
  const today = new Date().toISOString().split("T")[0];
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [date, setDate] = useState(defaultDate ?? today);
  const [time, setTime] = useState("09:00");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) {
      setError("내용을 입력해 주세요.");
      return;
    }
    if (!date) {
      setError("날짜를 선택해 주세요.");
      return;
    }

    const post: ScheduledPost = {
      id: crypto.randomUUID(),
      content: content.trim(),
      platform,
      scheduledAt: date,
      time,
      createdAt: new Date().toISOString(),
    };

    onAdd(post);
    setContent("");
    setError("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-zinc-200 bg-white shadow-sm p-5"
    >
      <h2 className="text-sm font-semibold text-zinc-800 mb-4">새 포스트 예약</h2>

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
                ${
                  selected
                    ? `${cfg.bg} ${cfg.color} ${cfg.border} shadow-sm`
                    : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300"
                }`}
            >
              <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </button>
          );
        })}
      </div>

      {/* Content textarea */}
      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setError("");
        }}
        placeholder="포스트 내용을 입력하세요…"
        rows={3}
        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition"
      />

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

      {/* Date & time */}
      <div className="mt-3 flex gap-3">
        <div className="flex-1">
          <label className="block text-xs text-zinc-500 mb-1">날짜</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>
        <div className="w-32">
          <label className="block text-xs text-zinc-500 mb-1">시간</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 active:bg-indigo-800 transition-colors"
      >
        예약 등록
      </button>
    </form>
  );
}
