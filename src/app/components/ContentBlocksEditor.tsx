"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough as StrikethroughIcon,
  Quote as QuoteIcon,
  ListOrdered,
  List as ListIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  RemoveFormatting,
} from "lucide-react";
import toast from "react-hot-toast";
import { uploadFiles } from "@/lib/uploadHelpers";

export interface ContentBlock {
  type: "paragraph" | "heading" | "quote" | "list" | "image" | string;
  text?: string;
  items?: string[];
  image?: string;
  url?: string;
}

interface ContentBlocksEditorProps {
  label?: string;
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

// Convert ContentBlocks to HTML string for WYSIWYG contentEditable
function blocksToHtml(blocks: ContentBlock[]): string {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return "<p><br></p>";
  }
  return blocks
    .map((b) => {
      const text = b.text || "";
      if (b.type === "heading") {
        return `<h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-1 my-3">${text}</h2>`;
      }
      if (b.type === "quote") {
        return `<blockquote className="border-l-4 border-[#a0004f] pl-4 italic text-gray-700 bg-pink-50/30 py-2 px-3 my-3 rounded-r-lg">${text}</blockquote>`;
      }
      if (b.type === "list" && Array.isArray(b.items)) {
        const lis = b.items.map((item) => `<li>${item}</li>`).join("");
        return `<ul className="list-disc pl-5 my-3 space-y-1 text-gray-800">${lis}</ul>`;
      }
      if (b.type === "image") {
        const imgSrc = b.image || b.url || b.text || "";
        return `<div className="my-4"><img src="${imgSrc}" alt="Article Image" className="rounded-xl max-h-96 w-auto border border-gray-200 shadow-sm" /></div>`;
      }
      return `<p className="my-2 text-gray-800 leading-relaxed">${text}</p>`;
    })
    .join("");
}

// Parse HTML DOM from contentEditable into ContentBlock objects
function domToBlocks(container: HTMLDivElement): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const children = Array.from(container.childNodes);

  children.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      if (text) {
        blocks.push({ type: "paragraph", text });
      }
      return;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      const tag = el.tagName.toUpperCase();

      if (tag === "IMG") {
        const src = (el as HTMLImageElement).src;
        if (src) blocks.push({ type: "image", image: src, text: src });
        return;
      }

      // Check if node contains an image inside
      const imgChild = el.querySelector("img");
      if (imgChild && imgChild.src) {
        blocks.push({ type: "image", image: imgChild.src, text: imgChild.src });
      }

      const text = el.innerText?.trim() || el.textContent?.trim() || "";

      if (tag === "H1" || tag === "H2" || tag === "H3" || tag === "H4") {
        if (text) blocks.push({ type: "heading", text });
      } else if (tag === "BLOCKQUOTE") {
        if (text) blocks.push({ type: "quote", text });
      } else if (tag === "UL" || tag === "OL") {
        const items = Array.from(el.querySelectorAll("li"))
          .map((li) => li.innerText?.trim() || li.textContent?.trim() || "")
          .filter(Boolean);
        if (items.length > 0) {
          blocks.push({ type: "list", items });
        }
      } else if (text) {
        blocks.push({ type: "paragraph", text });
      }
    }
  });

  return blocks;
}

