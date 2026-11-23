"use client";

import React from "react";
import { MapPin, Navigation, Compass, ExternalLink } from "lucide-react";

interface VenueMapSectionProps {
  venue?: {
    venueName: string;
    fullAddress: string;
    city: string;
    state: string;
    country: string;
    latitude?: number | null;
    longitude?: number | null;
    googleMapsUrl: string;
  } | null;
  primaryColor?: string;
  fontFamily?: string;
}

export default function VenueMapSection({
  venue,
  primaryColor = "#B8972E",
  fontFamily = "Cinzel",
}: VenueMapSectionProps) {
  if (!venue) return null;

  const mapsUrl =
    venue.googleMapsUrl ||
    `https://maps.google.com/?q=${encodeURIComponent(`${venue.venueName}, ${venue.fullAddress}`)}`;

  // Construct Google Maps embed URL using the address or coords
  const embedQuery = encodeURIComponent(
    venue.latitude && venue.longitude
      ? `${venue.latitude},${venue.longitude}`
      : `${venue.venueName}, ${venue.fullAddress}`
  );

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4">
      <div className="rounded-3xl bg-white/95 backdrop-blur-md border border-amber-400/40 p-6 sm:p-10 shadow-xl overflow-hidden relative">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Left Details */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs tracking-widest uppercase font-semibold font-kannada">
              <MapPin className="w-3.5 h-3.5 text-amber-700" />
              <span>ಕಲ್ಯಾಣ ಮಂಟಪದ ವಿಳಾಸ • WEDDING VENUE</span>
            </div>

            <h3
              className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-gray-900 leading-tight"
              style={{ fontFamily }}
            >
              {venue.venueName}
            </h3>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-md">
              {venue.fullAddress}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-600" />
                {venue.city}, {venue.state}
              </span>
              <span>•</span>
              <span>{venue.country}</span>
            </div>

            <div className="pt-4 flex flex-wrap justify-center md:justify-start gap-3">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-kannada font-semibold text-white shadow-lg shadow-amber-800/20 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                style={{ backgroundColor: primaryColor }}
              >
                <Navigation className="w-4 h-4" />
                <span>ಮಾರ್ಗಸೂಚಿ ಪಡೆಯಿರಿ • Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            </div>
          </div>

          {/* Right Embed / Visual Map Card */}
          <div className="w-full md:w-1/2 h-64 sm:h-72 rounded-2xl overflow-hidden shadow-inner border border-amber-300/60 relative bg-amber-50">
            <iframe
              title="Wedding Venue Location Map"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${embedQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
