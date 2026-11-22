"use client";

import React, { useState } from "react";
import { Share2, Copy, Check, MessageCircle, Send, X } from "lucide-react";

interface ShareModalProps {
  slug: string;
  coupleTitle: string;
  weddingDate?: Date | string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareModal({
  slug,
  coupleTitle,
  weddingDate,
  isOpen,
  onClose,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentOrigin =
    typeof window !== "undefined" ? window.location.origin : "https://weddingplatform.com";
  const shareUrl = `${currentOrigin}/invite/${slug}`;

  const formattedDate = weddingDate
    ? new Date(weddingDate).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const shareText = `With joyful hearts, we invite you to celebrate the wedding of ${coupleTitle}${
    formattedDate ? ` on ${formattedDate}` : ""
  }. Tap here to view the invitation & events:`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${shareText}\n${shareUrl}`
  )}`;

  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
    shareUrl
  )}&text=${encodeURIComponent(shareText)}`;

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    shareUrl
  )}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-amber-300/40 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
            <Share2 className="w-6 h-6" />
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-gray-900">
            Share Invitation
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Send this digital wedding card to family and friends.
          </p>
        </div>

        {/* Copy Link Input Bar */}
        <div className="flex items-center gap-2 p-2 rounded-2xl bg-gray-50 border border-gray-200 mb-6">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 bg-transparent px-3 text-xs text-gray-700 outline-none truncate"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-300" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Social Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 transition-all text-center gap-1.5"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold">WhatsApp</span>
          </a>

          <a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 transition-all text-center gap-1.5"
          >
            <div className="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center">
              <Send className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold">Telegram</span>
          </a>

          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 transition-all text-center gap-1.5"
          >
            <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              f
            </div>
            <span className="text-xs font-semibold">Facebook</span>
          </a>
        </div>
      </div>
    </div>
  );
}