export function ContentBlocksEditor({
  label = "FULL ARTICLE CONTENT *",
  blocks,
  onChange,
}: ContentBlocksEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isUpdatingFromProp = useRef(false);
  const [selectedFormat, setSelectedFormat] = useState("p");

  const currentBlocks = Array.isArray(blocks) ? blocks : [];

  // Populate editor initial HTML or sync when external blocks change
  useEffect(() => {
    if (editorRef.current && !isUpdatingFromProp.current) {
      const targetHtml = blocksToHtml(currentBlocks);
      if (editorRef.current.innerHTML !== targetHtml) {
        editorRef.current.innerHTML = targetHtml;
      }
    }
    isUpdatingFromProp.current = false;
  }, [blocks]);

  const handleInput = useCallback(() => {
    if (!editorRef.current) return;
    isUpdatingFromProp.current = true;
    const parsedBlocks = domToBlocks(editorRef.current);
    onChange(parsedBlocks);
  }, [onChange]);

  const execCmd = (command: string, value: string = "") => {
    if (!editorRef.current) return;
    editorRef.current.focus();

    if (command === "formatBlock") {
      document.execCommand("formatBlock", false, value);
    } else {
      document.execCommand(command, false, value);
    }

    handleInput();
  };

  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedFormat(val);
    if (val === "p") execCmd("formatBlock", "<p>");
    else if (val === "h1") execCmd("formatBlock", "<h1>");
    else if (val === "h2") execCmd("formatBlock", "<h2>");
    else if (val === "h3") execCmd("formatBlock", "<h3>");
    else if (val === "quote") execCmd("formatBlock", "<blockquote>");
  };

  const handleLinkInsert = () => {
    const url = prompt("Enter link URL (e.g. https://example.com):");
    if (url) {
      execCmd("createLink", url);
    }
  };

  const handleImageFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const toastId = toast.loading("Uploading image...");
      try {
        const urls = await uploadFiles([file]);
        if (urls[0]) {
          execCmd("insertImage", urls[0]);
          toast.success("Image inserted!", { id: toastId });
        }
      } catch (err) {
        console.error(err);
        toast.error("Image upload failed.", { id: toastId });
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Label */}
      {label && (
        <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">
          {label}
        </label>
      )}

      {/* Hidden File Input for Images */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageFileSelect}
        accept="image/*"
        className="hidden"
      />

      {/* Editor Container Card */}
      <div className="border border-gray-200 rounded-[20px] bg-white overflow-hidden shadow-2xs transition-all focus-within:border-[#a0004f] focus-within:ring-1 focus-within:ring-[#a0004f]">
        
        {/* Top Floating Toolbar */}
        <div className="bg-gray-50/80 border-b border-gray-200/70 px-4 py-2.5 flex flex-wrap items-center gap-3">
          
          {/* Format Select Dropdown */}
          <div className="relative flex items-center">
            <select
              value={selectedFormat}
              onChange={handleFormatChange}
              className="bg-transparent text-sm font-semibold text-gray-800 pr-5 py-1 focus:outline-none cursor-pointer appearance-none"
            >
              <option value="p">Normal</option>
              <option value="h1">Heading 1</option>
              <option value="h2">Heading 2</option>
              <option value="h3">Heading 3</option>
              <option value="quote">Quote</option>
            </select>
            <span className="pointer-events-none text-gray-400 text-xs ml-1">↕</span>
          </div>

          <div className="h-4 w-px bg-gray-200" />

          {/* Bold */}
          <button
            type="button"
            onClick={() => execCmd("bold")}
            className="text-gray-700 hover:text-black p-1.5 rounded hover:bg-gray-200/50 cursor-pointer font-bold text-sm transition-colors"
            title="Bold"
          >
            <Bold size={16} />
          </button>

          {/* Italic */}
          <button
            type="button"
            onClick={() => execCmd("italic")}
            className="text-gray-700 hover:text-black p-1.5 rounded hover:bg-gray-200/50 cursor-pointer text-sm transition-colors"
            title="Italic"
          >
            <Italic size={16} />
          </button>

          {/* Underline */}
          <button
            type="button"
            onClick={() => execCmd("underline")}
            className="text-gray-700 hover:text-black p-1.5 rounded hover:bg-gray-200/50 cursor-pointer text-sm transition-colors"
            title="Underline"
          >
            <UnderlineIcon size={16} />
          </button>

          {/* Strikethrough */}
          <button
            type="button"
            onClick={() => execCmd("strikeThrough")}
            className="text-gray-700 hover:text-black p-1.5 rounded hover:bg-gray-200/50 cursor-pointer text-sm transition-colors"
            title="Strikethrough"
          >
            <StrikethroughIcon size={16} />
          </button>

          {/* Blockquote */}
          <button
            type="button"
            onClick={() => execCmd("formatBlock", "<blockquote>")}
            className="text-gray-700 hover:text-black p-1.5 rounded hover:bg-gray-200/50 cursor-pointer text-sm transition-colors"
            title="Quote"
          >
            <QuoteIcon size={16} />
          </button>

          <div className="h-4 w-px bg-gray-200" />

          {/* Numbered List */}
          <button
            type="button"
            onClick={() => execCmd("insertOrderedList")}
            className="text-gray-700 hover:text-black p-1.5 rounded hover:bg-gray-200/50 cursor-pointer text-sm transition-colors"
            title="Numbered List"
          >
            <ListOrdered size={16} />
          </button>

          {/* Bullet List */}
          <button
            type="button"
            onClick={() => execCmd("insertUnorderedList")}
            className="text-gray-700 hover:text-black p-1.5 rounded hover:bg-gray-200/50 cursor-pointer text-sm transition-colors"
            title="Bullet List"
          >
            <ListIcon size={16} />
          </button>

          <div className="h-4 w-px bg-gray-200" />

          {/* Insert Link */}
          <button
            type="button"
            onClick={handleLinkInsert}
            className="text-gray-700 hover:text-black p-1.5 rounded hover:bg-gray-200/50 cursor-pointer text-sm transition-colors"
            title="Insert Link"
          >
            <LinkIcon size={16} />
          </button>

          {/* Upload Image */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-gray-700 hover:text-black p-1.5 rounded hover:bg-gray-200/50 cursor-pointer text-sm transition-colors"
            title="Upload Image"
          >
            <ImageIcon size={16} />
          </button>

          {/* Clear Formatting */}
          <button
            type="button"
            onClick={() => execCmd("removeFormat")}
            className="text-gray-500 hover:text-red-500 p-1.5 rounded hover:bg-gray-200/50 cursor-pointer text-sm transition-colors ml-auto"
            title="Clear Formatting"
          >
            <RemoveFormatting size={16} />
          </button>
        </div>

        {/* Typing Canvas */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onBlur={handleInput}
          className="p-6 min-h-[220px] font-sans text-sm text-gray-800 outline-none leading-relaxed cursor-text prose prose-sm max-w-none"
          style={{ minHeight: "220px" }}
        />
      </div>
    </div>
  );
}
