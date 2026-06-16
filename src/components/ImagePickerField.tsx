"use client";

import React, { useRef, useState } from "react";
import { CloudUpload, Sparkles, Trash2 } from "lucide-react";

interface ImagePickerFieldProps {
  /** Field label shown above the widget */
  label?: string;
  /** Sub-label shown inside the filled-state card (e.g. "Parallax Background Layer") */
  sublabel?: string;
  /** Current value — either an already-uploaded URL string or a File object */
  value: File | string | null;
  /** Called whenever the user picks a new file or clears the selection */
  onChange: (value: File | string | null) => void;
  /** Extra class names for the outer container */
  containerClassName?: string;
  /** Accepted MIME types (default: image/*) */
  accept?: string;
}

/**
 * A polished image-picker field used across the CMS.
 *
 * – Empty state: dashed drag-and-drop zone with a cloud icon.
 * – Filled state: compact card showing a thumbnail, file/URL name,
 *   a "Change" button and a red delete icon — matching the design
 *   in the reference screenshot.
 */
export function ImagePickerField({
  label,
  sublabel = "Selected Image Asset",
  value,
  onChange,
  containerClassName = "",
  accept = "image/*",
}: ImagePickerFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  /* ---------- derived values ---------- */
  const preview =
    value instanceof File ? URL.createObjectURL(value) : value || "";

  const displayName =
    value instanceof File
      ? value.name
      : value
      ? value.split("/").pop() || value
      : "";

  /* ---------- handlers ---------- */
  const handleFileSelect = (file: File) => {
    if (file.type.startsWith("image/")) {
      onChange(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
    // Reset input so the same file can be re-selected after removal
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleClear = () => {
    onChange(null);
  };

  /* ---------- render ---------- */
  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {/* Label */}
      {label && (
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 pb-1">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          {label}
        </span>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleInputChange}
      />

      {/* ── FILLED STATE ── compact card */}
      {preview ? (
        <div className="flex items-center justify-between p-3.5 px-4 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50/60 transition-colors group">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Thumbnail */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Image preview"
              className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-gray-200/70 shadow-sm"
            />
            {/* Name + sub-label */}
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-gray-900 truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                {displayName}
              </span>
              <span className="text-[10px] text-gray-400 font-semibold mt-0.5">
                {sublabel}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0 ml-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3.5 py-1.5 rounded-xl text-[10px] font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              Change
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="text-red-500 hover:text-red-600 p-2 bg-red-50 hover:bg-red-100 rounded-xl transition-all cursor-pointer"
              title="Remove image"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* ── EMPTY STATE ── drag-and-drop zone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`w-full border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-7 text-center cursor-pointer transition-all group
            ${
              isDragging
                ? "border-blue-500 bg-blue-50/30"
                : "border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50/10"
            }`}
        >
          <div
            className={`p-3 rounded-full mb-3 transition-all ${
              isDragging
                ? "bg-blue-500 text-white scale-110"
                : "bg-gray-100 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-500 group-hover:scale-105"
            }`}
          >
            <CloudUpload className="w-6 h-6" strokeWidth={1.75} />
          </div>
          <p className="text-[13px] font-semibold text-gray-500 group-hover:text-blue-600 transition-colors">
            <span className="text-blue-500 hover:underline">Click to upload</span>
            <span className="hidden sm:inline text-gray-400 font-normal">
              {" "}or drag and drop
            </span>
          </p>
          <p className="text-[11px] text-gray-400 mt-1">
            PNG, JPG or WEBP
          </p>
        </div>
      )}
    </div>
  );
}
