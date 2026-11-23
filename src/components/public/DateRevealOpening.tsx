"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart, Mail, ChevronDown } from "lucide-react";
import { getKannadaName } from "@/lib/kannadaDictionary";

interface DateRevealOpeningProps {
  groomName: string;
  brideName: string;
  weddingDate: Date | string | null;
  weddingTitle: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  onOpenComplete: () => void;
}

export default function DateRevealOpening({
  groomName,
  brideName,
  weddingDate,
  weddingTitle,
  primaryColor,
  secondaryColor,
  accentColor,
  fontFamily,
  onOpenComplete,
}: DateRevealOpeningProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const groomKannada = getKannadaName(groomName);
  const brideKannada = getKannadaName(brideName);

  const formattedDate = weddingDate
    ? new Date(weddingDate).toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "18 December 2026";

  const handleOpenEnvelope = () => {
    setIsOpen(true);
    setTimeout(() => {
      setIsRevealed(true);
    }, 900);
  };

  const handleEnterWebsite = () => {
    onOpenComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-[#0A0D14]"
      style={{
        backgroundImage: `radial-gradient(circle at 50% 40%, rgba(184, 151, 46, 0.15) 0%, rgba(10, 13, 20, 0.98) 75%)`,
      }}
    >
      {/* Background Floating Ornaments */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-10 left-10 w-72 h-72 rounded-full blur-3xl bg-amber-500/10 animate-pulse-subtle" />
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full blur-3xl bg-rose-500/10 animate-pulse-subtle" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl bg-yellow-500/5" />
      </div>

      <div className="relative w-full max-w-lg mx-auto flex flex-col items-center">
        {/* Top Floating Prompt */}
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center mb-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-950/40 backdrop-blur-md text-amber-200/90 text-xs tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
              <span>You Are Cordially Invited</span>
            </div>
            <h1
              className="mt-4 text-2xl sm:text-3xl text-amber-100/90 font-serif tracking-wide"
              style={{ fontFamily }}
            >
              {groomName} & {brideName}
            </h1>
          </motion.div>
        )}

        {/* 3D Envelope Container */}
        <div className="relative w-full aspect-[4/3] max-w-md perspective-1000">
          <AnimatePresence>
            {!isOpen ? (
              // Unopened Envelope with Wax Seal
              <motion.div
                key="envelope-closed"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="relative w-full h-full rounded-2xl shadow-2xl p-1 bg-gradient-to-br from-amber-200/30 via-amber-600/20 to-amber-900/40 border border-amber-500/40 flex flex-col justify-between overflow-hidden cursor-pointer group"
                onClick={handleOpenEnvelope}
              >
                {/* Envelope Body Texture */}
                <div className="relative w-full h-full rounded-xl bg-[#141824] p-6 flex flex-col items-center justify-between border border-amber-500/20 overflow-hidden">
                  {/* Decorative corner borders */}
                  <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-500/50" />
                  <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-500/50" />
                  <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-500/50" />
                  <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-500/50" />

                  {/* Envelope Flap Triangles Simulation */}
                  <div className="text-center mt-3">
                    <span className="text-amber-400 font-kannada text-xs sm:text-sm font-bold tracking-widest block mb-0.5">
                      ॥ ಶ್ರೀ ಗಣೇಶಾಯ ನಮಃ ॥
                    </span>
                    <p className="text-[10px] uppercase tracking-widest text-amber-300/70 font-sans">
                      Together With Their Families • ಆಹ್ವಾನ ಪತ್ರಿಕೆ
                    </p>
                    <p
                      className="text-xl sm:text-2xl mt-1 font-serif text-amber-100 tracking-wider font-semibold"
                      style={{ fontFamily }}
                    >
                      {groomName} & {brideName}
                    </p>
                    {groomKannada && brideKannada && (
                      <p className="text-xs sm:text-sm font-kannada text-amber-300/90 font-medium">
                        {groomKannada} ಮತ್ತು {brideKannada}
                      </p>
                    )}
                  </div>

                  {/* Wax Seal Centerpiece */}
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.96 }}
                    className="relative my-auto flex flex-col items-center"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-700 via-amber-500 to-yellow-300 p-1 shadow-[0_0_25px_rgba(212,175,55,0.4)] flex items-center justify-center">
                      <div className="w-full h-full rounded-full bg-[#3F0A11] border-2 border-amber-300/70 flex flex-col items-center justify-center text-amber-300 shadow-inner">
                        <span className="text-amber-300 text-xl font-kannada font-bold leading-none">ಶ್ರೀ</span>
                        <span className="text-[9px] tracking-wider uppercase font-serif mt-0.5 font-bold">
                          ತೆರೆಯಿರಿ
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-amber-200/80 tracking-widest mt-3 uppercase font-kannada group-hover:text-amber-300 transition-colors">
                      ಆಹ್ವಾನ ಪತ್ರಿಕೆ ತೆರೆಯಿರಿ • Tap To Open
                    </span>
                  </motion.div>

                  {/* Bottom tagline */}
                  <div className="text-center mb-2">
                    <p className="text-[11px] text-amber-200/60 tracking-wider font-kannada">
                      ॥ ಶುಭ ವಿವಾಹ ಮಹೋತ್ಸವ • Royal Celebration ॥
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              // Opened Invitation Card Sliding Out
              <motion.div
                key="envelope-opened"
                initial={{ y: 50, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative w-full rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] p-6 sm:p-8 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6ED] to-[#F5ECE0] text-gray-900 border-2 border-amber-400/80 text-center flex flex-col items-center"
              >
                {/* Gold filigree corners */}
                <div className="absolute top-3 left-3 w-10 h-10 border-t-2 border-l-2 border-amber-600/70" />
                <div className="absolute top-3 right-3 w-10 h-10 border-t-2 border-r-2 border-amber-600/70" />
                <div className="absolute bottom-3 left-3 w-10 h-10 border-b-2 border-l-2 border-amber-600/70" />
                <div className="absolute bottom-3 right-3 w-10 h-10 border-b-2 border-r-2 border-amber-600/70" />

                {/* Subtitle */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="space-y-1"
                >
                  <span className="text-xs sm:text-sm font-kannada font-bold text-amber-800 tracking-wider block">
                    ॥ ಶುಭ ವಿವಾಹ ಮಹೋತ್ಸವ ॥
                  </span>
                  <p className="text-xs tracking-[0.2em] text-amber-900/70 uppercase font-sans">
                    Together With Their Families
                  </p>
                </motion.div>

                {/* Couple Names Reveal */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.7 }}
                  className="my-4"
                >
                  <h2
                    className="text-2xl sm:text-3xl lg:text-4xl font-serif text-amber-950 font-bold tracking-tight"
                    style={{ fontFamily }}
                  >
                    {groomName} {groomKannada && <span className="font-kannada text-lg text-amber-800">({groomKannada})</span>}
                  </h2>
                  <div className="my-1.5 flex items-center justify-center gap-3">
                    <div className="h-[1px] w-12 bg-amber-600/40" />
                    <Heart className="w-4 h-4 fill-amber-600 text-amber-600" />
                    <div className="h-[1px] w-12 bg-amber-600/40" />
                  </div>
                  <h2
                    className="text-2xl sm:text-3xl lg:text-4xl font-serif text-amber-950 font-bold tracking-tight"
                    style={{ fontFamily }}
                  >
                    {brideName} {brideKannada && <span className="font-kannada text-lg text-amber-800">({brideKannada})</span>}
                  </h2>
                </motion.div>

                {/* Invite Text */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="text-xs tracking-wide text-amber-900/90 font-kannada mb-3"
                >
                  ನಮ್ಮ ವಿವಾಹ ಮಹೋತ್ಸವಕ್ಕೆ ತಮಗೆಲ್ಲರಿಗೂ ಪ್ರೀತಿಯ ಆದರದ ಸುಸ್ವಾಗತ
                </motion.p>

                {/* Save The Date Reveal Box */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.7 }}
                  className="w-full max-w-sm rounded-xl bg-amber-100/70 border border-amber-300/80 p-3 sm:p-4 my-2"
                >
                  <span className="text-[11px] font-bold tracking-[0.2em] text-amber-900 uppercase font-kannada">
                    ಶುಭ ದಿನಾಂಕ • SAVE THE DATE
                  </span>
                  <p
                    className="text-lg sm:text-xl font-serif text-amber-950 font-bold mt-1 tracking-wide"
                    style={{ fontFamily }}
                  >
                    {formattedDate}
                  </p>
                </motion.div>

                {/* Enter Website Button */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4, duration: 0.6 }}
                  onClick={handleEnterWebsite}
                  className="mt-5 px-8 py-3 rounded-full bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-amber-50 font-kannada text-sm font-semibold tracking-wide shadow-lg shadow-amber-900/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group cursor-pointer"
                >
                  <span>ಆಮಂತ್ರಣ ವೀಕ್ಷಿಸಿ • Explore Celebration</span>
                  <ChevronDown className="w-4 h-4 text-amber-200 group-hover:translate-y-0.5 transition-transform" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
