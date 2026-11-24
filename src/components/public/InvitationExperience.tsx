"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Heart,
  Calendar,
  Share2,
  ChevronDown,
  Sparkles,
  ArrowUp,
  Download,
  ExternalLink,
} from "lucide-react";
import { InvitationWithRelations } from "@/types";
import { getTemplateById } from "@/data/templates";
import { generateGoogleCalendarUrl } from "@/lib/ics";
import DateRevealOpening from "./DateRevealOpening";
import MusicPlayer from "./MusicPlayer";
import CountdownTimer from "./CountdownTimer";
import EventsSchedule from "./EventsSchedule";
import VenueMapSection from "./VenueMapSection";
import PhotoGalleryLightbox from "./PhotoGalleryLightbox";
import RsvpSection from "./RsvpSection";
import ShareModal from "./ShareModal";
import {
  ToranBorder,
  GaneshaInvocationBanner,
  SaatPhereSection,
  FamilyBlessingsBanner,
} from "./cultural/IndianCulturalElements";
import LanguageSwitcher from "./LanguageSwitcher";
import {
  LanguageMode,
  getKannadaName,
  KANNADA_CULTURAL_TEXTS,
} from "@/lib/kannadaDictionary";

interface InvitationExperienceProps {
  invitation: InvitationWithRelations;
}

