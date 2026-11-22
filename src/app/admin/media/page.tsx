"use client";

import React, { useState, useRef } from "react";
import { Image as ImageIcon, Upload, Copy, Check, Trash2, Plus, Sparkles, ExternalLink, Loader2 } from "lucide-react";
import { compressImage } from "@/lib/imageCompression";

interface MediaItem {
  id: string;
  url: string;
  title: string;
  category: string;
  size: string;
}

export default function AdminMediaPage() {
  const [photos, setPhotos] = useState<MediaItem[]>([
    {
      id: "1",
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
      title: "Royal Mandap Ceremony",
      category: "Ceremony",
      size: "1.4 MB",
    },
    {
      id: "2",
      url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
      title: "Rahul & Priya Golden Hour",
      category: "Pre-wedding",
      size: "2.1 MB",
    },
    {
      id: "3",
      url: "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=800&q=80",
      title: "Floral Mehendi & Bangles",
      category: "Mehendi",
      size: "950 KB",
    },
    {
      id: "4",
      url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
      title: "South Indian Temple Ceremony",
      category: "Muhurtham",
      size: "1.8 MB",
    },
    {
      id: "5",
      url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
      title: "Black & Gold Evening Reception",
      category: "Reception",
      size: "1.6 MB",
    },
    {
      id: "6",
      url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80",
      title: "Arjun & Shreya Udupi Bells",
      category: "Traditional",
      size: "2.3 MB",
    },
  ]);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleProcessFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setLoading(true);

    try {
      const newItems: MediaItem[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith("image/")) {
          const optimizedUrl = await compressImage(file);
          const sizeKb = Math.round(file.size / 1024);
          const sizeStr = sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;

          newItems.push({
            id: String(Date.now() + i),
            url: optimizedUrl,
            title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
            category: "Uploaded",
            size: sizeStr,
          });
        }
      }

      setPhotos([...newItems, ...photos]);
    } catch (err: any) {
      alert("Error reading images from storage: " + err.message);
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = (id: string) => {
    setPhotos(photos.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
          <span>Device Storage Vault</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif text-white font-bold">
          Upload Photos From Storage
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Select or drag-and-drop pictures directly from your computer or phone storage.
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => e.target.files && handleProcessFiles(e.target.files)}
        className="hidden"
      />

      {/* Direct Storage Upload Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files) handleProcessFiles(e.dataTransfer.files);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        className={`rounded-3xl border-2 border-dashed p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
          isDragging
            ? "border-amber-400 bg-amber-500/15 scale-[1.01]"
            : "border-gray-700 bg-gray-900/60 hover:border-amber-500/50 hover:bg-gray-900"
        }`}
      >
        {loading ? (
          <div className="flex flex-col items-center gap-2 text-amber-400 py-3">
            <Loader2 className="w-9 h-9 animate-spin" />
            <span className="text-sm font-semibold">Reading and compressing images from storage...</span>
          </div>
        ) : (
          <>
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Upload className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                Click to choose photos from your device storage
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                or drag & drop files here directly from your folder
              </p>
            </div>
            <span className="text-[11px] text-gray-400 px-3 py-1 rounded-full bg-gray-800 border border-gray-700">
              Multiple files supported • Instant preview • Auto-compressed for web
            </span>
          </>
        )}
      </div>

      {/* Grid of Media */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="rounded-2xl bg-[#111726] border border-gray-800 overflow-hidden shadow-lg group hover:border-amber-500/50 transition-all flex flex-col justify-between"
          >
            <div className="aspect-[4/3] relative overflow-hidden bg-gray-900">
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] text-amber-300 font-semibold">
                {photo.category}
              </span>
            </div>

            <div className="p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-white truncate max-w-[150px]">
                  {photo.title}
                </h4>
                <span className="text-[10px] text-gray-500">{photo.size}</span>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => handleCopy(photo.id, photo.url)}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-300 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedId === photo.id ? (
                    <>
                      <Check className="w-3 h-3 text-green-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(photo.id)}
                  className="p-1.5 rounded-lg bg-gray-900 hover:bg-red-950 text-red-400 hover:text-red-300"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
