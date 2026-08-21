"use client";

import React, { useState, useEffect } from "react";
import { fetchWithCache } from "@/lib/apiCache";
import toast from "react-hot-toast";
import { InputField } from "@/components/InputField";
import { SaveButton } from "@/components/SaveButton";
import { SectionHeader } from "@/components/SectionHeader";
import { ContentBlocksEditor, ContentBlock } from "@/app/components/ContentBlocksEditor";

const defaultContentBlocks: ContentBlock[] = [
  {
    type: "heading",
    text: "Privacy Preference & Cookies Overview",
  },
  {
    type: "paragraph",
    text: "We use cookies and similar technologies on our website www.encotecenergy.com. Some of them are essential, while others help us to improve this website and your experience.",
  },
  {
    type: "heading",
    text: "Essential Cookies (Always Active)",
  },
  {
    type: "paragraph",
    text: "Essential cookies enable basic functions and are strictly necessary for the proper functioning of the website:",
  },
  {
    type: "list",
    items: [
      "borlabs-cookie — Provider: Encotec Energy (India) — Purpose: Saves the visitor preferences selected in the Cookie Box — Duration: 1 Year",
      "pll_language — Provider: Encotec Energy (India) — Purpose: Saves the visitor language preferences — Duration: 1 Year",
    ],
  },
  {
    type: "heading",
    text: "Statistics & Performance Cookies (Optional)",
  },
  {
    type: "paragraph",
    text: "Statistics cookies collect information anonymously to help us understand how visitors use our website:",
  },
  {
    type: "list",
    items: [
      "Google Tag Manager & Analytics (_ga, _gid, gtag) — Provider: Google Ireland Limited — Purpose: Aggregated telemetry and visitor traffic statistics — Duration: 2 Years / 24 Hours",
    ],
  },
  {
    type: "heading",
    text: "How to Manage & Disable Cookies in Your Browser",
  },
  {
    type: "list",
    items: [
      "Google Chrome: Settings > Privacy and security > Third-party cookies",
      "Mozilla Firefox: Settings > Privacy & Security > Cookies and Site Data",
      "Apple Safari: Preferences > Privacy > Block all cookies / Manage Website Data",
      "Microsoft Edge: Settings > Cookies and site permissions",
    ],
  },
  {
    type: "heading",
    text: "Contact & Privacy Inquiries",
  },
  {
    type: "quote",
    text: "Encotec Energy (India) Pvt. Ltd.\nC-85, Sector-63, Noida-201 301, Uttar Pradesh, India\nPhone: +91 120 4155612 | Email: rajeev.ahuja@encotecenergy.com",
  },
];

const defaultFormData = {
  headline: "Cookie Policy",
  breadcrumb: "Start / Cookie Policy",
  contentBlocks: defaultContentBlocks,
};

export function CookiePolicyCMS() {
  const [isOpen, setIsOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    fetchWithCache("/api/cookie-policy")
      .then((data) => {
        if (data && data.CookieContent) {
          const cc = data.CookieContent;
          setFormData({
            headline: cc.headline || "Cookie Policy",
            breadcrumb: cc.breadcrumb || "Start / Cookie Policy",
            contentBlocks:
              Array.isArray(cc.contentBlocks) && cc.contentBlocks.length > 0
                ? cc.contentBlocks
                : defaultContentBlocks,
          });
        }
      })
      .catch((err) => {
        console.error("Error fetching cookie policy:", err);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch("/api/cookie-policy", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "CookieContent",
          content: formData,
        }),
      });

      if (!res.ok) throw new Error("Failed to save changes");
      toast.success("Cookie Policy content saved successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Error saving Cookie Policy");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col gap-6">
      <SectionHeader
        title="Cookie Policy Article Editor"
        description="Write and manage the Cookie Policy content in a blog/article format with custom headings, lists, quotes, and cookie descriptions."
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Page Headline"
              name="headline"
              value={formData.headline}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, headline: e.target.value }))
              }
              placeholder="Cookie Policy"
            />
            <InputField
              label="Breadcrumb Text"
              name="breadcrumb"
              value={formData.breadcrumb}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, breadcrumb: e.target.value }))
              }
              placeholder="Start / Cookie Policy"
            />
          </div>

          <div className="border-t border-gray-100 pt-6">
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Cookie Policy Article Body (Blog-Style Rich Text Editor)
            </label>
            <p className="text-xs text-gray-500 mb-4">
              Edit cookie descriptions, add table items, bullet points, or instructions using the formatting tools below.
            </p>
            <ContentBlocksEditor
              label="Cookie Policy Content"
              blocks={formData.contentBlocks}
              onChange={(newBlocks) =>
                setFormData((prev) => ({ ...prev, contentBlocks: newBlocks }))
              }
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <SaveButton disabled={isSaving} label="Publish Cookie Policy Changes" />
          </div>
        </form>
      )}
    </div>
  );
}
