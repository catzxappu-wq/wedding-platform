"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Heart, Sun, Flame, Check } from "lucide-react";

// ==========================================
// 1. SACRED LORD GANESHA SVG ICON
// ==========================================
export function GaneshaIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Crown / Mukut */}
      <path
        d="M50 8 L58 24 L42 24 Z"
        fill="currentColor"
        opacity="0.9"
      />
      <circle cx="50" cy="14" r="2.5" fill="#FDE047" />
      <path
        d="M40 24 Q50 18 60 24 L57 32 Q50 28 43 32 Z"
        fill="currentColor"
      />

      {/* Ears */}
      <path
        d="M42 30 C24 30 20 48 32 54 C36 46 38 40 42 38"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M58 30 C76 30 80 48 68 54 C64 46 62 40 58 38"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Head & Forehead Tilak */}
      <circle cx="50" cy="38" r="9" fill="currentColor" opacity="0.3" />
      {/* Trishul / Tilak on forehead */}
      <path
        d="M50 28 L50 38 M47 31 Q50 35 53 31"
        stroke="#DC2626"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="50" cy="40" r="1.5" fill="#EAB308" />

      {/* Trunk (Curving Right into auspicious Modak) */}
      <path
        d="M50 42 Q50 56 46 66 Q42 74 48 76 Q54 77 54 70 Q54 60 52 50"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Modak in trunk */}
      <circle cx="48" cy="74" r="3.5" fill="#FACC15" stroke="currentColor" strokeWidth="1" />

      {/* Auspicious Aura Sparks */}
      <circle cx="34" cy="20" r="1" fill="currentColor" opacity="0.6" />
      <circle cx="66" cy="20" r="1" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

// ==========================================
// 2. PURNA KALASH WITH COCONUT & MANGO LEAVES
// ==========================================
export function KalashIcon({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Coconut at top */}
      <ellipse cx="50" cy="34" rx="10" ry="13" fill="#78350F" />
      <path d="M50 20 L50 24" stroke="#451A03" strokeWidth="2" strokeLinecap="round" />

      {/* Mango leaves spreading outward */}
      <path
        d="M50 42 Q32 30 26 18 Q36 28 46 38"
        fill="#15803D"
      />
      <path
        d="M50 42 Q68 30 74 18 Q64 28 54 38"
        fill="#15803D"
      />
      <path
        d="M50 42 Q42 22 40 10 Q48 24 50 36"
        fill="#16A34A"
      />
      <path
        d="M50 42 Q58 22 60 10 Q52 24 50 36"
        fill="#16A34A"
      />

      {/* Kalash Pot (Gold) */}
      <path
        d="M38 46 H62 L66 52 C72 62 68 76 50 78 C32 76 28 62 34 52 Z"
        fill="currentColor"
        stroke="#CA8A04"
        strokeWidth="2"
      />

      {/* Sacred Swastik / Shubh Mark on Kalash */}
      <circle cx="50" cy="62" r="3.5" fill="#DC2626" />
      <path d="M46 62 H54 M50 58 V66" stroke="#FEF08A" strokeWidth="1.5" strokeLinecap="round" />

      {/* Base stand */}
      <path d="M40 78 H60 L62 82 H38 Z" fill="currentColor" opacity="0.9" />
    </svg>
  );
}

// ==========================================
// 3. TRADITIONAL DIYA (OIL LAMP) WITH GLOW
// ==========================================
export function DiyaIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Flame glow */}
      <circle cx="50" cy="30" r="14" fill="#F59E0B" opacity="0.25" className="animate-pulse" />
      {/* Flame */}
      <path
        d="M50 14 C56 26 58 34 54 38 C50 42 46 38 46 34 C42 26 46 20 50 14 Z"
        fill="#F59E0B"
      />
      <path
        d="M50 20 C53 27 54 32 52 35 C50 38 48 35 48 32 C46 27 48 24 50 20 Z"
        fill="#FEF08A"
      />
      {/* Diya Clay Base */}
      <path
        d="M20 50 Q50 46 80 50 C76 72 58 76 50 76 C42 76 24 72 20 50 Z"
        fill="currentColor"
        stroke="#B45309"
        strokeWidth="2"
      />
      <ellipse cx="50" cy="50" rx="30" ry="6" fill="#78350F" />
      {/* Base Stand */}
      <path d="M42 76 H58 L62 82 H38 Z" fill="currentColor" opacity="0.9" />
    </svg>
  );
}

