"use client";

import React, { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";

interface MusicPlayerProps {
  musicUrl?: string | null;
  musicTitle?: string | null;
  primaryColor?: string;
}

export default function MusicPlayer({
  musicUrl,
  musicTitle = "Royal Wedding Harmony",
  primaryColor = "#B8972E",
}: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Default soothing copyright-free Indian wedding flute/sitar music fallback if none uploaded
  const effectiveAudioUrl =
    musicUrl || "https://assets.mixkit.co/music/preview/mixkit-indian-traditional-sitar-2615.mp3";

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Audio playback prevented:", err);
          setIsPlaying(false);
        });
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={effectiveAudioUrl}
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Mute music" : "Play wedding music"}
          className="group flex items-center gap-2.5 px-3.5 py-2.5 rounded-full shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 border border-white/20"
          style={{
            backgroundColor: isPlaying ? "rgba(18, 22, 33, 0.9)" : "rgba(30, 36, 50, 0.8)",
            color: "#FFF",
          }}
        >
          {/* Animated visualizer bars */}
          <div className="flex items-end gap-0.5 h-4 w-4">
            <span
              className={`w-1 bg-amber-400 rounded-full transition-all duration-200 ${
                isPlaying ? "animate-pulse h-4" : "h-1.5"
              }`}
            />
            <span
              className={`w-1 bg-amber-300 rounded-full transition-all duration-300 ${
                isPlaying ? "animate-pulse h-3" : "h-2.5"
              }`}
            />
            <span
              className={`w-1 bg-amber-400 rounded-full transition-all duration-150 ${
                isPlaying ? "animate-pulse h-4" : "h-1"
              }`}
            />
          </div>

          <div className="hidden sm:flex flex-col text-left max-w-[120px] truncate">
            <span className="text-[10px] text-amber-300/80 uppercase tracking-widest font-sans">
              {isPlaying ? "Music Playing" : "Wedding Music"}
            </span>
            <span className="text-xs text-white/90 truncate font-serif">
              {musicTitle || "Royal Melody"}
            </span>
          </div>

          <div className="p-1 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
            {isPlaying ? (
              <Volume2 className="w-4 h-4 text-amber-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-white/60" />
            )}
          </div>
        </button>
      </div>
    </>
  );
}
