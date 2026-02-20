'use client';

import { useState } from 'react';

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareUrl = window.location.origin + '/';
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // フォールバック：テキストエリアを使ってコピー
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleShare}
        className="flex items-center gap-2 rounded-lg border border-blue-300 bg-white px-5 py-2.5 text-blue-700 font-semibold text-sm shadow-sm hover:bg-blue-50 active:bg-blue-100 transition focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
        結果をシェアする
      </button>

      {copied && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap animate-fade-in">
          コピーしました！
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-800" />
        </div>
      )}
    </div>
  );
}
