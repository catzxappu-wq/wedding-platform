"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Heart,
  Sun,
  Music,
  Smile,
  ChevronRight,
  Download,
  ExternalLink,
} from "lucide-react";
import { generateGoogleCalendarUrl } from "@/lib/ics";

interface EventItem {
  id: string;
  name: string;
  date: Date | string;
  startTime: string;
  endTime?: string | null;
  venueName: string;
  address: string;
  description?: string | null;
  icon?: string | null;
  imageUrl?: string | null;
  sortOrder: number;
}

interface EventsScheduleProps {
  events: EventItem[];
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
  coupleTitle?: string;
}

const iconMap: Record<string, any> = {
  Sparkles,
  Heart,
  Sun,
  Music,
  Calendar,
  Smile,
};

export default function EventsSchedule({
  events,
  primaryColor = "#B8972E",
  secondaryColor = "#58111A",
  fontFamily = "Cinzel",
  coupleTitle = "The Wedding",
}: EventsScheduleProps) {
  const [activeCalendarModal, setActiveCalendarModal] = useState<EventItem | null>(null);

  if (!events || events.length === 0) {
    return null;
  }

  const sortedEvents = [...events].sort((a, b) => a.sortOrder - b.sortOrder);

  const handleDownloadICS = (ev: EventItem) => {
    window.open(`/api/calendar?eventId=${ev.id}`, "_blank");
  };

  const handleGoogleCalendar = (ev: EventItem) => {
    const url = generateGoogleCalendarUrl({
      title: `${ev.name} | ${coupleTitle}`,
      description: `${ev.description || ""}\nVenue: ${ev.venueName}, ${ev.address}`,
      location: `${ev.venueName}, ${ev.address}`,
      startDate: new Date(ev.date),
    });
    window.open(url, "_blank");
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/70 border border-amber-300/60 text-amber-900 text-xs tracking-widest uppercase mb-3 font-sans">
          <Calendar className="w-3.5 h-3.5 text-amber-700" />
          <span>Wedding Festivities</span>
        </div>
        <h2
          className="text-3xl sm:text-4xl lg:text-5xl font-serif text-gray-900 font-bold tracking-tight"
          style={{ fontFamily }}
        >
          Events & Celebrations
        </h2>
        <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto mt-2">
          Every moment is crafted with love. Please join us in celebrating each special occasion.
        </p>
      </div>

      {/* Events Timeline / Cards */}
      <div className="space-y-6">
        {sortedEvents.map((ev, index) => {
          const IconComponent = (ev.icon && iconMap[ev.icon]) || Sparkles;
          const eventDateObj = new Date(ev.date);
          const formattedDate = !isNaN(eventDateObj.getTime())
            ? eventDateObj.toLocaleDateString("en-US", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "Date to be announced";

          return (
            <div
              key={ev.id || index}
              className="group relative rounded-2xl bg-white/90 backdrop-blur-md border border-amber-400/30 p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-amber-400/70 flex flex-col md:flex-row gap-6 items-start"
            >
              {/* Event Image if available, else decorative icon badge */}
              {ev.imageUrl ? (
                <div className="w-full md:w-48 h-40 rounded-xl overflow-hidden relative shrink-0 shadow-inner bg-amber-50">
                  <img
                    src={ev.imageUrl}
                    alt={ev.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 p-1.5 rounded-lg bg-black/60 backdrop-blur-md text-amber-300">
                    <IconComponent className="w-4 h-4" />
                  </div>
                </div>
              ) : (
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-amber-200/40 border border-amber-400/40 flex items-center justify-center shrink-0 text-amber-700 shadow-sm group-hover:scale-105 transition-transform">
                  <IconComponent className="w-7 h-7" />
                </div>
              )}

              {/* Event Content */}
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs uppercase tracking-widest font-semibold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    Event 0{index + 1}
                  </span>
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-amber-900/80">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    <span>{formattedDate}</span>
                  </div>
                </div>

                <h3
                  className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 group-hover:text-amber-700 transition-colors"
                  style={{ fontFamily }}
                >
                  {ev.name}
                </h3>

                {ev.description && (
                  <p className="text-sm text-gray-600 leading-relaxed">{ev.description}</p>
                )}

                {/* Timing & Venue badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs sm:text-sm text-gray-700 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="font-medium">
                      {ev.startTime}
                      {ev.endTime ? ` - ${ev.endTime}` : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="truncate" title={`${ev.venueName}, ${ev.address}`}>
                      {ev.venueName}
                    </span>
                  </div>
                </div>

                {/* Add to Calendar button for this specific event */}
                <div className="pt-2 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleDownloadICS(ev)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 transition-all cursor-pointer"
                  >
                    <Download className="w-3 h-3 text-amber-700" />
                    <span>Add to Apple / Outlook (.ics)</span>
                  </button>
                  <button
                    onClick={() => handleGoogleCalendar(ev)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 transition-all cursor-pointer"
                  >
                    <ExternalLink className="w-3 h-3 text-blue-600" />
                    <span>Google Calendar</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
