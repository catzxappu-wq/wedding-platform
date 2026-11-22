"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Star, Loader2, Plus, Image as ImageIcon } from "lucide-react";
import { compressImage } from "@/lib/imageCompression";

interface GalleryPhotoItem {
  imageUrl: string;
  caption?: string | null;
  isCover?: boolean;
  sortOrder?: number;
}

interface MultiImageUploaderProps {
  photos: GalleryPhotoItem[];
  onChange: (photos: GalleryPhotoItem[]) => void;
}

export default function MultiImageUploader({ photos, onChange }: MultiImageUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const processFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setLoading(true);

    try {
      const newItems: GalleryPhotoItem[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith("image/")) {
          const optimizedUrl = await compressImage(file);
          newItems.push({
            imageUrl: optimizedUrl,
            caption: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
            isCover: photos.length === 0 && newItems.length === 0,
            sortOrder: photos.length + newItems.length + 1,
          });
        }
      }

      onChange([...photos, ...newItems]);
    } catch (err: any) {
      alert("Error uploading images from storage: " + err.message);
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleSetCover = (index: number) => {
    const updated = photos.map((p, idx) => ({
      ...p,
      isCover: idx === index,
    }));
    onChange(updated);
  };

  const handleUpdateCaption = (index: number, caption: string) => {
    const updated = [...photos];
    updated[index].caption = caption;
    onChange(updated);
  };

  const handleDelete = (index: number) => {
    const updated = photos.filter((_, idx) => idx !== index);
    // If deleted photo was cover, make first remaining photo cover
    if (updated.length > 0 && !updated.some((p) => p.isCover)) {
      updated[0].isCover = true;
    }
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={onFileInputChange}
        className="hidden"
      />

      {/* Main Multi-Upload Dropzone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={onDrop}
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
          <div className="flex flex-col items-center gap-2 text-amber-400 py-4">
            <Loader2 className="w-10 h-10 animate-spin" />
            <span className="text-sm font-semibold">
              Reading & optimizing images from your storage...
            </span>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                Click to browse images from your computer / phone storage
              </p>
              <p className="text-xs text-gray-400 mt-1">
                or drag and drop multiple wedding photos here
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-400 bg-gray-800/80 px-3 py-1 rounded-full border border-gray-700">
              <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>Multi-select supported • Auto-compressed • Ready for mobile & web</span>
            </div>
          </>
        )}
      </div>

      {/* Uploaded Gallery Grid */}
      {photos.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>
              {photos.length} {photos.length === 1 ? "photo" : "photos"} in gallery
            </span>
            <span>Click star to set Cover Image</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-gray-900 border border-gray-800 overflow-hidden flex flex-col justify-between group shadow-lg hover:border-amber-500/40 transition-all"
              >
                <div className="aspect-[4/3] relative overflow-hidden bg-black/40">
                  <img
                    src={photo.imageUrl}
                    alt={photo.caption || "Gallery"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Badges & Actions overlay */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleSetCover(idx)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 backdrop-blur-md transition-colors ${
                        photo.isCover
                          ? "bg-amber-500 text-amber-950 shadow"
                          : "bg-black/60 text-gray-300 hover:text-amber-300"
                      }`}
                    >
                      <Star className={`w-3 h-3 ${photo.isCover ? "fill-current" : ""}`} />
                      <span>{photo.isCover ? "Cover Photo" : "Set Cover"}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(idx)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-red-600 text-white transition-colors"
                    title="Delete photo"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Caption input */}
                <div className="p-3">
                  <input
                    type="text"
                    placeholder="Add caption (e.g. Sangeet dance)"
                    value={photo.caption || ""}
                    onChange={(e) => handleUpdateCaption(idx, e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-xs outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
