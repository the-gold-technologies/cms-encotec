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
    text: "General Information",
  },
  {
    type: "paragraph",
    text: "Below we inform you about the collection of personal data when using our website www.encotecenergy.com.",
  },
  {
    type: "list",
    items: [
      "1. The term 'personal data', with reference to the definition in Art. 4 No. 1 of Regulation (EU) 2016/679 (DSGVO / GDPR) and applicable data protection frameworks, means all data that can be related to you personally. This includes, for example, name, address, e-mail addresses and user behaviour.",
      "2. We process personal data as a matter of principle only to the extent necessary to provide a functioning website and the content and services offered by us.",
      "3. Your personal data will be deleted or blocked as soon as the purpose of storage no longer applies or statutory retention periods expire.",
      "4. If we use contracted service providers for individual functions on our website or use your data for advertising purposes, we will inform you below in detail.",
    ],
  },
  {
    type: "heading",
    text: "Responsible Office (Data Controller)",
  },
  {
    type: "quote",
    text: "Encotec Energy (India) Pvt. Ltd.\nlegally represented by the managing directors Arun Kumar Sarna, Rajeev Ahuja, Dr. Ralf Gilgen\n\nC-85, Sector-63\nNoida-201 301, Uttar Pradesh, India\nPhone: +91 120 4155612 | Fax: +91 120 4540611\nEmail: rajeev.ahuja@encotecenergy.com",
  },
  {
    type: "heading",
    text: "Data Protection Officer",
  },
  {
    type: "paragraph",
    text: "You can contact our data protection officer at: Rajeev Ahuja, Encotec Energy (India) Pvt. Ltd., C-85, Sector-63, Noida-201 301, Uttar Pradesh, India. Phone: +91 120 4155612, Email: rajeev.ahuja@encotecenergy.com",
  },
  {
    type: "heading",
    text: "Your Rights",
  },
  {
    type: "list",
    items: [
      "The right to information / access to personal data stored with us",
      "The right to rectification of inaccurate data and erasure ('right to be forgotten')",
      "The right to restriction of data processing during verification",
      "The right to object to data processing for legitimate reasons or marketing",
      "The right to data portability in machine-readable format",
      "The right to complain to the responsible data protection supervisory authority",
    ],
  },
  {
    type: "heading",
    text: "Processing of Personal Data for Informational Website Use",
  },
  {
    type: "paragraph",
    text: "If you access our website without registering, we only collect technically necessary data transmitted by your browser to ensure security and uptime stability:",
  },
  {
    type: "list",
    items: [
      "Browser type and browser version",
      "Operating system used",
      "Referrer URL",
      "Hostname of accessing computer",
      "Time of the server request",
      "IP address (stored in server log files for max 7 days)",
    ],
  },
  {
    type: "heading",
    text: "Processing of Personal Data by Cookies",
  },
  {
    type: "paragraph",
    text: "We use transient (session) and persistent cookies to remember visitor preferences and security tokens. For a detailed breakdown of all active cookies and settings, visit our Cookie Policy.",
  },
  {
    type: "heading",
    text: "Processing of Personal Data for Job Applications",
  },
  {
    type: "paragraph",
    text: "When you apply for positions at Encotec Energy, submitted resume and credential details are processed exclusively for recruitment evaluations and stored up to 6 months.",
  },
  {
    type: "heading",
    text: "Compliance & Whistleblower Directive",
  },
  {
    type: "quote",
    text: "personal / confidential / locked\nLegal Counsel / Compliance Officer\nEncotec Energy (India) Pvt. Ltd.\nC-85, Sector-63\nNoida-201 301\nUttar Pradesh, India",
  },
];

const defaultFormData = {
  headline: "Privacy Policy",
  breadcrumb: "Start / Privacy Policy",
  contentBlocks: defaultContentBlocks,
};

export function PrivacyPolicyCMS() {
  const [isOpen, setIsOpen] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    fetchWithCache("/api/privacy-policy")
      .then((data) => {
        if (data && data.PrivacyContent) {
          const pc = data.PrivacyContent;
          setFormData({
            headline: pc.headline || "Privacy Policy",
            breadcrumb: pc.breadcrumb || "Start / Privacy Policy",
            contentBlocks:
              Array.isArray(pc.contentBlocks) && pc.contentBlocks.length > 0
                ? pc.contentBlocks
                : defaultContentBlocks,
          });
        }
      })
      .catch((err) => {
        console.error("Error fetching privacy policy:", err);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch("/api/privacy-policy", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: "PrivacyContent",
          content: formData,
        }),
      });

      if (!res.ok) throw new Error("Failed to save changes");
      toast.success("Privacy Policy blog/article content saved successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Error saving Privacy Policy");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col gap-6">
      <SectionHeader
        title="Privacy Policy Article Editor"
        description="Write and customize the Privacy Policy just like a blog post or article with headings, paragraphs, lists, quotes, and rich formatting."
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
              placeholder="Privacy Policy"
            />
            <InputField
              label="Breadcrumb Text"
              name="breadcrumb"
              value={formData.breadcrumb}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, breadcrumb: e.target.value }))
              }
              placeholder="Start / Privacy Policy"
            />
          </div>

          <div className="border-t border-gray-100 pt-6">
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Privacy Policy Article Body (Blog-Style Rich Text Editor)
            </label>
            <p className="text-xs text-gray-500 mb-4">
              Use the toolbar below to format text, add headings (H2), bulleted/numbered lists, quotes, images, or links freely.
            </p>
            <ContentBlocksEditor
              label="Policy Content"
              blocks={formData.contentBlocks}
              onChange={(newBlocks) =>
                setFormData((prev) => ({ ...prev, contentBlocks: newBlocks }))
              }
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <SaveButton disabled={isSaving} label="Publish Privacy Policy Changes" />
          </div>
        </form>
      )}
    </div>
  );
}
