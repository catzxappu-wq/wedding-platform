"use client";

import React, { useState } from "react";
import { Image as ImageIcon, Upload, Copy, Check, Trash2, Plus, Sparkles, ExternalLink } from "lucide-react";

export default function AdminMediaPage() {
  const [photos, setPhotos] = useState([
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
  const [newUrl, setNewUrl] = useState("");
  const [newTitle, setNewTitle] = useState("");

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;

    const item = {
      id: String(Date.now()),
      url: newUrl,
      title: newTitle || "Uploaded Wedding Asset",
      category: "Custom",
      size: "Web CDN",
    };

    setPhotos([item, ...photos]);
    setNewUrl("");
    setNewTitle("");
  };

  const handleDelete = (id: string) => {
    setPhotos(photos.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
          <span>Cloud Media Vault</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif text-white font-bold">
          Wedding Media Assets
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Upload and manage photos, couple portraits, ceremony backdrops, and gallery assets.
        </p>
      </div>

      {/* Add Media Bar */}
      <form onSubmit={handleAddMedia} className="p-4 rounded-3xl bg-[#111726] border border-gray-800 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Paste Image URL (Unsplash, Cloudinary, AWS S3, etc.)..."
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          required
          className="flex-1 px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-xs outline-none focus:border-amber-400"
        />
        <input
          type="text"
          placeholder="Title / Description (optional)"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="w-full sm:w-60 px-4 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-white text-xs outline-none focus:border-amber-400"
        />
        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-amber-950 font-semibold text-xs flex items-center justify-center gap-2 transition-colors shrink-0 cursor-pointer shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Media</span>
        </button>
      </form>

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
                      <span>Copied URL</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                <a
                  href={photo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => handleDelete(photo.id)}
                  className="p-1.5 rounded-lg bg-gray-900 hover:bg-red-950 text-red-400 hover:text-red-300"
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
