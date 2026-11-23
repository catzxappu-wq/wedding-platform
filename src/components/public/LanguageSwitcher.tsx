"use client";

import React from "react";
import { LanguageMode } from "@/lib/kannadaDictionary";
import { Languages } from "lucide-react";

interface LanguageSwitcherProps {
  currentLanguage: LanguageMode;
  onLanguageChange: (lang: LanguageMode) => void;
  primaryColor?: string;
}

export default function LanguageSwitcher({
  currentLanguage,
  onLanguageChange,
  primaryColor = "#B91C1C",
}: LanguageSwitcherProps) {
  const options: Array<{ id: LanguageMode; label: string; subLabel: string }> = [
    { id: "kannada", label: "ಕನ್ನಡ", subLabel: "Kannada" },
    { id: "bilingual", label: "ದ್ವಿಭಾಷಾ", subLabel: "Bilingual" },
    { id: "english", label: "English", subLabel: "Eng" },
  ];

  return (
    <div className="inline-flex items-center gap-1 p-1 rounded-full bg-white/90 backdrop-blur-md border border-amber-400/40 shadow-lg text-xs font-semibold">
      <div className="flex items-center pl-2 pr-1 text-amber-800">
        <Languages className="w-3.5 h-3.5 text-amber-600" />
      </div>
      {options.map((opt) => {
        const isActive = currentLanguage === opt.id;
        return (
          <button
            key={opt.id}
            onClick={() => onLanguageChange(opt.id)}
            className={`px-3 py-1.5 rounded-full transition-all text-xs flex items-center gap-1 cursor-pointer ${
              isActive
                ? "bg-amber-700 text-amber-50 shadow-sm font-bold scale-102"
                : "text-gray-700 hover:text-amber-900 hover:bg-amber-100/50"
            }`}
          >
            <span className={opt.id === "kannada" || opt.id === "bilingual" ? "font-kannada" : ""}>
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