export default function InvitationExperience({ invitation }: InvitationExperienceProps) {
  const [hasOpenedEnvelope, setHasOpenedEnvelope] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const template = getTemplateById(invitation.templateId);

  // Styling attributes derived from DB / template
  const primaryColor = invitation.primaryColor || template.theme.primaryColor;
  const secondaryColor = invitation.secondaryColor || template.theme.secondaryColor;
  const accentColor = invitation.accentColor || template.theme.accentColor;
  const backgroundColor = invitation.backgroundColor || template.theme.backgroundColor;
  const textColor = invitation.textColor || template.theme.textColor;
  const fontFamily = invitation.fontFamily || template.theme.fontFamily;
  const headingFont = invitation.headingFont || template.theme.headingFont;

  const groomName = invitation.couple?.groomName || "Groom";
  const brideName = invitation.couple?.brideName || "Bride";
  const coupleTitle = `${groomName} & ${brideName}`;

  const [languageMode, setLanguageMode] = useState<LanguageMode>("bilingual");
  const groomKannada = getKannadaName(groomName);
  const brideKannada = getKannadaName(brideName);
  const isKannada = languageMode === "kannada";
  const isBilingual = languageMode === "bilingual";

  const formattedWeddingDate = invitation.weddingDate
    ? new Date(invitation.weddingDate).toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const handleDownloadMasterICS = () => {
    window.open(`/api/calendar?invitationId=${invitation.id}`, "_blank");
  };

  const handleGoogleCalendarMaster = () => {
    if (!invitation.weddingDate) return;
    const url = generateGoogleCalendarUrl({
      title: `${coupleTitle}'s Wedding`,
      description: `Wedding celebration of ${coupleTitle}\nVenue: ${invitation.venue?.venueName || ""}`,
      location: `${invitation.venue?.venueName || ""}, ${invitation.venue?.fullAddress || ""}`,
      startDate: new Date(invitation.weddingDate),
    });
    window.open(url, "_blank");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isTraditionalIndian =
    invitation.templateId === "traditional-indian" ||
    invitation.templateId === "royal-gold" ||
    invitation.templateId === "south-indian" ||
    invitation.templateId === "kannada-wedding" ||
    template.category === "traditional" ||
    template.category === "regional" ||
    template.category === "luxury";

  return (
    <div
      className="min-h-screen text-gray-900 transition-colors duration-500 overflow-x-hidden selection:bg-amber-200"
      style={{
        backgroundColor,
        color: textColor,
        fontFamily: fontFamily === "Cinzel" ? "var(--font-cinzel), serif" : "var(--font-sans), sans-serif",
      }}
    >
      {/* Traditional Marigold & Mango Leaves Toran */}
      {isTraditionalIndian && <ToranBorder />}
      {/* 1. Date Reveal Envelope Opening Experience */}
      <AnimatePresence>
        {!hasOpenedEnvelope && (
          <DateRevealOpening
            groomName={groomName}
            brideName={brideName}
            weddingDate={invitation.weddingDate}
            weddingTitle={invitation.title}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            accentColor={accentColor}
            fontFamily={headingFont}
            onOpenComplete={() => setHasOpenedEnvelope(true)}
          />
        )}
      </AnimatePresence>

      {/* Floating Language Switcher (Kannada / English / Bilingual) */}
      <div className="fixed top-4 right-4 z-40">
        <LanguageSwitcher
          currentLanguage={languageMode}
          onLanguageChange={setLanguageMode}
          primaryColor={primaryColor}
        />
      </div>

      {/* Floating Music Player */}
      {invitation.musicEnabled && (
        <MusicPlayer
          musicUrl={invitation.musicUrl}
          musicTitle={invitation.musicTitle}
          primaryColor={primaryColor}
        />
      )}

      {/* Floating Share Button */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => setIsShareModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full shadow-2xl backdrop-blur-md bg-white/90 text-gray-800 border border-gray-200/80 hover:scale-105 active:scale-95 transition-all text-xs font-semibold cursor-pointer"
        >
          <Share2 className="w-4 h-4 text-amber-600" />
          <span className="hidden sm:inline">Share Invitation</span>
        </button>
      </div>

      {/* Share Modal Dialog */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        slug={invitation.slug}
        coupleTitle={coupleTitle}
        weddingDate={invitation.weddingDate}
      />

      {/* ======================================================== */}
      {/* MAIN PUBLIC INVITATION SECTIONS */}
      {/* ======================================================== */}

      {/* 1. HERO SECTION */}
      <header className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4 py-16 overflow-hidden">
        {/* Subtle Decorative Background Mandala / Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-10 flex items-center justify-center">
          <div className="w-[800px] h-[800px] rounded-full border-[40px] border-amber-600/20 animate-spin-slow" />
        </div>

        {/* Vedic Ganesha Invocation & Shloka Banner */}
        {isTraditionalIndian && (
          <GaneshaInvocationBanner
            primaryColor={primaryColor}
            languageMode={languageMode}
          />
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="relative max-w-3xl mx-auto space-y-6 z-10"
        >
          {/* Top Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/80 backdrop-blur-md border border-amber-400/40 shadow-sm text-xs uppercase tracking-[0.2em] font-semibold text-amber-900">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span className={isKannada || isBilingual ? "font-kannada" : ""}>
              {isKannada
                ? KANNADA_CULTURAL_TEXTS.ui.celebrationOf.kannada
                : isBilingual
                ? `${KANNADA_CULTURAL_TEXTS.ui.celebrationOf.kannada} • The Wedding Celebration Of`
                : KANNADA_CULTURAL_TEXTS.ui.celebrationOf.english}
            </span>
          </div>

          {/* Couple Names Headline */}
          <div className="space-y-4 my-4">
            <div className="space-y-1">
              <h1
                className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight text-gray-900"
                style={{ fontFamily: headingFont }}
              >
                {groomName}
              </h1>
              {(isKannada || isBilingual) && groomKannada && (
                <p className="text-2xl sm:text-4xl font-kannada font-bold text-amber-800 tracking-wide">
                  ಶ್ರೀ {groomKannada}
                </p>
              )}
            </div>

            <div className="flex items-center justify-center gap-4 text-amber-600">
              <div className="h-[1px] w-16 bg-current opacity-40" />
              <Heart className="w-6 h-6 fill-current animate-pulse" />
              <div className="h-[1px] w-16 bg-current opacity-40" />
            </div>

            <div className="space-y-1">
              <h1
                className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight text-gray-900"
                style={{ fontFamily: headingFont }}
              >
                {brideName}
              </h1>
              {(isKannada || isBilingual) && brideKannada && (
                <p className="text-2xl sm:text-4xl font-kannada font-bold text-amber-800 tracking-wide">
                  ಕುಮಾರಿ {brideKannada}
                </p>
              )}
            </div>
          </div>

          {/* Quote / Introduction */}
          <p className="text-base sm:text-lg text-gray-700 italic max-w-xl mx-auto font-serif">
            "{invitation.couple?.introduction || "Two hearts, one beautiful journey."}"
          </p>

          {/* Wedding Date & City Banner */}
          {formattedWeddingDate && (
            <div className="pt-4 flex flex-col items-center">
              <div className="px-6 py-3 rounded-2xl bg-white/90 backdrop-blur-md border border-amber-400/50 shadow-md">
                <p className="text-xs uppercase tracking-[0.2em] text-amber-800 font-semibold font-kannada">
                  {isKannada
                    ? KANNADA_CULTURAL_TEXTS.ui.saveTheDate.kannada
                    : isBilingual
                    ? `${KANNADA_CULTURAL_TEXTS.ui.saveTheDate.kannada} • SAVE THE DATE`
                    : KANNADA_CULTURAL_TEXTS.ui.saveTheDate.english}
                </p>
                <p
                  className="text-lg sm:text-xl font-serif font-bold text-gray-900 mt-0.5"
                  style={{ fontFamily: headingFont }}
                >
                  {formattedWeddingDate}
                </p>
                {invitation.venue?.city && (
                  <p className="text-xs text-gray-500 mt-1">
                    {invitation.venue.city}, {invitation.venue.state || invitation.venue.country}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Action CTAs: Add to Calendar & RSVP */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#rsvp"
              className="px-8 py-3.5 rounded-full text-white font-serif tracking-widest text-xs uppercase font-semibold shadow-lg shadow-amber-800/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              style={{ backgroundColor: primaryColor }}
            >
              <span className={isKannada || isBilingual ? "font-kannada text-xs" : ""}>
                {isKannada
                  ? KANNADA_CULTURAL_TEXTS.ui.rsvpButton.kannada
                  : isBilingual
                  ? `${KANNADA_CULTURAL_TEXTS.ui.rsvpButton.kannada} • RSVP Now`
                  : KANNADA_CULTURAL_TEXTS.ui.rsvpButton.english}
              </span>
            </a>

            {invitation.weddingDate && (
              <button
                onClick={handleDownloadMasterICS}
                className="px-6 py-3.5 rounded-full bg-white/90 hover:bg-white text-gray-800 font-serif tracking-wider text-xs uppercase font-semibold border border-amber-400/40 shadow-sm hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-amber-600" />
                <span className={isKannada ? "font-kannada" : ""}>
                  {isKannada ? KANNADA_CULTURAL_TEXTS.ui.addToCalendar.kannada : "Add to Calendar"}
                </span>
              </button>
            )}
          </div>
        </motion.div>

        {/* Scroll down prompt */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
          <span className="text-[10px] tracking-widest uppercase font-sans">Scroll To Explore</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </header>

      {/* 2. COUNTDOWN TIMER */}
      {invitation.weddingDate && (
        <section className="px-4">
          <CountdownTimer
            weddingDate={invitation.weddingDate}
            primaryColor={primaryColor}
            fontFamily={headingFont}
          />
        </section>
      )}

      {/* 3. COUPLE PROFILES & STORY */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/70 border border-amber-300/60 text-amber-900 text-xs tracking-widest uppercase mb-3 font-sans">
            <Heart className="w-3.5 h-3.5 text-amber-600 fill-current" />
            <span className={isKannada || isBilingual ? "font-kannada" : ""}>
              {isKannada ? "ನವದಂಪತಿಗಳು" : isBilingual ? "ನವದಂಪತಿಗಳು • The Happy Couple" : "The Happy Couple"}
            </span>
          </div>
          <h2
            className={`text-3xl sm:text-4xl font-bold text-gray-900 ${
              isKannada || isBilingual ? "font-kannada" : "font-serif"
            }`}
            style={{ fontFamily: isKannada ? undefined : headingFont }}
          >
            {isKannada
              ? KANNADA_CULTURAL_TEXTS.ui.meetCouple.kannada
              : isBilingual
              ? `${KANNADA_CULTURAL_TEXTS.ui.meetCouple.kannada} • Meet The Couple`
              : KANNADA_CULTURAL_TEXTS.ui.meetCouple.english}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Groom Card */}
          <div className="rounded-3xl bg-white/90 backdrop-blur-md border border-amber-400/30 p-6 sm:p-8 shadow-md text-center flex flex-col items-center">
            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-amber-400/50 shadow-xl mb-5 bg-amber-50">
              <img
                src={
                  invitation.couple?.groomPhoto ||
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
                }
                alt={groomName}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <span className="text-xs uppercase tracking-widest font-semibold text-amber-800 font-kannada">
              {isKannada ? "ವರ" : isBilingual ? "ವರ • The Groom" : "The Groom"}
            </span>
            <h3
              className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mt-1"
              style={{ fontFamily: headingFont }}
            >
              {groomName} {groomKannada && <span className="font-kannada text-xl text-amber-800">({groomKannada})</span>}
            </h3>
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">
              {isKannada
                ? "ಜೀವನದ ಪ್ರತಿ ಹೆಜ್ಜೆಯಲ್ಲೂ ಸಾಥ್ ನೀಡುವ ತನ್ನ ಪ್ರೀತಿಯ ಮಡದಿಯೊಂದಿಗೆ ನವಜೀವನವನ್ನು ಆರಂಭಿಸಲು ಸಜ್ಜಾಗಿರುವ ವರ."
                : "Ready to embark on life's grandest journey with the one who makes every day brighter."}
            </p>
          </div>

          {/* Bride Card */}
          <div className="rounded-3xl bg-white/90 backdrop-blur-md border border-amber-400/30 p-6 sm:p-8 shadow-md text-center flex flex-col items-center">
            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-amber-400/50 shadow-xl mb-5 bg-amber-50">
              <img
                src={
                  invitation.couple?.bridePhoto ||
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"
                }
                alt={brideName}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <span className="text-xs uppercase tracking-widest font-semibold text-amber-800 font-kannada">
              {isKannada ? "ವಧು" : isBilingual ? "ವಧು • The Bride" : "The Bride"}
            </span>
            <h3
              className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 mt-1"
              style={{ fontFamily: headingFont }}
            >
              {brideName} {brideKannada && <span className="font-kannada text-xl text-amber-800">({brideKannada})</span>}
            </h3>
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">
              {isKannada
                ? "ಕುಟುಂಬದ ಪ್ರೀತಿ, ಆಶೀರ್ವಾದಗಳೊಂದಿಗೆ ತನ್ನ ಬಾಳ ಸಂಗಾತಿಯ ಜೊತೆಗೂಡಿ ಹೊಸ ಬಾಳಿಗೆ ಹೆಜ್ಜೆಯಿಡುತ್ತಿರುವ ವಧು."
                : "Stepping into eternity with her soulmate, surrounded by the warmth of family and laughter."}
            </p>
          </div>
        </div>

        {/* Our Story & Family Message */}
        {(invitation.couple?.story || invitation.couple?.familyMessage) && (
          <div className="mt-12 rounded-3xl bg-white/95 backdrop-blur-md border border-amber-400/30 p-8 sm:p-12 shadow-xl text-center space-y-6">
            {invitation.couple?.story && (
              <div className="space-y-3">
                <h4
                  className={`text-2xl font-bold text-gray-900 ${isKannada || isBilingual ? "font-kannada" : "font-serif"}`}
                  style={{ fontFamily: isKannada ? undefined : headingFont }}
                >
                  {isKannada ? "ನಮ್ಮ ಪ್ರೇಮ ಕಥೆ" : isBilingual ? "Our Love Story • ಪ್ರೇಮ ಕಥೆ" : "Our Love Story"}
                </h4>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed max-w-2xl mx-auto">
                  {invitation.couple.story}
                </p>
              </div>
            )}

            {invitation.couple?.familyMessage && (
              <div className="pt-6 border-t border-amber-200/60 space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] font-semibold text-amber-800 font-kannada">
                  {isKannada ? "ಕುಟುಂಬದ ಹಾರೈಕೆಗಳು" : isBilingual ? "Family Blessings • ಕುಟುಂಬದ ಹಾರೈಕೆ" : "Family Blessings"}
                </p>
                <p className="text-sm text-gray-600 italic max-w-xl mx-auto">
                  "{invitation.couple.familyMessage}"
                </p>
                {invitation.couple.familyNames && (
                  <p className="text-xs font-semibold text-gray-800 mt-2 font-kannada">
                    — {invitation.couple.familyNames}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* SACRED VEDIC SAAT PHERE (SEVEN VOWS) */}
      {isTraditionalIndian && (
        <SaatPhereSection
          primaryColor={primaryColor}
          fontFamily={headingFont}
          languageMode={languageMode}
        />
      )}

      {/* 4. EVENTS & TIMELINE */}
      <EventsSchedule
        events={invitation.events}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        fontFamily={headingFont}
        coupleTitle={coupleTitle}
        languageMode={languageMode}
      />

      {/* 5. ADD TO CALENDAR MASTER BAR */}
      {invitation.weddingDate && (
        <section className="max-w-4xl mx-auto px-4 py-6">
          <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 border border-amber-400/40 p-6 text-center flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h4 className="font-serif font-bold text-lg text-gray-900" style={{ fontFamily: headingFont }}>
                Don't Miss A Moment
              </h4>
              <p className="text-xs text-gray-600">
                Add the wedding celebration to your digital calendar.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={handleDownloadMasterICS}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white transition-all shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .ICS</span>
              </button>
              <button
                onClick={handleGoogleCalendarMaster}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 transition-all shadow-sm"
              >
                <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                <span>Google Calendar</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 6. VENUE & GOOGLE MAPS */}
      <VenueMapSection
        venue={invitation.venue}
        primaryColor={primaryColor}
        fontFamily={headingFont}
      />

      {/* 7. GALLERY & LIGHTBOX */}
      <PhotoGalleryLightbox
        photos={invitation.gallery}
        primaryColor={primaryColor}
        fontFamily={headingFont}
      />

      {/* VEDIC FAMILY BLESSINGS & MANGALYA DHARANAM */}
      {isTraditionalIndian && (
        <FamilyBlessingsBanner
          familyMessage={invitation.couple?.familyMessage}
          familyNames={invitation.couple?.familyNames}
          primaryColor={primaryColor}
          fontFamily={headingFont}
          languageMode={languageMode}
        />
      )}

      {/* 8. RSVP SECTION */}
      <RsvpSection
        invitationId={invitation.id}
        primaryColor={primaryColor}
        fontFamily={headingFont}
      />

      {/* 9. FOOTER */}
      <footer className="py-16 text-center text-xs text-gray-500 border-t border-amber-200/50 space-y-4 px-4 bg-white/50">
        <div className="flex items-center justify-center gap-2 text-amber-700">
          <Heart className="w-4 h-4 fill-current" />
          <span className="font-serif text-sm font-semibold text-gray-800" style={{ fontFamily: headingFont }}>
            {coupleTitle}
          </span>
          <Heart className="w-4 h-4 fill-current" />
        </div>
        <p className="max-w-md mx-auto text-gray-600">
          With love, gratitude, and warm blessings. Thank you for being a cherished part of our journey.
        </p>

        <button
          onClick={scrollToTop}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-amber-800 hover:text-amber-950 font-medium hover:bg-amber-100/60 transition-colors"
        >
          <ArrowUp className="w-3.5 h-3.5" />
          <span>Back to Top</span>
        </button>

        <p className="text-[11px] text-gray-400">
          Powered by CATZX DIGITAL INVITATION
        </p>
      </footer>
    </div>
  );
}
