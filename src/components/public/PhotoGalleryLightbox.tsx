"use client";

import React, { useState, useEffect } from "react";
import { Camera, X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface GalleryPhoto {
  id: string;
  imageUrl: string;
  caption?: string | null;
  sortOrder: number;
  isCover?: boolean;
}

interface PhotoGalleryLightboxProps {
  photos: GalleryPhoto[];
  primaryColor?: string;
  fontFamily?: string;
}

export default function PhotoGalleryLightbox({
  photos,
  primaryColor = "#B8972E",
  fontFamily = "Cinzel",
}: PhotoGalleryLightboxProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  if (!photos || photos.length === 0) return null;

  const sortedPhotos = [...photos].sort((a, b) => a.sortOrder - b.sortOrder);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return;
      if (e.key === "Escape") setSelectedPhotoIndex(null);
      if (e.key === "ArrowRight") {
        setSelectedPhotoIndex((prev) =>
          prev !== null ? (prev + 1) % sortedPhotos.length : 0
        );
      }
      if (e.key === "ArrowLeft") {
        setSelectedPhotoIndex((prev) =>
          prev !== null ? (prev - 1 + sortedPhotos.length) % sortedPhotos.length : 0
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhotoIndex, sortedPhotos.length]);

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/70 border border-amber-300/60 text-amber-900 text-xs tracking-widest uppercase mb-3 font-sans">
          <Camera className="w-3.5 h-3.5 text-amber-700" />
          <span>Moments Of Joy</span>
        </div>
        <h2
          className="text-3xl sm:text-4xl lg:text-5xl font-serif text-gray-900 font-bold tracking-tight"
          style={{ fontFamily }}
        >
          Our Memories
        </h2>
        <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto mt-2">
          Capturing chapters from our journey of togetherness and love.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {sortedPhotos.map((photo, index) => (
          <div
            key={photo.id || index}
            onClick={() => setSelectedPhotoIndex(index)}
            className={`group relative rounded-2xl overflow-hidden shadow-md cursor-pointer border border-amber-400/20 bg-amber-50 ${
              index === 0 ? "sm:col-span-2 sm:row-span-2 aspect-[4/3] sm:aspect-auto sm:h-full" : "aspect-square"
            }`}
          >
            <img
              src={photo.imageUrl}
              alt={photo.caption || `Wedding memory ${index + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium drop-shadow-md">
                  {photo.caption || "View Photo"}
                </span>
                <div className="p-2 rounded-full bg-white/20 backdrop-blur-md">
                  <Maximize2 className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {selectedPhotoIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4">
          <button
            onClick={() => setSelectedPhotoIndex(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-50"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={() =>
              setSelectedPhotoIndex(
                (selectedPhotoIndex - 1 + sortedPhotos.length) % sortedPhotos.length
              )
            }
            className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-50"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() =>
              setSelectedPhotoIndex((selectedPhotoIndex + 1) % sortedPhotos.length)
            }
            className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer z-50"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center">
            <img
              src={sortedPhotos[selectedPhotoIndex].imageUrl}
              alt={sortedPhotos[selectedPhotoIndex].caption || "Wedding photo"}
              className="max-h-[75vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
            />
            {sortedPhotos[selectedPhotoIndex].caption && (
              <p className="text-white/90 text-sm sm:text-base font-serif mt-4 text-center">
                {sortedPhotos[selectedPhotoIndex].caption}
              </p>
            )}
            <span className="text-xs text-white/50 mt-1">
              {selectedPhotoIndex + 1} of {sortedPhotos.length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
