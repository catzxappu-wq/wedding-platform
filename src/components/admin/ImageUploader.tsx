"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Check, Loader2 } from "lucide-react";
import { compressImage } from "@/lib/imageCompression";

interface ImageUploaderProps {
  label: string;
  value?: string | null;
  onChange: (dataUrl: string) => void;
  aspectRatio?: "square" | "portrait" | "landscape" | "video";
  placeholderText?: string;
  helperText?: string;
}

export default function ImageUploader({
  label,
  value,
  onChange,
  aspectRatio = "square",
  placeholderText = "Click to upload from device storage",
  helperText = "PNG, JPG, WebP up to 10MB (auto-optimized)",
}: ImageUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = async (file: File) => {
    if (!file) return;
    setLoading(true);
    try {
      const optimizedUrl = await compressImage(file);
      onChange(optimizedUrl);
    } catch (err: any) {
      alert("Failed to process image: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case "portrait":
        return "aspect-[3/4]";
      case "landscape":
        return "aspect-[16/10]";
      case "video":
        return "aspect-[16/9]";
      case "square":
      default:
        return "aspect-square";
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
          <span>{label}</span>
        </label>
        {value && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>Remove</span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFileInputChange}
        className="hidden"
      />

      {value ? (
        // Preview Box with Change Action
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`relative rounded-2xl overflow-hidden border-2 border-amber-500/40 bg-gray-900 group cursor-pointer shadow-md ${getAspectClass()}`}
        >
          <img
            src={value}
            alt={label}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-white text-center">
            <Upload className="w-6 h-6 text-amber-400 mb-1" />
            <span className="text-xs font-semibold">Change Image</span>
            <span className="text-[10px] text-gray-300">Click to browse storage</span>
          </div>
          <div className="absolute top-2 right-2 p-1.5 rounded-full bg-amber-500 text-amber-950 font-bold text-[10px] shadow">
            <Check className="w-3.5 h-3.5" />
          </div>
        </div>
      ) : (
        // Dropzone upload box
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={`rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2.5 ${
            isDragging
              ? "border-amber-400 bg-amber-500/10 scale-[1.01]"
              : "border-gray-700 bg-gray-900/60 hover:border-amber-500/50 hover:bg-gray-900"
          } ${getAspectClass()}`}
        >
          {loading ? (
            <div className="flex flex-col items-center gap-2 text-amber-400">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-xs font-medium">Compressing & loading...</span>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">
                  {placeholderText}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  or drag & drop file from local storage
                </p>
              </div>
              <span className="text-[10px] text-gray-500 font-mono px-2 py-0.5 rounded bg-gray-800">
                {helperText}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
