"use client";

import React, { useState, useEffect } from "react";
import { calculateTimeRemaining } from "@/lib/utils";
import { Clock, Heart } from "lucide-react";

interface CountdownTimerProps {
  weddingDate: Date | string | null;
  primaryColor?: string;
  fontFamily?: string;
}

export default function CountdownTimer({
  weddingDate,
  primaryColor = "#B8972E",
  fontFamily = "Cinzel",
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeRemaining(weddingDate));
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeRemaining(weddingDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [weddingDate]);

  if (!isClient) {
    return (
      <div className="w-full max-w-2xl mx-auto py-8">
        <div className="grid grid-cols-4 gap-3 sm:gap-6 text-center animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-amber-100/40 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (timeLeft.isPast) {
    return (
      <div className="w-full max-w-xl mx-auto my-8 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 border border-amber-500/30 text-center">
        <div className="inline-flex p-3 rounded-full bg-amber-500/20 text-amber-600 mb-3">
          <Heart className="w-6 h-6 fill-current" />
        </div>
        <h3 className="text-xl sm:text-2xl font-serif text-gray-900 font-bold" style={{ fontFamily }}>
          Happily Ever After
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          The sacred vows have been made! Thank you for blessing our union with your love and presence.
        </p>
      </div>
    );
  }

  const timeUnits = [
    { label: "DAYS", knLabel: "ದಿನಗಳು", value: String(timeLeft.days).padStart(3, "0") },
    { label: "HOURS", knLabel: "ಗಂಟೆಗಳು", value: String(timeLeft.hours).padStart(2, "0") },
    { label: "MINS", knLabel: "ನಿಮಿಷ", value: String(timeLeft.minutes).padStart(2, "0") },
    { label: "SECS", knLabel: "ಸೆಕೆಂಡ್", value: String(timeLeft.seconds).padStart(2, "0") },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto my-10">
      <div className="flex items-center justify-center gap-2 mb-4 text-xs tracking-[0.2em] uppercase text-amber-800 font-medium font-kannada">
        <Clock className="w-3.5 h-3.5 text-amber-600" />
        <span>ವಿವಾಹ ಮಹೋತ್ಸವಕ್ಕೆ ಇನ್ನು • COUNTDOWN</span>
      </div>

      <div className="grid grid-cols-4 gap-2.5 sm:gap-5">
        {timeUnits.map((unit, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center p-3 sm:p-5 rounded-2xl bg-white/80 backdrop-blur-md shadow-md border border-amber-400/30 hover:border-amber-400/60 transition-all duration-300 hover:-translate-y-0.5"
          >
            <span
              className="text-2xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-gray-900"
              style={{ fontFamily, color: primaryColor }}
            >
              {unit.value}
            </span>
            <div className="flex flex-col items-center mt-1">
              <span className="text-[10px] sm:text-xs font-kannada font-bold text-amber-900 leading-tight">
                {unit.knLabel}
              </span>
              <span className="text-[8px] sm:text-[9px] font-semibold tracking-wider text-gray-400 uppercase">
                {unit.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