// ==========================================
// 4. MARIGOLD & MANGO LEAF TORAN (TOP BORDER)
// ==========================================
export function ToranBorder() {
  return (
    <div className="w-full overflow-hidden leading-none select-none pointer-events-none">
      <div className="flex items-center justify-center space-x-2 sm:space-x-4 py-1 bg-amber-700/10 border-b border-amber-600/30">
        {[...Array(14)].map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            {/* Hanging string */}
            <div className="w-[1.5px] h-3 bg-amber-600/50" />
            {/* Mango leaf */}
            <div
              className={`w-3.5 h-6 rounded-b-full bg-emerald-700 shadow-sm transition-transform ${
                i % 2 === 0 ? "rotate-6" : "-rotate-6"
              }`}
            />
            {/* Marigold flower (Genda Phool) */}
            <div
              className={`w-5 h-5 rounded-full shadow-md flex items-center justify-center text-[9px] -mt-1 font-bold ${
                i % 2 === 0
                  ? "bg-amber-500 text-amber-950 border border-amber-400"
                  : "bg-orange-600 text-orange-100 border border-orange-400"
              }`}
            >
              ✿
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 5. AUSPICIOUS SHLOKA & GANESHA BANNER
// ==========================================
export function GaneshaInvocationBanner({ primaryColor = "#B91C1C" }: { primaryColor?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative max-w-xl mx-auto text-center px-4 pt-8 pb-4"
    >
      {/* Decorative Jharokha Arch Frame */}
      <div className="relative p-6 rounded-3xl bg-amber-500/5 border border-amber-500/30 backdrop-blur-sm shadow-xl space-y-4">
        {/* Diyas on Left and Right */}
        <div className="absolute top-4 left-4 text-amber-600">
          <DiyaIcon className="w-8 h-8" />
        </div>
        <div className="absolute top-4 right-4 text-amber-600">
          <DiyaIcon className="w-8 h-8" />
        </div>

        {/* Golden Ganesha Emblem */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-b from-amber-100 to-amber-200 border-2 border-amber-400 shadow-lg text-amber-700 flex items-center justify-center mx-auto p-2">
          <GaneshaIcon className="w-12 h-12" />
        </div>

        {/* Sanskrit Invocation */}
        <div className="space-y-1.5">
          <h3
            className="text-lg sm:text-2xl font-serif font-bold tracking-wider"
            style={{ color: primaryColor }}
          >
            ॥ श्री गणेशाय नमः ॥
          </h3>
          <p className="text-xs sm:text-sm font-serif italic text-amber-950/80 leading-relaxed max-w-md mx-auto">
            वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। <br className="hidden sm:inline" />
            निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥
          </p>
        </div>

        {/* English Translation */}
        <p className="text-[11px] uppercase tracking-widest text-amber-800/70 font-semibold font-sans">
          "O Lord with the curved trunk and immense brilliance of millions of suns, please bless our union and remove all obstacles."
        </p>

        {/* Auspicious Shubh Vivah Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-600 text-amber-50 text-[11px] font-bold uppercase tracking-widest shadow-sm">
          <span>शुभ विवाह</span>
          <span>•</span>
          <span>Auspicious Wedding Union</span>
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// 6. SACRED SAAT PHERE (SEVEN VOWS) SECTION
// ==========================================
interface SaatPhereSectionProps {
  primaryColor?: string;
  fontFamily?: string;
}

export function SaatPhereSection({
  primaryColor = "#B91C1C",
  fontFamily = "Cinzel",
}: SaatPhereSectionProps) {
  const [activePhere, setActivePhere] = useState<number>(0);

  const pheras = [
    {
      num: 1,
      title: "First Vow (Pratham Phere)",
      sanskrit: "इष एकपदी भव सा मामनुव्रता भव",
      meaning: "A sacred prayer for nourishment, good health, and shared prosperity. We vow to nourish each other and our family with pure love and devotion.",
      symbol: "🌾 Nourishment & Health",
    },
    {
      num: 2,
      title: "Second Vow (Dwitiya Phere)",
      sanskrit: "ऊर्जे द्विपदी भव सा मामनुव्रता भव",
      meaning: "A vow of mutual strength, physical vitality, mental courage, and spiritual steadfastness through all tides of life.",
      symbol: "🛡️ Strength & Resilience",
    },
    {
      num: 3,
      title: "Third Vow (Tritiya Phere)",
      sanskrit: "रायस्पोषाय त्रिपदी भव सा मामनुव्रता भव",
      meaning: "A prayer for righteous wealth, prosperity, and charity. We promise to earn honestly and share generously with society.",
      symbol: "💰 Prosperity & Dharma",
    },
    {
      num: 4,
      title: "Fourth Vow (Chaturthi Phere)",
      sanskrit: "मायोभव्याय चतुष्पदी भव सा मामनुव्रता भव",
      meaning: "A pledge of profound mutual trust, lifelong harmony, emotional understanding, and happiness in our shared household.",
      symbol: "🕊️ Harmony & Trust",
    },
    {
      num: 5,
      title: "Fifth Vow (Pancham Phere)",
      sanskrit: "प्रजाभ्यः पञ्चपदी भव सा मामनुव्रता भव",
      meaning: "A prayer for noble, virtuous children, wisdom, compassion, and caring for all living beings around us.",
      symbol: "🌱 Compassion & Lineage",
    },
    {
      num: 6,
      title: "Sixth Vow (Shashtha Phere)",
      sanskrit: "ऋतुभ्यः षट्पदी भव सा मामनुव्रता भव",
      meaning: "A promise of lifelong togetherness and joyful companionship across all seasons, joys, and hardships.",
      symbol: "🌸 All Seasons of Life",
    },
    {
      num: 7,
      title: "Seventh Vow (Saptam Phere)",
      sanskrit: "सखे सप्तपदी भव सा मामनुव्रता भव",
      meaning: "The culmination of eternal friendship, spiritual oneness, and undying fidelity. Two bodies, two minds, forever one soul.",
      symbol: "❤️ Eternal Friendship",
    },
  ];

  return (
    <section className="py-16 px-4 max-w-5xl mx-auto">
      <div className="text-center mb-10 space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-800 text-xs tracking-widest uppercase font-semibold">
          <Flame className="w-3.5 h-3.5 text-amber-600" />
          <span>Sacred Vedic Rituals</span>
        </div>
        <h2
          className="text-3xl sm:text-4xl font-serif font-bold text-gray-900"
          style={{ fontFamily }}
        >
          The Sacred Saat Phere
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto">
          Seven sacred rounds around the holy Agni (fire), sealing seven eternal promises of love, loyalty, and companionship.
        </p>
      </div>

      {/* Pheras Grid Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 mb-8">
        {pheras.map((p, index) => {
          const isActive = activePhere === index;
          return (
            <button
              key={p.num}
              onClick={() => setActivePhere(index)}
              className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                isActive
                  ? "bg-amber-600 text-white border-amber-600 shadow-lg scale-105"
                  : "bg-white/80 hover:bg-white text-gray-700 border-amber-300/40 hover:border-amber-400"
              }`}
            >
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                Phera {p.num}
              </span>
              <span className="text-xs font-serif font-bold truncate max-w-full">
                {p.symbol.split(" ")[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Phera Spotlight Card */}
      <motion.div
        key={activePhere}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl bg-gradient-to-br from-amber-50 via-white to-orange-50 border-2 border-amber-400/50 p-6 sm:p-8 shadow-xl relative overflow-hidden text-center space-y-4"
      >
        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto text-lg font-bold shadow-inner border border-amber-300">
          {pheras[activePhere].num}
        </div>

        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-700 block mb-1">
            {pheras[activePhere].symbol}
          </span>
          <h3
            className="text-xl sm:text-2xl font-serif font-bold text-gray-900"
            style={{ fontFamily }}
          >
            {pheras[activePhere].title}
          </h3>
          <p
            className="text-base sm:text-lg font-serif italic text-amber-900 mt-2 font-medium"
            style={{ color: primaryColor }}
          >
            "{pheras[activePhere].sanskrit}"
          </p>
        </div>

        <p className="text-sm sm:text-base text-gray-700 max-w-2xl mx-auto leading-relaxed">
          {pheras[activePhere].meaning}
        </p>

        {/* Stepper Dots */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {pheras.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActivePhere(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                idx === activePhere ? "bg-amber-600 w-6" : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

// ==========================================
// 7. MANGALYA DHARANAM & FAMILY BLESSINGS BANNER
// ==========================================
interface FamilyBlessingsProps {
  familyMessage?: string | null;
  familyNames?: string | null;
  primaryColor?: string;
  fontFamily?: string;
}

export function FamilyBlessingsBanner({
  familyMessage,
  familyNames,
  primaryColor = "#B91C1C",
  fontFamily = "Cinzel",
}: FamilyBlessingsProps) {
  return (
    <section className="py-12 px-4 max-w-4xl mx-auto text-center">
      <div className="relative p-8 rounded-3xl bg-white/90 border border-amber-400/40 shadow-xl backdrop-blur-md space-y-4">
        {/* Kalash on Top */}
        <div className="w-14 h-14 rounded-2xl bg-amber-100/80 text-amber-700 flex items-center justify-center mx-auto shadow-sm border border-amber-300/40">
          <KalashIcon className="w-10 h-10" />
        </div>

        {/* Sanskrit Blessing */}
        <div className="space-y-1">
          <h4
            className="text-base sm:text-lg font-serif font-bold tracking-wide"
            style={{ color: primaryColor }}
          >
            माङ्गल्यं तन्तुनानेन लोकजीवनहेतुना।
          </h4>
          <p className="text-xs sm:text-sm font-serif italic text-amber-900/80">
            कण्ठे बध्नामि सुभगे सञ्जीव शरदः शतम्॥
          </p>
        </div>

        {/* Family Message */}
        <div className="pt-2 max-w-xl mx-auto space-y-2">
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-serif">
            "{familyMessage || "With the blessings of our elders and almighty God, we warmly invite you and your family to grace this auspicious celebration."}"
          </p>

          {familyNames && (
            <p className="text-xs sm:text-sm font-serif font-bold text-gray-900 tracking-wide pt-1">
              — {familyNames}
            </p>
          )}
        </div>

        {/* Folded Hands Namaste Footer */}
        <div className="inline-flex items-center gap-2 pt-2 text-xs font-semibold text-amber-800 uppercase tracking-widest">
          <span>🙏 अतिथि देवो भव • Welcome With Folded Hands 🙏</span>
        </div>
      </div>
    </section>
  );
}
