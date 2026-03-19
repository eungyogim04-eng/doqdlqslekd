"use client";

import { useState, useEffect, useRef } from "react";

interface LinkPreviewData {
  title: string;
  description: string;
  image: string;
  siteName: string;
  url: string;
}

interface LinkPreviewProps {
  content: string;
}

function extractUrl(text: string): string | null {
  const match = text.match(/https?:\/\/[^\s]+/);
  return match ? match[0] : null;
}

export default function LinkPreview({ content }: LinkPreviewProps) {
  const [preview, setPreview] = useState<LinkPreviewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const lastUrl = useRef<string>("");

  useEffect(() => {
    const url = extractUrl(content);
    if (!url) {
      setPreview(null);
      setError(false);
      setDismissed(false);
      lastUrl.current = "";
      return;
    }
    if (url === lastUrl.current || dismissed) return;

    const timer = setTimeout(async () => {
      lastUrl.current = url;
      setLoading(true);
      setError(false);
      setPreview(null);
      try {
        const res = await fetch("/api/link-preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
        const data = await res.json();
        if (res.ok && data.title) {
          setPreview(data);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [content, dismissed]);

  if (!extractUrl(content)) return null;

  if (loading) {
    return (
      <div className="mt-2 flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2">
        <svg className="animate-spin h-3.5 w-3.5 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span className="text-xs text-zinc-400">링크 미리보기 로드 중...</span>
      </div>
    );
  }

  if (error || !preview) return null;

  return (
    <div className="mt-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 overflow-hidden shadow-sm">
      <div className="flex gap-3">
        {preview.image && (
          <div className="shrink-0 w-20 h-16 overflow-hidden bg-zinc-100 dark:bg-zinc-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview.image}
              alt={preview.title}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          </div>
        )}
        <div className="flex-1 min-w-0 py-2 pr-2">
          {preview.siteName && (
            <p className="text-[10px] font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-wide truncate">
              {preview.siteName}
            </p>
          )}
          <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate leading-tight">
            {preview.title}
          </p>
          {preview.description && (
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-0.5 leading-snug">
              {preview.description}
            </p>
          )}
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5 truncate">
            {preview.url.replace(/^https?:\/\//, "").split("/")[0]}
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setPreview(null); setDismissed(true); }}
          className="shrink-0 self-start mt-2 mr-2 text-zinc-300 dark:text-zinc-600 hover:text-zinc-500 dark:hover:text-zinc-400 transition-colors"
          title="미리보기 닫기"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
